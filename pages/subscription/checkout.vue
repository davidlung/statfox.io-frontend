<template>
    <v-container class="max-w-600">

        <!-- TITLE -->
        <div class="mb-10">
            <div class="text-center text-h5 my-10">{{$t('checkout_title')}}</div>
            <div class="text-center subtitle-2">{{$t('checkout_subtitle')}}</div>
        </div>

        <!-- SELECTED PLAN -->
        <div class="mb-10">
            <j-section-title>{{$t('selected_plan')}}</j-section-title>
            <SelectedPlan/>
        </div>

        <!-- BILLING INFO -->
        <div class="mb-10">
            <j-section-title>{{$t('billing_information')}}</j-section-title>
            <v-skeleton-loader :loading="paymentMethods.length===0">
                <v-card outlined>
                    <v-card-text>
                        <div>{{paymentMethod.billing.name}}</div>
                        <div>{{paymentMethod.billing.address.line1}}</div>
                        <div>{{paymentMethod.billing.address.city}}</div>
                        <div>{{paymentMethod.billing.address.country}} {{paymentMethod.billing.address.postalCode}}</div>
                        <div>{{paymentMethod.billing.email}}</div>
                    </v-card-text>
                </v-card>
            </v-skeleton-loader>
        </div>

        <!-- PAYMENT METHOD -->
        <template v-if="paymentMethod">
            <j-section-title>{{$t('payment_method')}}</j-section-title>
            <v-card outlined class="mb-8">
                <v-card-title>
                    <v-icon class="pr-5">mdi-credit-card-outline</v-icon>
                    <span>{{paymentMethod.card.brand.toUpperCase()}}</span>
                    <v-spacer></v-spacer>
                    <div class="text-body-1">
                        <div class="caption">{{$t('card_expiry')}}</div>
                        {{paymentMethod.card.expMonth}}/{{paymentMethod.card.expYear}}
                    </div>
                    <v-spacer></v-spacer>
                    <div class="text-body-1">
                        <div class="caption text-right">{{$t('card_last4')}}</div>
                        **** **** **** {{paymentMethod.card.last4}}
                    </div>
                </v-card-title>
            </v-card>
            <div class="d-flex mt-8">
                <v-btn depressed large text nuxt to="/subscription/payment" :disabled="pending">
                    <v-icon>mdi-chevron-left</v-icon>
                    {{$t('change_payment_method')}}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn depressed large color="primary" type="submit" :loading="pending" @click="subscribe" class="px-10">
                    {{$t('subscribe')}} <span class="d-inline-block mx-2">/</span> {{price.currencySign}}{{price.amount/100}}
                </v-btn>
            </div>
        </template>

        <div class="caption text--secondary text-center py-10">
            {{$t('checkout_law_info', ['Stripe Inc.', $config.BRAND_ALT_3])}}
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

                        await this.$store.dispatch('showLoadingOverlay', this.$t('payment_please_wait'))
                        let secret = res.data.latestInvoice.paymentIntent.clientSecret
                        let stripe = await this.$stripe()

                        stripe.confirmCardPayment(secret, {payment_method: this.paymentMethod.id}).then(result => {
                            if (result.error || result.paymentIntent.status !== 'succeeded') {
                                this.$toast.error(this.$t('payment_error.could_not_charged') +
                                    (result.error?' ('+result.error.message+') ':' ')+this.$t('payment_error.try_other_card')
                                )
                                this.$router.push('/subscription/issue')
                                return res
                            }
                            this.$store.dispatch('account/synchronizeSubscription').then(res => {
                                this.$router.push('/subscription/success')
                            }).catch(e => {
                                this.$router.push('/subscription/success')
                            })
                        }).catch(e => {
                            this.$toast.error(this.$t('something_went_wrong'))
                            setTimeout(() => window.location.href = '/subscription', 2000)
                        });

                        return res
                    }

                    if (status === 'requires_payment_method') {
                        this.$toast.error(this.$t('could_not_charged_default'))
                        await this.$router.push('/subscription/issue')
                        return res
                    }

                    await this.$router.push('/subscription/success')
                })
            }
        }

    }
</script>
