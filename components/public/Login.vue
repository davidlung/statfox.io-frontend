<template>
    <v-form v-model="valid" @submit="login" :disabled="pending||redirecting">

        <InputLabel v-if="!username">{{$t('email')}}</InputLabel>
        <v-text-field v-show="!username" solo flat  hide-details="auto"
                      :background-color="username?'transparent':''"
                      type="email"
                      placeholder="mail@example.com"
                      autocomplete="username"
                      :readonly="!!username"
                      v-model="data.username"
                      :rules="rules.username"
        ></v-text-field>

        <div v-show="!!username" class="text-center pt-4 pb-2">
            {{data.username}}<br>
            <v-btn depressed text small color="primary" @click="username=null">{{$t('login_change_email')}}</v-btn>
        </div>

        <template v-if="username">
            <InputLabel>{{$t('password')}}</InputLabel>
            <v-text-field solo flat autofocus hide-details
                          autocomplete="current-password"
                          v-model="data.password"
                          :rules="rules.password"
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword ? 'text' : 'password'"
                          @click:append="showPassword = !showPassword"
            ></v-text-field>

            <div v-if="error" class="red--text text-center pt-5">
                {{error}}
            </div>
        </template>

        <v-btn large block depressed
               class="mt-8"
               color="primary"
               type="submit"
               :loading="pending||redirecting"
               :disabled="!valid||(username&&!!error)">
            {{username?$t('sign_in'):$t('continue')}}
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
                username: null,
                showPassword: false,
                redirecting: false,
                data: {
                    username: null,
                    password: null
                },
                rules: {
                    username: [
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
                user: state => state.auth.user,
                pending: state => state.pending.auth.login,
            }),
        },

        watch: {
            'data.password': function() {
                this.error = null
            },
            'data.username': function() {
                this.username = null
            }
        },

        methods: {

            login(e) {

                e && e.preventDefault()

                if(this.pending) return

                if (this.username === null) {
                    this.username = this.data.username
                    this.data.password = null
                    this.error = null
                    return
                }

                this.$store.dispatch('auth/login', this.data).then(res => {
                    let redirectPath = this.$route.query.r||'/'
                    this.redirecting = true

                    if (!this.user.penultimateLoginAt) {
                        redirectPath = '/welcome'
                    }

                    return this.$router.push(redirectPath)
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
