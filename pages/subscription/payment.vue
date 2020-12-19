<template>
    <v-container class="max-w-600">
        <div class="text-center text-h5 my-10">{{$t('payment_method')}}</div>
        <div class="text-center subtitle-2">{{$t('payment_method_choose_info')}}</div>

        <!-- SELECTED PLAN -->
        <SelectedPlan/>

        <!-- EXISTING METHOD -->
        <template>
            <j-section-title>{{$t('select_existing_payment_method')}}</j-section-title>
            <v-card hover nuxt link
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
                        <div class="caption text-uppercase">{{$t('card_expiry')}}</div>
                        {{paymentMethod.card.expMonth}}/{{paymentMethod.card.expYear}}
                    </div>
                    <v-spacer></v-spacer>
                    <div class="text-body-1">
                        <div class="caption text-right text-uppercase">{{$t('card_last4')}}</div>
                        **** **** **** {{paymentMethod.card.last4}}
                    </div>
                </v-card-title>
            </v-card>
            <v-card outlined class="mb-6 py-4" v-if="!paymentMethods.length&&!pending">
                <v-card-text class="text-center">{{$t('no_payment_method')}}</v-card-text>
            </v-card>

            <CreateCardDialog>
                <template v-slot:activator="{on, attrs}">
                    <v-btn depressed block v-on="on" color="primary" x-large :loading="pending">
                        <v-icon class="px-3">mdi-plus</v-icon>
                        {{$t('add_credit_card')}}
                    </v-btn>
                </template>
            </CreateCardDialog>

            <v-divider class="my-6"></v-divider>

            <v-btn depressed nuxt to="/subscription" :disabled="pending" :exact="true">
                <v-icon>mdi-chevron-left</v-icon>
                {{$t('choose_different')}}
            </v-btn>
        </template>

    </v-container>
</template>

<script>
    import {mapState} from 'vuex'
    import SelectedPlan from "../../components/subscription/SelectedPlan";
    import JSectionTitle from "../../components/JSectionTitle";
    import CreateCardDialog from "../../components/payment/CreateCardDialog";

    export default {

        head: {
            title: "Subscription"
        },

        components: {
            CreateCardDialog,
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
