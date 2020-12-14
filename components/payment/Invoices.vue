<template>
    <div>
        <v-card flat outlined class="mb-6">
            <v-card-text>
                <j-section-title>Balance</j-section-title>
                <div class="text-h5 px-5">
                    {{currencySign(billing.currency)}}{{new Number(balance).toFixed(2).toLocaleString()}}
                    <div class="text-caption text--secondary">
                        This balance will be offset against next invoices.
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <v-card flat outlined class="mb-10">
            <v-card-text>
                <j-section-title>Invoices</j-section-title>
                <v-skeleton-loader :loading="loadingInvoices" type="paragraph">
                    <v-list two-line>
                        <v-list-item v-for="invoice in invoices" :key="invoice.id" class="bb-1-1">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{new Number(invoice.amountPaid/100).toFixed(2).toLocaleString()}} {{currencySign(invoice.currency)}}
                                    <span v-if="invoice.status === 'paid'">
                                <span class="green--text d-inline-block pl-2">PAID</span>
                                on {{$time.dateString(invoice.paidAt)}}
                            </span>
                                    <span v-else>
                                <span class="red--text d-inline-block pl-2">PAST DUE</span>
                                since {{$time.dateString(invoice.created)}}
                            </span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{invoice.number}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action style="flex-direction:row">
                                <v-tooltip top max-width="250">
                                    <template v-slot:activator="{on}">
                                        <v-btn depressed link icon v-on="on" :href="invoice.invoicePdf" @click="download">
                                            <v-icon>mdi-download-box-outline</v-icon>
                                        </v-btn>
                                    </template>
                                    Download PDF
                                </v-tooltip>
                                <v-tooltip top max-width="250">
                                    <template v-slot:activator="{on}">
                                        <v-btn depressed link icon v-on="on" :href="invoice.hostedInvoiceUrl" target="_blank">
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-btn>
                                    </template>
                                    Open invoice
                                </v-tooltip>


                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-card outlined v-if="invoices.length === 0" class="text-center pa-5">
                        You have no invoices yet.
                    </v-card>
                </v-skeleton-loader>
            </v-card-text>
        </v-card>

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../JSectionTitle";

    export default {

        components: {
            JSectionTitle

        },

        data() {
            return {

            }
        },

        created() {
            this.$store.dispatch('account/loadInvoices');
        },

        computed: {
            ...mapState({
                subscription: state => state.account.subscription,
                invoices: state => state.account.invoices,
                billing: state => state.account.billing,
                loadingInvoices: state => state.pending.account.loadInvoices,
            }),
            currencySign() {
                return currency => ({usd:'$', eur:'€'}[currency])
            },

            balance() {
                return this.billing.balance ? (this.billing.balance/100) * -1 : 0
            },
        },

        methods: {
            download() {
                this.$toast.info('Please wait, the PDF will be immediately download...')
            }
        }

    }
</script>
