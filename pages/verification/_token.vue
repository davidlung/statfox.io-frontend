<template>
    <v-container fluid class="pt-8 text-center">

        <Brand/>

        <div class="text-center py-8">
            <v-icon size="64" :color="verified ? 'green' : 'red'" v-if="!pending">
                {{verified ? 'mdi-checkbox-marked-circle-outline' : 'mdi-alert-circle-outline'}}
            </v-icon>
            <v-progress-circular indeterminate v-if="pending" size="64" color="primary"></v-progress-circular>
        </div>

        <div v-if="pending">
            <div class="text-h5 font-weight-thin">{{$t('verification.please_wait')}}</div>
        </div>

        <div v-else>
            <template v-if="verified">
                <div class="text-h5 font-weight-thin">{{$t('verification.success_title')}}</div>
                <v-btn depressed large nuxt color="primary" to="/" class="my-10">
                    {{$t('verification.continue_to', [$config.DOMAIN])}}
                </v-btn>
            </template>
            <template v-else>
                <div class="text-h5 font-weight-thin">{{$t('verification.failed_title')}}</div>
                <div class="max-w-600 mx-auto mt-10">{{$t('verification.failed_info')}}</div>
                <v-btn depressed large nuxt color="primary" to="/settings" class="my-10">
                    {{$t('verification.open_account_settings')}}
                </v-btn>
            </template>
        </div>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import Brand from "@/components/Brand";

    export default {

        layout: 'blank',

        components: {Brand},

        head() {
            return {
                title: this.$t('verification.title')
            }
        },

        data() {
            return {
                verified: null
            }
        },

        created() {
            if (this.auth.loggedIn && this.auth.user.verified === true) {
                this.$router.replace('/')
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
                    return state.pending.verify || this.verified === null
                }
            }),
        },

    }
</script>
