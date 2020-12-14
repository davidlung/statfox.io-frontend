<template>
    <v-container class="max-w-600">
        <div class="text-center text-h5 my-10">Succeeded</div>
        <div class="text-center subtitle-2">Your plan has been setup successfully.</div>
        <div class="text-center mt-8">
            <v-icon color="green" size="50">mdi-checkbox-marked-circle-outline</v-icon>
        </div>
        <CurrentPlan :disable-actions="true">
            <v-overlay :value="pending" absolute>
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
        </CurrentPlan>
        <div class="text-center">
            <v-btn depressed x-large color="primary" class="px-12" @click="this.continue" :disabled="pending">
                Continue
            </v-btn>
        </div>

    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import CurrentPlan from "../../components/subscription/CurrentPlan";

    export default {

        head: {
            title: "Subscription"
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
                        || state.pending.server.loadServers
                        || state.pending.team.initialize,
            }),
        },

        mounted() {
            this.$store.dispatch('hideLoadingOverlay')
            this.$store.dispatch('account/loadAccount')
            this.$store.dispatch('server/loadServers')
            this.$store.dispatch('team/initialize')
        },

        methods: {

            continue() {
                this.$router.replace('/')
            }

        }

    }
</script>