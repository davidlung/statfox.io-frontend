<template>
    <v-card flat :dark="!text" :color="text?'transparent':'red'" class="my-6" v-if="subscriptionProblem">
        <v-card-title :class="text?'red--text':'white--text'">
            {{$t('subscription_issue')}}
        </v-card-title>
        <v-card-text :class="text?'':'white--text'">
            <div>{{subscriptionProblem}}</div>
            <v-divider class="my-3"></v-divider>
            <div v-if="invoiceProblem" class="text-subtitle-1">{{invoiceProblem}}</div>
            <div v-if="paymentProblem">{{paymentProblem}}</div>
        </v-card-text>
        <v-card-text :class="text?'':'white--text'">
            <CreateCardDialog v-if="showAddCreditCard" @success="reattemptPayment()">
                <template v-slot:activator="{on, attrs}">
                    <v-btn depressed v-on="on" :color="text?'primary':'white black--text'">
                        {{$t('add_different_card')}}
                    </v-btn>
                </template>
            </CreateCardDialog>
            <template v-if="paymentMethods.length > 1">
                <v-divider class="my-5"></v-divider>
                <div class="text-subtitle-1 mb-5">{{$t('or_use_existed_card')}}</div>
                <v-card dark hover nuxt link
                        color="blue-grey"
                        class="mb-4"
                        :ripple="false"
                        :disabled="pendingReattempt"
                        @click="reattemptPayment(paymentMethod.id)"
                        v-for="paymentMethod in paymentMethods.filter(p => p.id !== billing.defaultPaymentMethod)"
                        :key="`p-${paymentMethod.id}`">
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
            </template>
            <v-btn depressed :color="text?'primary':'white black--text'" v-if="showAuthButton" @click="reattemptPayment()">
                {{$t('perform_authentication')}}
            </v-btn>
        </v-card-text>
        <v-overlay :value="pendingReattempt" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import CreateCardDialog from "../payment/CreateCardDialog"

    export default {

        components: {
            CreateCardDialog
        },

        props: {
            text: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        mounted() {
            if (this.subscriptionProblem) {
                this.$store.dispatch('account/loadPaymentMethods')
            }
        },

        data() {
            return {
                pendingReattempt: false
            }
        },

        computed: {
            ...mapState({
                subscription: state => state.account.subscription,
                billing: state => state.account.billing,
                paymentMethods: state => state.account.paymentMethods,
            }),

            subscriptionProblem() {
                if (!this.subscription) {
                    return null
                }

                if (this.subscription.status === 'incomplete') {
                    let remaining = this.$time.remaining(this.subscription.created + 82800)
                    return this.$t('subscription_problem_incomplete_info', [remaining])
                }

                if (this.subscription.status === 'past_due') {
                    return this.$t('subscription_problem_past_due_info')
                }

                if (this.subscription.status === 'unpaid') {
                    return this.$t('subscription_problem_unpaid_info')
                }

                return null
            },

            invoiceProblem() {
                if (this.subscription.latestInvoice.status === 'open') {
                    return this.$t('invoice_problem_open_info')
                }

                return null
            },

            paymentProblem() {
                if (this.subscription.latestInvoice.paymentIntent.status === 'requires_payment_method') {
                    return this.$t('payment_problem_requires_payment_method')
                }
                if (this.subscription.latestInvoice.paymentIntent.status === 'requires_action') {
                    return this.$t('payment_problem_requires_action')
                }

                return null
            },

            showAddCreditCard() {
                return this.subscription.latestInvoice.paymentIntent.status === 'requires_payment_method'
            },

            showAuthButton() {
                return this.subscription.latestInvoice.paymentIntent.status === 'requires_action'
            }
        },

        methods: {

            async reattemptPayment(paymentMethodId) {
                this.pendingReattempt = true

                if (paymentMethodId !== undefined) {
                    await this.$store.dispatch('account/setDefaultPaymentMethod', paymentMethodId)
                }

                let stripe = await this.$stripe()

                stripe.confirmCardPayment(this.subscription.latestInvoice.paymentIntent.clientSecret, {
                    payment_method: this.billing.defaultPaymentMethod
                }).then(result => {
                    if (result.error) {
                        this.$toast.error(result.error.message +' '+ this.$t('payment_error_try_another_card'))
                        this.pendingReattempt = false
                    } else {
                        if (result.paymentIntent.status === 'succeeded') {
                            this.$store.dispatch('account/synchronizeSubscription').then(res => {
                                this.$emit('solved')
                            }).catch(e => {
                                this.$emit('solved')
                            }).finally(() => {
                                this.pendingReattempt = false
                            })
                        }else{
                            this.$toast.error(this.$t('payment_error_try_another_card', [result.paymentIntent.status]))
                            this.pendingReattempt = false
                        }
                    }
                }).catch((error) => {
                    this.$error(error)
                    this.pendingReattempt = false
                })
            }

        }

    }
</script>
