<template>
    <div>
        <v-app-bar dark elevate-on-scroll app class="" height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')"><v-icon>mdi-menu</v-icon></v-btn>
            <v-toolbar-title class="d-flex align-center">{{$t('plans')}}</v-toolbar-title>
        </v-app-bar>

        <v-container class="max-w-1100 min-w-900">

            <CurrentPlan/>

            <SubscriptionProblem/>

            <div class="d-flex mt-5" v-if="!isIntervalDisabled">
                <v-switch v-model="annual" dense inset label="Annually (save 15% costs)"></v-switch>
                <v-spacer></v-spacer>
                <v-select dense solo outlined hide-details flat single-line
                          class="shrink max-w-100 " :value="currency" item-value="v" item-text="t"
                          :items="[{v:'usd',t:'USD'},{v:'eur',t:'EUR'},]" :return-object="false"
                          v-if="!billing.currency" @change="setCurrency($event)"
                ></v-select>
            </div>
            <div v-else class="text--secondary text-caption py-3">
                <v-icon small>mdi-information</v-icon>
                Your current plan has an interval of a year, so you cannot upgrade/downgrade to a monthly one.
            </div>

            <v-card flat outlined tile class="pa-5 mb-10">
                <v-alert type="warning" color="deep-orange" text v-if="subscription && subscription.cancelAt">
                <span class="font-weight-medium d-block">
                    Your current plan is canceled and will expire on {{(new Date(subscription.cancelAt*1000)).toLocaleDateString()}}.
                </span>
                    If you want to switch or subscribe to another plan you have to revoke the cancellation or wait until the current plan expires.
                </v-alert>
                <v-skeleton-loader :loading="!plans.length" type="paragraph">
                    <v-row no-gutters>
                        <v-col v-for="plan in plans.filter(p=>p.level>0)" :key="plan.name" class="text-center" v-if="price(plan)">
                            <div class="text-overline">{{plan.name}}</div>
                            <div class="text-h4 pt-3">{{plan.attributes.requests}}</div>
                            <div class="text-caption pb-1">Requests per Day</div>
                            <div class="text-caption">{{plan.attributes.servers}} Server | {{plan.attributes.teams}} Teams</div>
                            <div class="primary--text text-h4 font-weight-medium pt-5">{{price(plan).currencySign}}{{price(plan).amount/100}} </div>
                            <div class="caption">per {{price(plan).interval}}</div>
                            <v-btn depressed outlined :disabled="true" class="mt-8 px-10" v-if="isCurrentPlan(plan)">
                                Current
                            </v-btn>
                            <div v-else-if="priceAvailability(plan)!==true">
                                <v-tooltip top max-width="300">
                                    <template v-slot:activator="{on}">
                                        <div v-on="on" class="mt-8">
                                            <v-btn depressed class="px-7" :disabled="true">
                                                <v-icon small class="mr-3">mdi-information</v-icon> {{changePlanButtonLabel(plan)}}
                                            </v-btn>
                                        </div>
                                    </template>
                                    {{priceAvailability(plan)}}
                                </v-tooltip>
                            </div>
                            <v-btn v-else depressed color="primary" class="mt-8 px-10" @click="select(plan)" :disabled="subscription!==null&&subscription.cancelAt!==null">
                                {{subscription ? changePlanButtonLabel(plan) : 'Select'}}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-skeleton-loader>
            </v-card>

        </v-container>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../../components/JSectionTitle";
    import CurrentPlan from "../../components/subscription/CurrentPlan";
    import SubscriptionProblem from "../../components/subscription/SubscriptionProblem";

    export default {

        head: {
            title: "Subscription"
        },

        components: {
            CurrentPlan,
            JSectionTitle,
            SubscriptionProblem,
        },

        async mounted() {
            this.$store.dispatch('subscription/loadPlans')
            if (this.billing.currency) {
                this.setCurrency(this.billing.currency)
            }else if (process.client){
                let locale = '';
                if (window.navigator.languages !== undefined) {
                    locale = window.navigator.languages[0]
                }else if(window.navigator.language !== undefined) {
                    locale = window.navigator.language
                }
                if (locale !== '') {
                    if (['BE',/*'BG','CZ',*/'DK','DE','EE','IE','EL','ES','FR',/*'HR',*/'IT','CY','LV','LT',/*'HU',*/'MT','NL','AT',
                        /*'PL',*/'PT',/*'RO',*/'SI','SK','FI'/*,'SE'*/].includes(locale.split('-')[1])) {
                        this.setCurrency('eur')
                    }
                }
            }
            if(this.isIntervalDisabled) {
                this.annual = true
            }
        },

        computed: {
            ...mapState({
                subscription: state => state.account.subscription,
                billing: state => state.account.billing,
                plans: state => state.subscription.plans,
                attributes: state => state.subscription.attributes,
                interval: state => state.subscription.selection.interval,
                currency: state => state.subscription.selection.currency,
            }),

            price() {
                return plan => plan.prices.find(p => p.currency===this.currency && p.interval===this.interval)
            },

            annual: {
                get() {return this.interval === 'year'},
                set(value) {this.$store.dispatch('subscription/changeInterval', value ? 'year' : 'month')}
            },

            isIntervalDisabled() {
                return this.subscription && this.subscription.plan.interval === 'year'
            },

            changePlanButtonLabel() {
                return plan => {
                    let currentLevel = this.plans.find(p=>p.id === this.subscription.plan.internalPlanId).level

                    if (plan.level < currentLevel) {
                        return 'Downgrade'
                    }
                    if(plan.level > currentLevel){
                        return 'Upgrade'
                    }

                    return 'Switch'
                }
            },

            priceAvailability() {
                return plan => {
                    if (this.subscription) {
                        if (this.subscription.status !== 'active') {
                            return 'Cannot switch plans during subscription issues.'
                        }

                        let futurePrice = this.price(plan)
                        let currentLevel = this.plans.find(p=>p.id === this.subscription.plan.internalPlanId).level
                        let invoice = this.subscription.latestInvoice

                        if (plan.level < currentLevel) {
                            // DOWNGRADE
                            if (this.subscription.plan.interval === 'year') {
                                return 'You have already paid for a full year, downgrade on yearly plans is not intended.'
                            }
                            if(futurePrice.interval === 'month' && (!invoice || this.$time.now() - invoice.created < (86400*30)) ) {
                                return 'You have currently created or downgraded your subscription. ' +
                                       'Due to potential abuse, you have to wait at least 30 days after the last subscription setup to downgrade.'
                            }
                        }
                        else if(plan.level > currentLevel){
                            // UPGRADE
                            if (this.subscription.plan.interval === 'year' && futurePrice.interval === 'month') {
                                return 'Upgrade from a year to month period plan is not supported.'
                            }
                        }else{
                            // SAME PLAN
                            if (this.subscription.plan.interval === 'year') {
                                return 'Switching a year to month period plan is not supported.'
                            }
                        }
                    }
                    return true
                }
            }
        },

        methods: {

            isCurrentPlan(plan) {
                return this.subscription && this.subscription.plan.id === this.price(plan).id
            },

            setCurrency(currency) {
                this.$store.dispatch('subscription/changeCurrency', currency)
            },

            select(plan) {
                this.$store.dispatch('subscription/selectPrice', this.price(plan).id)

                if(this.subscription !== null) {
                    return this.$router.push('/subscription/switch')
                }

                if (this.billing.defaultPaymentMethod !== null) {
                    this.$router.push('/subscription/checkout')
                }else{
                    this.$router.push('/subscription/payment')
                }
            }
        },
    }
</script>
