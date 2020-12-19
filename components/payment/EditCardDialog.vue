<template>
    <v-dialog v-model="show" max-width="600" persistent>

        <template v-slot:activator="{ on, attrs }">
            <slot name="activator" :on="on" :attrs="attrs"></slot>
        </template>

        <v-card>
            <v-card-text class="pt-2">
                <v-form ref="form" v-model="valid" @submit.prevent="submit" :disabled="pending">
                    <v-row>
                        <v-col cols="6" class="pr-0 py-0">
                            <InputLabel>{{$t('expiry_month')}}</InputLabel>
                            <v-select solo flat required
                                      hide-details="auto"
                                      placeholder="MM"
                                      append-outer-icon="mdi-slash-forward"
                                      :error-messages="error.expMonth"
                                      v-model="card.expMonth"
                                      :rules="rules.expMonth"
                                      :items="months"
                            >
                            </v-select>
                        </v-col>
                        <v-col cols="6" class="py-0">
                            <InputLabel>{{$t('expiry_year')}}</InputLabel>
                            <v-select solo flat required
                                      hide-details="auto"
                                      :error-messages="error.expYear"
                                      v-model="card.expYear"
                                      :rules="rules.expYear"
                                      :items="years"
                                      placeholder="YY"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <div v-if="showBilling">
                        <v-divider class="my-5"></v-divider>
                        <j-section-title>{{$t('billing_title')}}</j-section-title>
                        <InputLabel>{{$t('address')}}</InputLabel>
                        <v-text-field solo flat
                                      :placeholder="$t('address_eg')"
                                      hide-details="auto"
                                      :rules="rules.line1"
                                      v-model="billing.address.line1"></v-text-field>
                        <v-row>
                            <v-col class="py-0">
                                <InputLabel>{{$t('city')}}</InputLabel>
                                <v-text-field solo flat
                                              hide-details="auto"
                                              :rules="rules.city"
                                              v-model="billing.address.city"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4" class="py-0">
                                <InputLabel>{{$t('postal_code_zip')}}</InputLabel>
                                <v-text-field solo flat
                                              hide-details="auto"
                                              :rules="rules.postalCode"
                                              v-model="billing.address.postalCode"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <InputLabel>{{$t('country')}}</InputLabel>
                        <v-select solo flat
                                  hide-details="auto"
                                  item-text="country" item-value="abbr"
                                  :placeholder="$t('select')"
                                  :rules="rules.country"
                                  v-model="billing.address.country"
                                  :items="countries"
                        ></v-select>
                        <template v-if="states.length">
                            <InputLabel>{{$t('state')}}</InputLabel>
                            <v-select solo flat
                                      hide-details="auto"
                                      :placeholder="$t('select')"
                                      item-text="text" item-value="value"
                                      :rules="rules.state"
                                      v-model="billing.address.state"
                                      :items="states"
                            ></v-select>
                        </template>
                    </div>

                    <!-- ACTIONS -->
                    <div class="d-flex pt-5">
                        <v-btn depressed :disabled="pending" @click="showBilling=!showBilling">
                            <span v-if="!showBilling">{{$t('edit_billing_information')}}</span>
                            <span v-if="showBilling">{{$t('keep_billing_information')}}</span>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text :disabled="pending" @click="close">
                            {{$t('cancel')}}
                        </v-btn>
                        <v-btn depressed color="primary" class="px-8" type="submit" :loading="pending" :disabled="!valid">
                            {{$t('save')}}
                        </v-btn>
                    </div>

                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapState} from 'vuex'
    import InputLabel from './../InputLabel'
    import JSectionTitle from "../JSectionTitle";
    import world from "../../world";

    export default {

        components: {
            JSectionTitle,
            InputLabel
        },

        props: {
            paymentMethodId: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                show: false,
                showBilling: false,
                valid: true,
                months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                rules: {
                    expMonth: [
                        v => (/^[0-9]{2}$/).test(v)||this.$t('rule.credit_card.exp_month')
                    ],
                    expYear: [
                        v => (/^[0-9]{2}$/).test(v)||this.$t('rule.credit_card.exp_year')
                    ],
                    line1: [
                        v => v && v.length > 0 || this.$t('rule.please_enter')
                    ],
                    city: [
                        v => v && v.length > 0 || this.$t('rule.please_enter')
                    ],
                    postalCode: [
                        v => v && v.length > 0 || this.$t('rule.please_enter')
                    ],
                    country: [
                        v => v && v.length > 0 || this.$t('rule.please_enter')
                    ],
                    state: [
                        v => v && v.length > 0 || this.$t('rule.please_select')
                    ],
                },
                card: {
                    expMonth: null,
                    expYear: null,
                },
                billing: {
                    name: null,
                    address: {
                        city: null,
                        postalCode: null,
                        line1: null,
                        country: null,
                        state: null
                    }
                },
                error: {
                    general: null,
                    expMonth: null,
                    expYear: null,
                    name: null,
                    postalCode: null,
                },
            }
        },

        computed: {
            ...mapState({
                paymentMethods: state => state.account.paymentMethods,
                pending: state => state.pending.account.updatePaymentMethod,
            }),

            paymentMethod() {
                return this.paymentMethods.find(p => p.id === this.paymentMethodId)
            },

            years() {
                let years = [], y = parseInt(new Date().getFullYear().toString().substr(2,2)), yn = y+35;
                for(let i = y; i<yn;i++) years.push(i);
                return years;
            },

            countries() {
                return world.countries
            },

            states() {
                return world.states[this.billing.address.country]||[]
            },
        },

        watch: {
            'show': function(show){
                show && this.applyDefaultValues()
            },
            'billing.address.country': function(){
                this.billing.address.state = null
            },
            'card.expMonth': function() {
                this.error.expMonth = null
            },
            'card.expYear': function() {
                this.error.expYear = null
            },
        },

        methods: {

            applyDefaultValues() {
                let pm = this.paymentMethod
                this.card.expMonth = (pm.card.expMonth<10?'0':'')+pm.card.expMonth
                this.card.expYear = pm.card.expYear-2000
                this.billing.address.city = pm.billing.address.city
                this.billing.address.postalCode = pm.billing.address.postalCode
                this.billing.address.line1 = pm.billing.address.line1
                this.billing.address.country = pm.billing.address.country
                this.billing.address.state = pm.billing.address.state
            },

            close() {
                this.$refs.form.reset()
                this.showBilling = false
                this.show = false
            },

            submit() {
                this.error.general = null

                this.$store.dispatch('account/updatePaymentMethod', {
                    id: this.paymentMethodId,
                    card: this.card,
                    billing: this.billing
                }).then(res => {
                    this.close()
                }).catch(e => {

                    if(e.response && e.response.data.error !== undefined) {
                        let err = e.response.data.error

                        if(err.details.type === 'invalid_request_error') {
                            if(err.details.code === 'invalid_expiry_month') {
                                this.error.expMonth = err.message
                            }
                            if(err.details.code === 'invalid_expiry_year') {
                                this.error.expYear = err.message
                            }
                            if(err.details.code === 'incorrect_number') {
                                this.error.number = err.message
                            }
                            if(err.details.code === 'invalid_cvc') {
                                this.error.cvc = err.message
                            }
                        }

                        if(err.details.type === 'card_error') {
                            if (err.details.code === 'expired_card') {
                                this.error.general = err.message
                            }
                            if (err.details.code === 'card_declined') {
                                this.error.general = err.message
                            }
                            if (err.details.code === 'incorrect_cvc') {
                                this.error.cvc = err.message
                            }
                            if (err.details.code === 'processing_error') {
                                this.error.general = err.message
                            }
                        }
                    }

                })
            }

        },
    }
</script>
