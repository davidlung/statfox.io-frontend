<template>
        <v-card v-if="subscription" outlined>
            <v-card-title class="text-overline pb-0">
                <span>{{name}}</span>
                <v-spacer></v-spacer>
                <span :class="`${status.color}--text`">
                     <v-skeleton-loader tile min-width="150" :loading="pending" type="text">
                        {{status.name}}
                    </v-skeleton-loader>
                </span>
                <span class="red--text text-caption pl-2" v-if="status.info"> ({{status.info}})</span>
            </v-card-title>
            <v-card-text class="text-h6 pb-0 d-flex">
                <span>{{pageViews.toLocaleString()}}</span>
                <v-spacer></v-spacer>
                <span>
                    <v-skeleton-loader tile min-width="100" :loading="pending" type="text">
                        <div class="" v-show="!pending">
                            {{{usd:'$', eur:'€'}[currency]}}{{amount/100}}
                            <span class="text-caption">{{$t('per_interval', [$t(interval)])}}</span>
                        </div>
                    </v-skeleton-loader>
                </span>
            </v-card-text>
            <v-card-text class="text-caption pt-0 d-flex">
                <span>{{$t('page_view_month')}}</span>
                <v-spacer></v-spacer>
                <v-btn v-if="!disableActions" icon small @click="showDetails=!showDetails" >
                    <v-icon>{{showDetails?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
                </v-btn>
            </v-card-text>
            <template v-if="showDetails">
                <v-divider></v-divider>
                <v-card-text class="pt-0">
                    <v-row>
                        <v-col>
                            <InputLabel>{{$t('subscription_created_at')}}</InputLabel>
                            {{this.$time.dateString(subscription.created)}}
                            <InputLabel>{{$t('subscription_started_at')}}</InputLabel>
                            {{this.$time.dateString(subscription.startDate)}}
                            <InputLabel>{{$t('subscription_billing_cycle_anchor')}}</InputLabel>
                            {{this.$time.dateString(subscription.billingCycleAnchor)}}
                        </v-col>
                        <v-col>
                            <InputLabel>{{$t('subscription_current_period')}}</InputLabel>
                            {{this.$time.dateString(subscription.currentPeriodStart)}} -
                            {{this.$time.dateString(subscription.currentPeriodEnd)}}
                            <InputLabel>{{$t('status')}}</InputLabel>
                            {{subscription.status.replace(/_/g,' ')}}
                        </v-col>

                        <v-col>
                            <div v-if="subscription.cancelAt" class="mb-5">
                                <InputLabel>{{$t('subscription_canceled_at')}}</InputLabel>
                                {{this.$time.dateString(subscription.canceledAt)}}
                                <InputLabel>{{$t('subscription_cancel_at')}}</InputLabel>
                                {{this.$time.dateString(subscription.cancelAt)}}
                            </div>
                        </v-col>
                    </v-row>

                </v-card-text>
            </template>
            <slot/>
        </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import VDialogConfirm from "../VDialogConfirm";
    import InputLabel from "../InputLabel";
    import JSectionTitle from "../JSectionTitle";

    export default {

        components: {
            JSectionTitle,
            VDialogConfirm,
            InputLabel,
        },

        props: {
            disableActions: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        data() {
            return {
                showDetails: false,
            }
        },

        computed: {
            ...mapState({
                subscription: state => state.account.subscription,
                pageViews: state => state.account.plan.pageViews,
                name: state => state.account.subscription.plan.name,
                amount: state => state.account.subscription.plan.amount,
                currency: state => state.account.subscription.plan.currency,
                interval: state => state.account.subscription.plan.interval,
                description: state => state.account.subscription.plan.description,
                pending: state => state.pending.account.loadSubscription,
                pendingRevocation: state => state.pending.account.revokeCancellation,
                pendingCancel: state => state.pending.account.cancelSubscription,
            }),

            status() {
                let name = this.$t('active'), color = 'green', info = null

                if (this.subscription.cancelAt) {
                    info = this.$t('canceled_expire_info', [(new Date(this.subscription.cancelAt*1000)).toLocaleDateString()])
                }
                if (this.subscription.status === 'incomplete') {
                    name = this.$t('inactive')
                    color = 'deep-orange'
                    info = this.$t('subscription_incomplete_required_action')
                }
                else if (this.subscription.status !== 'active') {
                    name = this.$t('problem')
                    color = 'deep-orange'
                    info = this.$t('subscription_incomplete_required_action')
                }

                return {name, color, info}
            }
        },

        methods: {

            revoke(event) {
                this.$store.dispatch('account/revokeCancellation').then(res => {
                    event.done()
                }).catch(e => this.$error(e))
            },

            cancel(event) {
                this.$store.dispatch('account/cancelSubscription').then(res => {
                    event.done()
                }).catch(e => this.$error(e))
            }

        }

    }
</script>
