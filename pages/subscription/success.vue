<template>
    <v-container class="max-w-600">
        <div class="text-center text-h5 my-10">{{$t('succeeded')}}</div>
        <div class="text-center subtitle-2">{{$t('subscription_succeeded_info')}}</div>
        <div class="text-center mt-8">
            <v-icon color="green" size="50">mdi-checkbox-marked-circle-outline</v-icon>
        </div>

        <div class="my-10">
            <CurrentPlan>
                <v-overlay :value="pending" absolute>
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
            </CurrentPlan>
        </div>

        <div class="text-center">
            <v-btn depressed x-large color="primary" class="px-12" @click="this.continue" :disabled="pending">
                {{$t('continue')}}
            </v-btn>
        </div>

    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import CurrentPlan from "../../components/subscription/CurrentPlan";

    export default {

        head() {
            return {
                title: this.$t('plans')
            }
        },

        components: {
            CurrentPlan
        },

        async middleware({store, redirect}) {
            if(!store.state.account.subscriptionRecentlyUpdated) {
                redirect('/subscription')
            }
        },

        computed: {
            ...mapState({
                account: state => state.account,
                pending: state => state.pending.account.loadAccount
            }),
        },

        mounted() {
            this.$store.dispatch('hideLoadingOverlay')
            this.$store.dispatch('account/loadAccount')
        },

        methods: {

            continue() {
                this.$router.replace('/')
            }

        }

    }
</script>
