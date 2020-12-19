<template>
    <v-skeleton-loader :loading="loadingPaymentMethods" type="paragraph">
        <v-card outlined>
            <v-expansion-panels flat accordion focusable>
                <v-expansion-panel v-for="paymentMethod in paymentMethods" :key="paymentMethod.id" class="pa-0">
                    <v-expansion-panel-header>
                        <div>
                            <div class="font-weight-medium pb-1">
                                <span class="text-capitalize">{{paymentMethod.card.brand}}</span>
                                <span class="d-inline-block px-2">**** {{paymentMethod.card.last4}}</span>
                                <span>
                            <v-chip label x-small color="primary" v-if="paymentMethod.id===defaultPaymentMethod">
                                Standard
                            </v-chip>
                        </span>
                            </div>
                            <div class="text-body-2 text--secondary">
                                {{$t('card_expires_on', [paymentMethod.card.expMonth, paymentMethod.card.expYear])}}
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div class="d-flex py-3">
                            <EditCardDialog :payment-method-id="paymentMethod.id">
                                <template v-slot:activator="{on, attrs}">
                                    <v-btn depressed v-on="on" class="mr-3">{{$t('edit')}}</v-btn>
                                </template>
                            </EditCardDialog>
                            <v-btn text color="primary" class="mr-3"
                                   v-if="paymentMethod.id!==defaultPaymentMethod"
                                   :loading="loadingSetDefaultPaymentMethod"
                                   @click="setDefaultPaymentMethod(paymentMethod.id)">
                                {{$t('set_default_payment_method')}}
                            </v-btn>
                            <v-dialog-confirm
                                color="red"
                                :title="`${$t('delete')}: **** ${paymentMethod.card.last4}`"
                                :pending="loadingDeletePaymentMethod"
                                :label-agree="$t('delete')"
                                :label-disagree="$t('cancel')"
                                @confirm="deletePaymentMethod(paymentMethod.id, $event)">
                                <template v-slot:activator="{on}">
                                    <v-btn text color="red" class="mr-3" v-on="on"
                                           :disabled="loadingDeletePaymentMethod||paymentMethod.id===defaultPaymentMethod">{{$t('delete')}}</v-btn>
                                </template>
                                <template v-slot:text>
                                    {{$t('delete_payment_method_question')}}
                                </template>
                            </v-dialog-confirm>
                        </div>
                        <v-divider></v-divider>
                        <table class="full-width py-5">
                            <tbody>
                            <tr>
                                <td class="text--secondary">{{$t('card_number')}}</td>
                                <td class="">**** {{paymentMethod.card.last4}}</td>
                            </tr>
                            <tr>
                                <td class="text--secondary">{{$t('card_expiry')}}</td>
                                <td class="">{{paymentMethod.card.expMonth}} / {{paymentMethod.card.expYear}}</td>
                            </tr>
<!--                            <tr>-->
<!--                                <td class="text&#45;&#45;secondary">{{$t('card_type')}}</td>-->
<!--                                <td class="">{{paymentMethod.card.funding}}</td>-->
<!--                            </tr>-->
                            <tr>
                                <td class="text--secondary">{{$t('country')}}</td>
                                <td class="">{{paymentMethod.card.country}}</td>
                            </tr>
                            <tr>
                                <td class="text--secondary">{{$t('email')}}</td>
                                <td class="">{{paymentMethod.billing.email}}</td>
                            </tr>
                            <tr>
                                <td class="text--secondary">{{$t('card_holder')}}</td>
                                <td class="">{{paymentMethod.billing.name}}</td>
                            </tr>
                            <tr>
                                <td class="text--secondary" style="vertical-align: top;">{{$t('billing_address')}}</td>
                                <td v-if="paymentMethod.billing.address.line1">
                                    <div>{{paymentMethod.billing.address.line1}}</div>
                                    <div>
                                        <span v-if="paymentMethod.billing.address.state">{{paymentMethod.billing.address.state}},</span>
                                        <span v-if="paymentMethod.billing.address.city">{{paymentMethod.billing.address.city}}, </span>
                                        <span v-if="paymentMethod.billing.address.postalCode">{{paymentMethod.billing.address.postalCode}}, </span>
                                        <span v-if="paymentMethod.billing.address.country">{{paymentMethod.billing.address.country}}</span>
                                    </div>
                                </td>
                                <td v-else>N/A</td>
                            </tr>
                            </tbody>
                        </table>
                    </v-expansion-panel-content>
                    <v-divider></v-divider>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card>
        <v-card outlined class="pa-5 text-center" v-if="paymentMethods.length===0">
            {{$t('no_payment_method')}}
        </v-card>
        <div class="text-center py-5">
            <CreateCardDialog>
                <template v-slot:activator="{on, attrs}">
                    <v-btn depressed v-on="on" color="primary">{{$t('add_credit_card')}}</v-btn>
                </template>
            </CreateCardDialog>
        </div>
    </v-skeleton-loader>
</template>

<script>
    import {mapState} from 'vuex'
    import CreateCardDialog from './CreateCardDialog'
    import EditCardDialog from './EditCardDialog'
    import VDialogConfirm from "../VDialogConfirm";

    export default {

        components: {
            VDialogConfirm,
            CreateCardDialog, EditCardDialog
        },

        created() {
            this.$store.dispatch('account/loadPaymentMethods');
        },

        computed: {
            ...mapState({
                account: state => state.account,
                defaultPaymentMethod: state => state.account.billing.defaultPaymentMethod,
                paymentMethods: state => state.account.paymentMethods,
                loadingPaymentMethods: state => state.pending.account.loadPaymentMethods,
                loadingSetDefaultPaymentMethod: state => state.pending.account.setDefaultPaymentMethod,
                loadingDeletePaymentMethod: state => state.pending.account.deletePaymentMethod,
            }),
        },

        methods: {

            setDefaultPaymentMethod(id) {
                this.$store.dispatch('account/setDefaultPaymentMethod', id).catch(e => this.$error(e));
            },

            deletePaymentMethod(id, event) {
                this.$store.dispatch('account/deletePaymentMethod', id).then(res => {
                    event.done()
                }).catch(e => this.$error(e))
            },

        }

    }
</script>
