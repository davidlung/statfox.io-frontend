<template>
    <v-container class="max-w-600">
        <div class="text-center text-h5 my-10">Payment Method</div>
        <div class="text-center subtitle-2">Choose a payment method or add a new one</div>

        <!-- SELECTED PLAN -->
        <SelectedPlan/>

        <!-- EXISTING METHOD -->
        <template>
            <j-section-title>Select an existing payment method</j-section-title>
            <v-card dark hover nuxt link
                    color="blue-grey"
                    class="mb-4"
                    :ripple="false"
                    :disabled="pending"
                    @click="select(paymentMethod.id)"
                    v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
                <v-card-title>
                    <v-icon class="pr-5">mdi-credit-card-outline</v-icon>
                    <span>{{paymentMethod.card.brand.toUpperCase()}}</span>
                    <v-spacer></v-spacer>
                    <div class="text-body-1">
                        <div class="caption">EXPIRY</div>
                        {{paymentMethod.card.expMonth}}/{{paymentMethod.card.expYear}}
                    </div>
                    <v-spacer></v-spacer>
                    <div class="text-body-1">
                        <div class="caption text-right">LAST 4</div>
                        **** **** **** {{paymentMethod.card.last4}}
                    </div>
                </v-card-title>
            </v-card>
            <v-card outlined class="mb-6 py-4" v-if="!paymentMethods.length&&!pending">
                <v-card-text class="text-center">You don't yet have a standard payment method</v-card-text>
            </v-card>

            <CreateCardDialog>
                <template v-slot:activator="{on, attrs}">
                    <v-btn depressed block v-on="on" color="primary" x-large :loading="pending">
                        <v-icon class="px-3">mdi-plus</v-icon>
                        Add a credit card
                    </v-btn>
                </template>
            </CreateCardDialog>

            <v-divider class="my-6"></v-divider>

            <v-btn depressed nuxt to="/subscription" :disabled="pending" :exact="true">
                <v-icon>mdi-chevron-left</v-icon>
                Choose a different plan
            </v-btn>
        </template>

    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import SelectedPlan from "../../components/subscription/SelectedPlan";
    import JSectionTitle from "../../components/JSectionTitle";
    import CreditCard from "../../components/payment/CreditCard";
    import CreateCardDialog from "../../components/payment/CreateCardDialog";

    export default {

        head: {
            title: "Subscription"
        },

        components: {
            CreateCardDialog,
            CreditCard,
            JSectionTitle,
            SelectedPlan
        },

        async middleware({store, redirect}) {
            if(store.state.subscription.selection.priceId === null) {
                redirect('/subscription')
            }
            store.dispatch('account/loadPaymentMethods')
        },

        data() {
            return {

            }
        },

        computed: {
            ...mapState({
                paymentMethods: state => state.account.paymentMethods,
                pending: state => state.pending.account.setDefaultPaymentMethod,
                subscription: state => state.account.subscription,
            }),
        },

        methods: {

            select(id) {
                this.$store.dispatch('account/setDefaultPaymentMethod', id).then(res => {
                    this.$router.push(this.subscription !== null ? '/subscription/switch' : '/subscription/checkout')
                });
            }

        },

    }
</script>