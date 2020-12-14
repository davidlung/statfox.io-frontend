<template>
        <v-card v-if="subscription" outlined class="my-10">
            <v-card-subtitle class="pb-1 d-flex">
                    <span>Your current plan:</span>
                <v-spacer></v-spacer>
                <div class="text-subtitle-1 font-weight-medium" :class="`${status.color}--text`">
                    <v-skeleton-loader tile min-width="150" :loading="pending" type="text">
                        {{status.name}}
                    </v-skeleton-loader>
                </div>
            </v-card-subtitle>
            <v-card-text class="d-flex py-0">
                <v-skeleton-loader tile min-width="200" :loading="pending" type="text">
                    <div class="text-h6">{{name}}</div>
                </v-skeleton-loader>
                <v-spacer></v-spacer>
                <v-skeleton-loader tile min-width="100" :loading="pending" type="text">
                    <div class="text-subtitle-2" v-show="!pending">
                        {{{usd:'$', eur:'€'}[currency]}}{{amount/100}} /{{interval}}
                    </div>
                </v-skeleton-loader>
            </v-card-text>
            <v-card-text class="d-flex pt-0">
                <v-skeleton-loader tile min-width="400" :loading="pending" type="text">
                    <div>{{description}}</div>
                </v-skeleton-loader>
                <template v-if="status.info">
                    <div class="text-center grow">
                        <v-btn icon small @click="showDetails=!showDetails" >
                            <v-icon>{{showDetails?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <v-spacer v-else></v-spacer>
                <v-skeleton-loader tile width="200" :loading="pending" type="text">
                    <div class="red--text" v-if="status.info">
                        <span>{{status.info}}</span>
                    </div>
                    <v-btn icon small @click="showDetails=!showDetails" class="mx-5" v-if="!status.info">
                        <v-icon>{{showDetails?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
                    </v-btn>
                </v-skeleton-loader>
            </v-card-text>
            <template v-if="showDetails">
                <v-divider></v-divider>
                <v-card-text class="pt-0">
                    <v-row>
                        <v-col>
                            <InputLabel>Created at</InputLabel>
                            {{this.$time.dateString(subscription.created)}}
                            <InputLabel>Started at</InputLabel>
                            {{this.$time.dateString(subscription.startDate)}}
                            <InputLabel>Billing cycle anchor</InputLabel>
                            {{this.$time.dateString(subscription.billingCycleAnchor)}}
                        </v-col>
                        <v-col>
                            <InputLabel>Current period</InputLabel>
                            {{this.$time.dateString(subscription.currentPeriodStart)}} -
                            {{this.$time.dateString(subscription.currentPeriodEnd)}}
                            <InputLabel>Status</InputLabel>
                            {{subscription.status.replace(/_/g,' ')}}
                        </v-col>

                        <v-col>
                            <div v-if="subscription.cancelAt" class="mb-5">
                                <InputLabel>Subscription canceled at</InputLabel>
                                {{this.$time.dateString(subscription.canceledAt)}}
                                <InputLabel>Subscription expires on (canceled)</InputLabel>
                                {{this.$time.dateString(subscription.cancelAt)}}
                            </div>
                        </v-col>
                        <v-col>
                            <div v-if="!disableActions&&subscription.status==='active'" class="text-right">
                                <v-dialog-confirm title="Revoke cancellation"
                                                  :pending="pendingRevocation"
                                                  label-agree="Revoke"
                                                  v-if="subscription.cancelAt"
                                                  @confirm="revoke($event)">
                                    <template v-slot:activator="{on}">
                                        <v-btn small depressed v-on="on" color="primary">Revoke Cancellation</v-btn>
                                    </template>
                                    <template v-slot:text>
                                        Are you really sure you want to revoke the cancellation of the current plan?
                                        The plan will be continued as usual.
                                    </template>
                                </v-dialog-confirm>
                                <v-dialog-confirm v-else title="Cancel current plan"
                                                  :pending="pendingCancel"
                                                  color="red"
                                                  label-agree="Cancel"
                                                  @confirm="cancel($event)">
                                    <template v-slot:activator="{on}">
                                        <v-btn small depressed v-on="on" dark color="red">Cancel Subscription</v-btn>
                                    </template>
                                    <template v-slot:text>
                                        The current plan will remain active and usable until the end ot the paid period
                                        <b>({{(new Date(subscription.currentPeriodEnd*1000)).toLocaleDateString()}})</b>.
                                        You can revoke the cancellation at any time.
                                    </template>
                                </v-dialog-confirm>
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
                let name = 'ACTIVE', color = 'green', info = null

                if (this.subscription.cancelAt) {
                    info = 'Canceled, expires on '+(new Date(this.subscription.cancelAt*1000)).toLocaleDateString()
                }
                if (this.subscription.status === 'incomplete') {
                    name = 'INACTIVE'
                    color = 'deep-orange'
                    info = 'Incomplete subscription, your action is required'
                }
                else if (this.subscription.status !== 'active') {
                    name = 'PROBLEM'
                    color = 'deep-orange'
                    info = 'Incomplete subscription, your action is required'
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