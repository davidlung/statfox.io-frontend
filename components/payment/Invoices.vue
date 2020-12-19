<template>
    <div>
        <!-- BALANCE -->
        <v-card flat outlined class="mb-6" v-if="balance">
            <v-card-text>
                <j-section-title>{{$t('balance')}}</j-section-title>
                <div class="text-h5 px-5">
                    {{currencySign(billing.currency)}}{{new Number(balance).toFixed(2).toLocaleString()}}
                    <div class="text-caption text--secondary">
                        {{$t('balance_info')}}
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- CARDS -->
        <v-skeleton-loader :loading="loadingInvoices" type="paragraph">
            <div>
                <v-card flat outlined class="mb-3" v-for="invoice in invoices" :key="invoice.id">
                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{new Number(invoice.amountPaid/100).toFixed(2).toLocaleString()}} {{currencySign(invoice.currency)}}
                                    <span v-if="invoice.status === 'paid'">
                                        <span class="green--text d-inline-block pl-2">{{$t('paid')}}</span>
                                        {{$t('paid_on', [$time.dateString(invoice.paidAt)])}}
                                    </span>
                                    <span v-else>
                                        <span class="red--text d-inline-block pl-2">{{$t('past_due')}}</span>
                                        {{$t('past_due_since', [$time.dateString(invoice.created)])}}
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
                                    {{$t('open_invoice')}}
                                </v-tooltip>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
                <v-card outlined v-if="invoices.length === 0" class="text-center pa-5">
                    {{$t('no_invoices')}}
                </v-card>
            </div>
        </v-skeleton-loader>

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../JSectionTitle";

    export default {

        components: {
            JSectionTitle
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
                this.$toast.info(this.$t('download_invoice_info'))
            }
        }

    }
</script>
