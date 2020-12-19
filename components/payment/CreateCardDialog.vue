<template>
    <v-dialog v-model="show" max-width="600" persistent>

        <template v-slot:activator="{ on, attrs }">
            <slot name="activator" :on="on" :attrs="attrs"></slot>
        </template>

        <v-card>
            <v-card-text class="pt-2">
                <v-form ref="form" v-model="valid" @submit.prevent="submit" :disabled="pending">

                    <InputLabel>{{$t('card_number')}}</InputLabel>
                    <v-text-field solo flat required
                                  hide-details="auto"
                                  placeholder="####..."
                                  append-icon="mdi-credit-card-outline"
                                  v-model="card.number"
                                  :error-messages="error.number"
                                  :rules="rules.cardNumber"
                    ></v-text-field>
                    <v-row>
                        <v-col cols="4" class="pr-0 py-0">
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
                        <v-col cols="4" class="py-0">
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
                        <v-col cols="4" class="py-0">
                            <InputLabel>{{$t('card_cvc')}}</InputLabel>
                            <v-text-field solo flat required
                                          hide-details="auto"
                                          placeholder="123"
                                          :error-messages="error.cvc"
                                          v-model="card.cvc"
                                          :rules="rules.cvc"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            <InputLabel>{{$t('card_holder')}}</InputLabel>
                            <v-text-field solo flat required
                                          hide-details="auto"
                                          v-model="billing.name"
                                          :error-messages="error.name"
                                          :rules="rules.name"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4" class="py-0" v-if="!showBilling">
                            <InputLabel>{{$t('postal_code_zip')}}</InputLabel>
                            <v-text-field solo flat required
                                          hide-details="auto"
                                          v-model="billing.address.postalCode"
                                          :error-messages="error.postalCode"
                                          :rules="rules.postalCode"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-alert text v-if="error.general" type="error" class="mt-3">{{error.general}}</v-alert>

                    <!-- BILLING INFORMATION -->
                    <div v-if="showBilling">
                        <v-divider class="my-5"></v-divider>
                        <j-section-title>{{$t('billing_title')}}</j-section-title>

                        <InputLabel>{{$t('address')}}</InputLabel>
                        <v-text-field solo flat
                                      :placeholder="$t('address_eg')"
                                      hide-details="auto"
                                      :rules="rules.line1"
                                      v-model="billing.address.line1"
                        ></v-text-field>

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
                            <span v-if="!showBilling">{{$t('add_billing_information')}}</span>
                            <span v-if="showBilling">{{$t('remove_billing_information')}}</span>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text :disabled="pending" @click="close">
                            {{$t('cancel')}}
                        </v-btn>
                        <v-btn depressed color="primary" class="px-8" type="submit" :loading="pending" :disabled="!valid">
                            {{$t('add')}}
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

        data() {
            return {
                show: false,
                showBilling: false,
                valid: true,
                months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                rules: {
                    cvc: [
                        v => (/^[0-9]{3,4}$/).test(v)||this.$t('rule.credit_card.cvc')
                    ],
                    expMonth: [
                        v => (/^[0-9]{2}$/).test(v)||this.$t('rule.credit_card.exp_month')
                    ],
                    expYear: [
                        v => (/^[0-9]{2}$/).test(v)||this.$t('rule.credit_card.exp_year')
                    ],
                    cardNumber: [
                        v => (/^[0-9 ]{10,20}$/).test(v)||this.$t('rule.credit_card.number')
                    ],
                    name: [
                        v => v && v.length > 0 || this.$t('rule.credit_card.number')
                    ],
                    city: [
                        v => v && v.length > 0 || this.$t('rule.please_enter')
                    ],
                    postalCode: [
                        v => v && v.length > 0 || this.$t('rule.please_enter')
                    ],
                    line1: [
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
                    number: null,
                    expMonth: null,
                    expYear: null,
                    cvc: null
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
                    number: null,
                    expMonth: null,
                    expYear: null,
                    cvc: null,
                    name: null,
                    postalCode: null,
                },
            }
        },

        computed: {
            ...mapState({
                pending: state => state.pending.account.addPaymentMethod,
            }),

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
            'billing.address.country': function(){
                this.billing.address.state = null
            },
            'card.number': function() {
                this.error.number = null
            },
            'card.expMonth': function() {
                this.error.expMonth = null
            },
            'card.expYear': function() {
                this.error.expYear = null
            },
            'card.cvc': function() {
                this.error.cvc = null
            },
        },

        methods: {

            close() {
                this.$refs.form.reset()
                this.showBilling = false
                this.show = false
            },

            submit() {
                this.error.general = null

                this.$store.dispatch('account/addPaymentMethod', {card: this.card, billing: this.billing}).then(res => {
                    this.close()
                    this.$emit('success')
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

                        if(err.details.type === 'invalid_request_error') {
                            if (err.details.code === 'card_declined') {
                                this.error.general = err.message
                            }
                        }
                    }

                })
            }

        },
    }
</script>
