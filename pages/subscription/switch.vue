<template>
    <v-container class="max-w-600">

        <div class="text-center text-h5 my-10">Switch plan</div>
        <div class="text-center subtitle-2">Preview your plan switch</div>

        <!-- SELECTED PLAN -->
        <CurrentPlan :disable-actions="true"/>
        <SelectedPlan/>

        <!-- PAYMENT METHOD -->
        <template v-if="paymentMethod">
            <j-section-title>Current Default Payment Method</j-section-title>
            <v-card outlined class="mb-8">
                <v-card-title>
                    <v-icon class="pr-5">mdi-credit-card-outline</v-icon>
                    <span>{{paymentMethod.card.brand.toUpperCase()}}</span>
                    <v-spacer></v-spacer>
                    <div class="text-body-1">
                        <div class="caption">EXPIRY</div>
                        {{paymentMethod.card.expMonth}}/{{paymentMethod.card.expYear}}
                    </div>
                    <v-spacer></v-spacer>
                    <div class="text-body-1">
                        <div class="caption text-right">LAST 4</div>
                        **** **** **** {{paymentMethod.card.last4}}
                    </div>
                </v-card-title>
            </v-card>
        </template>

        <!-- PROPORTIONS / INCOMMING INVOICE -->
        <v-skeleton-loader :loading="!upcomingInvoice" type="paragraph">
            <div></div>
            <template v-if="upcomingInvoice">
                <div v-for="line in lines" :key="line.id" class="d-flex">
                    <span class="text--secondary">{{line.description}}</span>
                    <v-spacer></v-spacer>
                    <span>{{line.amount/100}} {{currencySign}}</span>
                </div>

                <v-divider class="my-3"></v-divider>

                <div v-for="line in calculationLines" :key="line.id" class="d-flex">
                    <span>{{line.description}}</span>
                    <v-spacer></v-spacer>
                    <span>{{line.amount/100}} {{currencySign}}</span>
                </div>
            </template>
        </v-skeleton-loader>

        <v-divider class="my-3"></v-divider>

        <!-- ACTION BUTTONS -->
        <div class="d-flex mt-8">
            <v-btn depressed text nuxt to="/subscription/payment" :disabled="pending">
                <v-icon>mdi-chevron-left</v-icon>
                Change payment method
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" type="submit" :disabled="!upcomingInvoice||overlay.loading.show" :loading="pending" @click="subscribe" class="px-10">
                {{switchType}} <span class="d-inline-block mx-2">/</span> {{currencySign}}{{amountDue}}
            </v-btn>
        </div>
        <div class="caption text--secondary text-center py-10">
            By confirming your subscription, you agree that {{$config.DOMAIN}} may charge your card for this and future
            payments in accordance with the Terms of Use.
        </div>

    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../../components/JSectionTitle";
    import SelectedPlan from "../../components/subscription/SelectedPlan";
    import CurrentPlan from "../../components/subscription/CurrentPlan";

    export default {

        head: {
            title: "Subscription"
        },

        components: {
            CurrentPlan,
            SelectedPlan,
            JSectionTitle,
        },

        async middleware({store, redirect}) {
            let subscription = store.state.account.subscription;
            let selectedPriceId = store.state.subscription.selection.priceId

            if(
                selectedPriceId === null || subscription === null || subscription.cancelAt ||
                subscription.status !== 'active' || selectedPriceId === subscription.item.priceId
            ) {
                redirect('/subscription')
            }
            store.dispatch('account/loadPaymentMethods')
        },

        mounted() {
            this.$axios.post('/api/v1/account/subscription:proration', {priceId:this.priceId}).then(res => {
                this.upcomingInvoice = res.data
            })
        },

        data() {
            return {
                upcomingInvoice: null,
            }
        },

        computed: {
            ...mapState({
                overlay: state => state.overlay,
                billing: state => state.account.billing,
                plans: state => state.subscription.plans,
                currency: state => state.subscription.selection.currency,
                interval: state => state.subscription.selection.interval,
                priceId: state => state.subscription.selection.priceId,
                paymentMethods: state => state.account.paymentMethods,
                subscription: state => state.account.subscription,
                pending: state => state.pending.account.switchSubscription,
            }),

            price() {
                return this.plan.prices.find(p => p.currency===this.currency && p.interval===this.interval)
            },

            plan() {
                return this.plans.find(p => p.prices.filter(pr => pr.id === this.priceId).length>0)
            },

            paymentMethod() {
                return this.paymentMethods.find(p => p.id === this.billing.defaultPaymentMethod)
            },

            currencySign() {
                return {usd:'$', eur:'€'}[this.currency]
            },

            lines() {
                if(this.upcomingInvoice){
                    if (this.hasSameInterval) {
                        return this.upcomingInvoice.lines.filter(l => l.proration)
                    }
                    return this.upcomingInvoice.lines
                }

                return [];
            },

            calculationLines() {
                let lines = [], total = 0;
                this.lines.forEach(l => total += l.amount)

                if (this.hasSameInterval && this.isDowngrade) {
                    lines.push({
                        amount: total,
                        description: 'Amount which will be offset against upcoming invoices.'
                    })
                }else{
                    let date = (new Date(this.upcomingInvoice.nextPaymentAttempt*1000)).toLocaleDateString()
                    let balance = this.billing.balance

                    if (balance !== 0){
                        lines.push({
                            amount: total,
                            description: 'Total'
                        })
                        if (balance < 0 && total > 0 && Math.abs(balance) > total) {
                            balance = -total
                        }
                        lines.push({
                            amount: balance,
                            description: 'Applied Balance'
                        })
                        lines.push({
                            amount: total+balance,
                            description: 'Amount due on '+date
                        })
                    }else{
                        lines.push({
                            amount: total,
                            description: 'Total amount due on '+date
                        })
                    }
                }

                return lines
            },

            amountDue() {
                let due = this.billing.balance;
                this.lines.forEach(l => due += l.amount)
                return due > 0 ? due/100 : 0
            },

            hasSameInterval() {
                return this.subscription.plan.interval === this.price.interval
            },

            switchType() {
                if (this.isUpgrade) return 'Upgrade'
                if (this.isDowngrade) return 'Downgrade'
                return 'Switch'
            },

            isUpgrade() {
                let currentLevel = this.plans.find(p=>p.id === this.subscription.plan.internalPlanId).level
                return this.plan.level > currentLevel
            },

            isDowngrade() {
                let currentLevel = this.plans.find(p=>p.id === this.subscription.plan.internalPlanId).level
                return this.plan.level < currentLevel
            },
        },

        methods: {
            subscribe() {
                this.$store.dispatch('account/switchSubscription', this.priceId).then(async (res) => {
                    let status = res.data.latestInvoice.paymentIntent.status

                    if (status === 'requires_action') {

                        this.$store.dispatch('showLoadingOverlay', 'Please wait and don\'t close this window...')
                        let secret = res.data.latestInvoice.paymentIntent.clientSecret
                        let stripe = await this.$stripe()

                        stripe.confirmCardPayment(secret, {payment_method: this.paymentMethod.id}).then(result => {
                            if (result.error || result.paymentIntent.status !== 'succeeded') {
                                this.$toast.error('Your default payment method could not be charged.' +
                                    (result.error?' ('+result.error.message+')':'')+' Please try an other credit card.')
                                this.$router.push('/subscription/issue')
                                return res
                            }
                            this.$store.dispatch('account/synchronizeSubscription').then(res => {
                                this.$router.push('/subscription/success')
                            }).catch(e => {
                                this.$router.push('/subscription/success')
                            })
                        }).catch(e => {
                            this.$toast.error('Sorry, but something went wrong with the payment processor. ' +
                                'You can retry this process by following the instructions via the subscription issue info.')
                            setTimeout(() => window.location.href = '/subscription', 2000)
                        });

                        return res
                    }

                    if (status === 'requires_payment_method') {
                        this.$toast.error('Your default payment method could not be charged. Please try an other credit card.')
                        await this.$router.push('/subscription/issue')
                        return res
                    }

                    await this.$router.push('/subscription/success')
                })
            }
        }

    }
</script>
