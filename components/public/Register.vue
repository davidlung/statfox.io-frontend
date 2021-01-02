<template>
    <v-form v-model="valid" @submit="register" :disabled="pendingRegister||pendingLogin||redirecting">

        <InputLabel>{{$t('email')}}</InputLabel>

        <v-text-field solo flat autofocus hide-details="auto"
                      type="email"
                      placeholder="mail@example.com"
                      autocomplete="username"
                      v-model="data.email"
                      :rules="rules.email"
        ></v-text-field>

        <InputLabel>{{$t('password')}}</InputLabel>

        <v-text-field solo flat hide-details
                      autocomplete="current-password"
                      v-model="data.password"
                      :rules="rules.password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-checkbox class="d-inline-block" :rules="[v => !!v||$t('rule.agree.empty')]">
            <template v-slot:label>
                <span class="text-caption">
                    {{$t('signup.accept_agreement')}}
                    <a @click.stop target="_blank" href="https://www.statfox.io/termsofservice/">{{$t('terms_of_use')}}</a>
                    {{$t('and')}}
                    <a @click.stop target="_blank" href="https://www.statfox.io/privacy/">{{$t('privacy_policy')}}</a>
                </span>
            </template>
        </v-checkbox>

        <div class="d-flex justify-center">
            <div>
                <recaptcha @error="onCaptchaError" @success="onCaptchaSuccess" @expired="onCaptchaExpired" />
            </div>
        </div>

        <div v-if="error" class="red--text text-center pt-5">
            {{error}}
        </div>

        <v-btn large block depressed
               class="mt-4"
               color="primary"
               type="submit"
               :loading="pendingRegister||pendingLogin||redirecting"
               :disabled="!valid||!!error||!this.availability.email||!this.data.captcha">
            {{$t('sign_up')}}
        </v-btn>

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
                error: null,
                redirecting: false,
                showPassword: false,
                availability: {
                    email: true,
                },
                data: {
                    email: null,
                    password: null,
                    captcha: null,
                },
                rules: {
                    email: [
                        v => v && v.trim().length > 0 || this.$t('rule.email.empty'),
                        v => (v && (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(v)) || this.$t('rule.email.invalid')
                    ],
                    password: [
                        v => v && v.trim().length >= 6 || this.$t('rule.password.empty'),
                    ]
                },
            }
        },

        computed: {
            ...mapState({
                pendingRegister: state => state.pending.account.register,
                pendingLogin: state => state.pending.auth.login,
            }),
        },

        watch: {
            'data.email': function() {
                this.error = null
                this.availability.email = true
            }
        },

        methods: {

            isAvailable(field) {
                this.data[field] && this.$axios.post('/api/v1/signup:check', {[field]: this.data[field]}).then(res => {
                    this.availability[field] = res.data.available
                })
            },

            onCaptchaError() {
                this.data.captcha = null
            },

            onCaptchaSuccess(token) {
                this.data.captcha = token
            },

            onCaptchaExpired() {
                this.data.captcha = null
            },

            register(e) {

                e && e.preventDefault()

                if(!this.data.captcha || this.pending || !this.availability.email) return

                if(this.pendingRegister||this.pendingLogin||this.redirecting) return

                this.$store.dispatch('account/register', this.data).then(res => {
                    this.redirecting = true
                    return this.$router.push('/welcome')
                }).catch(e => {

                    if(e.response) {
                        this.error = e.response.data.error.message
                        return
                    }

                    this.$error(e)
                });
            }

        }

    }
</script>
