<template>
    <v-form v-model="valid" @submit.prevent="request" :disabled="pending">

        <template v-if="!sent">
            <InputLabel>{{$t('email')}}</InputLabel>
            <v-text-field solo flat  hide-details="auto"
                          type="email"
                          placeholder="mail@example.com"
                          autocomplete="username"
                          v-model="email"
                          :rules="rules"
            ></v-text-field>

            <div class="d-flex justify-center mt-5">
                <div>
                    <recaptcha @error="captcha = null" @success="captcha = $event" @expired="captcha = null" />
                </div>
            </div>

            <v-btn large block depressed
                   class="mt-8"
                   color="primary"
                   type="submit"
                   :loading="pending"
                   :disabled="!valid||!captcha">
                {{$t('request_password_reset')}}
            </v-btn>
        </template>
        <template v-else>
            <v-alert text>
                {{$t('password_reset_check_mailbox')}}
            </v-alert>
        </template>

    </v-form>
</template>

<script>
    import {mapState} from 'vuex'
    import InputLabel from './../InputLabel'

    export default {

        components: {
            InputLabel
        },

        data() {
            return {
                valid: true,
                email: null,
                captcha: null,
                rules: [
                    v => v && v.trim().length > 0 || this.$t('rule.email.empty'),
                    v => (v && (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(v)) || this.$t('rule.email.invalid')
                ],
                pending: false,
                sent: false
            }
        },

        computed: {
            ...mapState({

            }),
        },

        methods: {

            request() {
                if (!this.pending && this.captcha && this.valid) {
                    this.pending = true
                    this.$axios.post('/api/v1/password:reset', {email: this.email, captcha: this.captcha}).then(res => {
                        this.sent = true
                    }).catch(e => this.$error(e)).finally(() => this.pending = false);
                }
            },

        }

    }
</script>
