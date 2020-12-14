<template>
    <v-container class="max-w-600">

        <div class="text-center text-h5 my-10">Checkout</div>
        <div class="text-center subtitle-2">Preview your order and pay finally subscription</div>

        <!-- SELECTED PLAN -->
        <SelectedPlan/>

        <!-- BILLING INFO -->
        <j-section-title>Billing Information</j-section-title>
        <v-skeleton-loader :loading="paymentMethods.length===0">
            <v-card outlined class="pa-5 mb-8">
                <v-row v-if="paymentMethod">
                    <v-col cols="6">
                        <div>{{paymentMethod.billing.name}}</div>
                        <div>{{paymentMethod.billing.address.line1}}</div>
                        <div>{{paymentMethod.billing.address.city}}</div>
                        <div>{{paymentMethod.billing.address.country}} {{paymentMethod.billing.address.postalCode}}</div>
                    </v-col>
                    <v-col cols="1">
                        <v-divider vertical></v-divider>
                    </v-col>
                    <v-col cols="5" class="text-right">
                        <div>{{paymentMethod.billing.email}}</div>
                        <v-divider class="my-4"></v-divider>
                        <div>{{(new Date()).toLocaleDateString()}}</div>
                        <div class="font-weight-medium">{{price.currencySign}}{{price.amount/100}} /{{interval}}</div>
                    </v-col>
                </v-row>
            </v-card>
        </v-skeleton-loader>

        <!-- PAYMENT METHOD -->
        <template v-if="paymentMethod">
            <j-section-title>Your Payment Method</j-section-title>
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

        <div class="d-flex mt-8">
            <v-btn depressed text nuxt to="/subscription/payment" :disabled="pending">
                <v-icon>mdi-chevron-left</v-icon>
                Change payment method
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" type="submit" :loading="pending" @click="subscribe" class="px-10">
                Subscribe <span class="d-inline-block mx-2">/</span> {{price.currencySign}}{{price.amount/100}}
            </v-btn>
        </div>
        <div class="caption text--secondary text-center py-10">
            By confirming your subscription, you agree that jsonserver.io may charge your card for this and future
            payments in accordance with the Terms of Use.
        </div>

    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../../components/JSectionTitle";
    import SelectedPlan from "../../components/subscription/SelectedPlan";
    import SubscriptionProblem from "../../components/subscription/SubscriptionProblem";

    export default {

        head: {
            title: "Subscription"
        },

        components: {
            SubscriptionProblem,
            SelectedPlan,
            JSectionTitle,
        },

        async middleware({store, redirect}) {
            if(store.state.subscription.selection.priceId === null) {
                redirect('/subscription')
            }
            await store.dispatch('account/loadPaymentMethods')
            let account = store.state.account
            if(account.billing.defaultPaymentMethod === null || account.paymentMethods.length === 0) {
                redirect('/subscription/payment')
            }
        },

        computed: {
            ...mapState({
                billing: state => state.account.billing,
                plans: state => state.subscription.plans,
                currency: state => state.subscription.selection.currency,
                interval: state => state.subscription.selection.interval,
                priceId: state => state.subscription.selection.priceId,
                paymentMethods: state => state.account.paymentMethods,
                subscription: state => state.account.subscription,
                pending: state => state.pending.account.createSubscription
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
        },

        methods: {
            subscribe() {
                this.$store.dispatch('account/createSubscription', this.priceId).then(async (res) => {
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
