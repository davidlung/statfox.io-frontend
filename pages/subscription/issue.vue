<template>
    <v-container class="max-w-600">

        <div class="text-center text-h5 my-10">{{title}}</div>

        <div :class="`text-center subtitle-2 ${color}--text`">
            {{description}}
        </div>

        <div class="text-center mt-8">
            <v-icon :color="color" size="50">{{icon}}</v-icon>
        </div>

        <SubscriptionProblem @solved="solved"/>

        <div class="text-center py-10" v-if="!hasIssue">
            <v-btn nuxt depressed to="/subscription" color="primary" class="px-10">
                {{$t('back')}}
            </v-btn>
        </div>

    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import SubscriptionProblem from "../../components/subscription/SubscriptionProblem";

    export default {

        head() {
            return {
                title: this.$t('plans')
            }
        },

        components: {
            SubscriptionProblem
        },

        async middleware({store, redirect}) {
            !store.state.account.subscription && redirect('/subscription')
        },

        mounted() {
            this.$store.dispatch('hideLoadingOverlay')
            this.$store.dispatch('account/loadSubscription')
        },

        computed: {
            ...mapState({
                subscription: state => state.account.subscription,
            }),

            title() {
                switch (this.subscription.status) {
                    case 'incomplete':  return this.$t('payment_issue.incomplete.title')
                    case 'past_due':    return this.$t('payment_issue.past_due.title')
                    case 'unpaid':      return this.$t('payment_issue.unpaid.title')
                    case 'active':      return this.$t('payment_issue.active.title')
                }
            },

            description() {
                switch (this.subscription.status) {
                    case 'incomplete':  return this.$t('payment_issue.incomplete.description')
                    case 'past_due':    return this.$t('payment_issue.past_due.description')
                    case 'unpaid':      return this.$t('payment_issue.unpaid.description')
                    case 'active':      return this.$t('payment_issue.active.description')
                }
            },

            icon() {
                switch (this.subscription.status) {
                    case 'incomplete':  return 'mdi-close-circle-outline'
                    case 'past_due':    return 'mdi-close-circle-outline'
                    case 'unpaid':      return 'mdi-warning'
                    case 'active':      return 'mdi-checkbox-marked-circle-outline'
                }
            },

            color() {
                return this.hasIssue ? 'red' : 'green'
            },

            hasIssue() {
                return this.subscription.status !== 'active'
            }

        },

        methods: {
            solved() {
                this.$router.replace('/subscription/success')
            }
        }

    }
</script>
