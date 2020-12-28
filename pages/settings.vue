<template>
    <div class="d-flex flex-column fill-height">
        <v-app-bar dark elevate-on-scroll app class="" height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')"><v-icon>mdi-menu</v-icon></v-btn>
            <v-toolbar-title class="d-flex align-center">{{$t('settings')}}</v-toolbar-title>
            <template v-slot:extension>
                <v-tabs centered show-arrows v-model="tab">
                    <v-tab>{{$t('account')}}</v-tab>
                    <v-tab>{{$t('payment_methods')}}</v-tab>
                    <v-tab>{{$t('invoices')}}</v-tab>
                    <v-tab link nuxt to="/subscription">{{$t('upgrade_downgrade')}}</v-tab>
                    <v-tab>{{$t('design')}}</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-container class="max-w-900 grow mt-3">
            <subscription-problem/>
            <v-tabs-items v-model="tab" >

                <v-tab-item>
                    <v-card outlined>
                        <Account/>
                    </v-card>
                    <v-card flat outlined class="mt-3">
                        <v-card-text class="d-flex align-center">
                            <span v-if="user.penultimateLoginAt">
                                {{$t('last_online', [$time.dateTimeString(user.penultimateLoginAt)])}}
                            </span>
                            <span v-else>
                                {{$t('first_time_online')}}
                            </span>
                            <v-spacer></v-spacer>
                            <v-btn text color="red" :disabled="pendingLogout" :loading="pendingLogout" @click="$store.dispatch('auth/logout')">{{$t('logout')}}</v-btn>
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <payment-methods/>
                </v-tab-item>

                <v-tab-item>
                    <invoices/>
                </v-tab-item>

                <v-tab-item></v-tab-item>

                <v-tab-item>
                    <j-section-title>Theme</j-section-title>
                    <v-radio-group v-model="theme">
                        <v-card flat outlined class="mb-3">
                            <v-card-text>
                                <v-radio :label="$t('dark')"></v-radio>
                            </v-card-text>
                        </v-card>
                        <v-card flat outlined >
                            <v-card-text>
                                <v-radio :label="$t('light')"></v-radio>
                            </v-card-text>
                        </v-card>
                    </v-radio-group>
                </v-tab-item>
            </v-tabs-items>

            <div class="text-center pa-3 text-caption">v{{package.version}}</div>

        </v-container>
    </div>

</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../components/JSectionTitle"
    import Account from "../components/Account"
    import packageJson from '../package.json'
    import SubscriptionProblem from "@/components/subscription/SubscriptionProblem";
    import PaymentMethods from "@/components/payment/PaymentMethods";
    import Invoices from "@/components/payment/Invoices";

    export default {

        components: {
            Invoices,
            PaymentMethods,
            SubscriptionProblem,
            JSectionTitle,
            Account,
        },

        data() {
            return {
                tab: 0,
                package: packageJson
            }
        },

        computed: {
            ...mapState({
                user: state => state.auth.user,
                account: state => state.account,
                pendingLogout: state => state.pending.auth.logout,
            }),

            theme: {
                set(v) {
                    this.$vuetify.theme.dark = !v
                    this.$cookies.set('darkMode', !v, {
                        expires: this.$time.dateFromTime(undefined, +86400*720)
                    })
                },
                get() {
                    return this.$vuetify.theme.dark ? 0 : 1
                }
            },
        },

    }
</script>
