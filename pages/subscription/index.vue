<template>
    <div>
        <v-app-bar dark elevate-on-scroll app height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')"><v-icon>mdi-menu</v-icon></v-btn>
            <v-toolbar-title class="d-flex align-center">{{$t('plans')}}</v-toolbar-title>
        </v-app-bar>

        <v-container class="max-w-1100">

            <CurrentPlan/>

            <SubscriptionProblem/>

            <!-- INTERVAL + CURRENCY -->
            <div class="d-flex mt-5" v-if="!isIntervalDisabled">
                <v-switch v-model="annual" dense inset :label="$t('annual_discount_info', [15])"></v-switch>
                <v-spacer></v-spacer>
                <v-select dense solo outlined hide-details flat single-line
                          class="shrink max-w-100 " :value="currency" item-value="v" item-text="t"
                          :items="[{v:'usd',t:'USD'},{v:'eur',t:'EUR'},]" :return-object="false"
                          v-if="!billing.currency" @change="setCurrency($event)"
                ></v-select>
            </div>
            <div v-else class="text--secondary text-caption py-3">
                <v-icon small>mdi-information</v-icon>
                {{$t('restricted_interval_change_info')}}
            </div>

            <!-- CANCELED INFO -->
            <v-alert type="warning" color="deep-orange" text v-if="subscription && subscription.cancelAt">
                <span class="font-weight-medium d-block">
                    {{$t('plan_canceled_expire_info', [(new Date(subscription.cancelAt*1000)).toLocaleDateString()])}}
                </span>
                {{$t('plan_canceled_switch_info')}}
            </v-alert>

            <v-skeleton-loader :loading="!plans.length" type="paragraph">
                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-card flat outlined height="100%">
                            <v-card-title class="text-overline justify-center">Free</v-card-title>
                            <v-card-text class="text-h4 text-center pb-2">100.000</v-card-text>
                            <v-card-text class="text-caption text-center pt-0">{{$t('page_view_month')}}</v-card-text>
                            <v-card-text class="font-weight-regular pt-5 text-center">
                                <div class="primary--text text-h4" v-if="plans.length">{{price(plans[1]).currencySign}}0</div>
                                <div class="text-caption" v-if="plans.length">{{$t('per_interval', [$t(price(plans[1]).interval)])}}</div>
                            </v-card-text>
                            <v-card-actions class="justify-center">
                                <v-chip outlined color="primary" v-if="!subscription||account.plan.level===0">{{$t('your_plan')}}</v-chip>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-for="plan in plans" :key="plan.name" class="text-center" v-if="price(plan)">
                        <v-card flat outlined>
                            <v-card-title class="text-overline justify-center">{{plan.name}}</v-card-title>
                            <v-card-text class="text-h4 text-center pb-2">{{plan.pageViews.toLocaleString()}}</v-card-text>
                            <v-card-text class="text-caption text-center pt-0">{{$t('page_view_month')}}</v-card-text>
                            <v-card-text class="font-weight-regular pt-5 text-center">
                                <div class="primary--text text-h4">{{price(plan).currencySign}}{{price(plan).amount/100}}</div>
                                <div class="text-caption">{{$t('per_interval', [$t(price(plans[1]).interval)])}}</div>
                            </v-card-text>
                            <v-card-actions class="justify-center">
                                <v-chip outlined color="primary" v-if="isCurrentPlan(plan)">{{$t('your_plan')}}</v-chip>
                                <div v-else-if="priceAvailability(plan)!==true">
                                    <v-tooltip top max-width="300">
                                        <template v-slot:activator="{on}">
                                            <div v-on="on">
                                                <v-btn depressed class="px-7" :disabled="true">
                                                    <v-icon small class="mr-3">mdi-information</v-icon> {{changePlanButtonLabel(plan)}}
                                                </v-btn>
                                            </div>
                                        </template>
                                        {{priceAvailability(plan)}}
                                    </v-tooltip>
                                </div>
                                <v-btn v-else depressed color="primary" class="px-10" @click="select(plan)" :disabled="subscription!==null&&subscription.cancelAt!==null">
                                    {{subscription ? changePlanButtonLabel(plan) : $t('select')}}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-skeleton-loader>

        </v-container>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../../components/JSectionTitle";
    import CurrentPlan from "../../components/subscription/CurrentPlan";
    import SubscriptionProblem from "../../components/subscription/SubscriptionProblem";

    export default {

        head() {
            return {
                title: this.$t('plans')
            }
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
                    let countryCodes = [
                        'BE',/*'BG','CZ',*/'DK','DE','EE','IE','EL','ES','FR',/*'HR',*/'IT','CY','LV','LT',/*'HU',*/'MT',
                        'NL','AT',/*'PL',*/'PT',/*'RO',*/'SI','SK','FI'/*,'SE'*/
                    ]
                    if (countryCodes.includes(locale.split('-')[0]) || countryCodes.includes(locale.split('-')[1])) {
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
                account: state => state.account,
                subscription: state => state.account.subscription,
                billing: state => state.account.billing,
                plans: state => state.subscription.plans,
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

                    return this.$t('switch')
                }
            },

            priceAvailability() {
                return plan => {
                    if (this.subscription) {
                        if (this.subscription.status !== 'active') {
                            return this.$t('switch_issue')
                        }

                        let futurePrice = this.price(plan)
                        let currentLevel = this.plans.find(p=>p.id === this.subscription.plan.internalPlanId).level
                        let invoice = this.subscription.latestInvoice

                        if (plan.level < currentLevel) {
                            // DOWNGRADE
                            if (this.subscription.plan.interval === 'year') {
                                return this.$t('plan_downgrade_year_info')
                            }
                            if(futurePrice.interval === 'month' && (!invoice || this.$time.now() - invoice.created < (86400*30)) ) {
                                return this.$t('plan_recently_downgrade_info')
                            }
                        }
                        else if(plan.level > currentLevel){
                            // UPGRADE
                            if (this.subscription.plan.interval === 'year' && futurePrice.interval === 'month') {
                                return this.$t('plan_upgrade_year_to_month_info')
                            }
                        }else{
                            // SAME PLAN
                            if (this.subscription.plan.interval === 'year') {
                                return this.$t('plan_switch_year_to_month_info')
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
