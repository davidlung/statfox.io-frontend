<template>
    <div>
        <InputLabel>{{$t('card_number')}}</InputLabel>
        <v-text-field solo flat required
                      hide-details="auto"
                      placeholder="#### #### #### ####"
                      append-icon="mdi-credit-card-outline"
                      v-model="input.number"
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
                          v-model="input.expMonth"
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
                          v-model="input.expYear"
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
                              v-model="input.cvc"
                              :rules="rules.cvc"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8" class="py-0">
                <InputLabel>{{$t('card_holder')}}</InputLabel>
                <v-text-field solo flat required
                              hide-details="auto"
                              v-model="input.number"
                              :error-messages="error.number"
                              :rules="rules.cardNumber"
                ></v-text-field>
            </v-col>
            <v-col class="py-0">
                <InputLabel>{{$t('postal_code_zip')}}</InputLabel>
                <v-text-field solo flat required
                              hide-details="auto"
                              v-model="input.number"
                              :error-messages="error.number"
                              :rules="rules.cardNumber"
                ></v-text-field>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import InputLabel from './../InputLabel';

    export default {
        props: ['input', 'error'],

        components: {
            InputLabel
        },

        data() {
            return {
                months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                rules: {
                    cvc: [v => (/^[0-9]{3,4}$/).test(v)||'Please enter a valid cvc'],
                    expMonth: [v => (/^[0-9]{2}$/).test(v)||'Please select a month'],
                    expYear: [v => (/^[0-9]{2}$/).test(v)||'Please select a year'],
                    cardNumber: [v => (/^[0-9 ]{10,20}$/).test(v)||'Please enter a valid card number'],
                },
            }
        },

        computed: {
            years() {
                let years = [], y = parseInt(new Date().getFullYear().toString().substr(2,2)), yn = y+35;
                for(let i = y; i<yn;i++) years.push(i);
                return years;
            }
        },
    }
</script>
