<template>
    <v-container fill-height>
        <v-card max-width="800" class="mx-auto mb-10 pa-5 pb-0">

            <v-card-text class="text-center pt-10">
                <v-icon size="64" :color="verified ? 'green' : 'red'" v-if="!pending">
                    {{verified ? 'mdi-checkbox-marked-circle-outline' : 'mdi-alert-circle-outline'}}
                </v-icon>
                <v-progress-circular indeterminate v-if="pending" size="64" color="primary"></v-progress-circular>
            </v-card-text>

            <v-card-text v-if="pending" class="text-center">
                <div class="title pb-5">Verification in progress..</div>
                <div>
                    Please wait a moment, do not close or leave this window, your account is being verified.
                </div>
            </v-card-text>

            <v-card-text v-else class="text-center">
                <template v-if="verified">
                    <div class="title pb-5">Successfully verified!</div>
                    <div>
                        Thank you for verifying your email. Enjoy powerful API faking now with the plan that best
                        fits your needs.
                    </div>
                    <v-btn depressed large nuxt color="primary" to="/" class="my-10">
                        Back to jsonserver.io
                    </v-btn>
                </template>
                <template v-if="!verified">
                    <div class="title pb-5">Verification failed!</div>
                    <div>
                        Could not verify your email, maybe the link is expired. Please note that the verification link
                        is only valid for 10 minutes. Please try again by resend a new verification email by clicking
                        the resend button which you can find at the settings page of your jsonserver.io account.
                    </div>
                    <v-btn depressed large nuxt color="primary" to="/#settings" class="my-10">
                        Go back to my account settings
                    </v-btn>
                </template>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        layout: 'grey',

        head: {
            title: "Verification"
        },

        data() {
            return {
                verified: null
            }
        },

        mounted() {
            if (this.auth.loggedIn && this.auth.user.verified === true) {
                this.$router.replace('/');
            }

            this.$store.dispatch('verify', this.$route.params.token).then(res => {
                this.verified = true
            }).catch(e => {
                this.verified = false
            })
        },

        computed: {
            ...mapState({
                auth: state => state.auth,
                pending(state) {
                    return state.pending.global.verify || this.verified === null
                }
            }),
        },

    }
</script>