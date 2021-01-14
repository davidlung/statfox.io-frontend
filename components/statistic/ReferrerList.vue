<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">
            <span>{{$t('referrers')}}</span>
            <v-spacer></v-spacer>
            <v-icon v-if="window>0" @click="window=0">mdi-close</v-icon>
        </v-card-title>
        <v-window v-model="window">
            <v-window-item>
                <v-skeleton-loader tile :loading="pending||!wid" type="text@10, actions">
                    <v-data-table dense :headers="headers" :items="stats" :items-per-page="10" mobile-breakpoint="100"
                                  :no-data-text="$t('vcomp.table.no_data')">
                        <template v-slot:item.actions="{ item }">
                            <v-icon @click="openReferrer(item)">mdi-chevron-right-box-outline</v-icon>
                        </template>
                    </v-data-table>
                </v-skeleton-loader>
            </v-window-item>
            <v-window-item>
                <v-skeleton-loader tile :loading="pendingDetails" type="text@10, actions">
                    <v-data-table dense :headers="detailsHeaders" :items="details" :items-per-page="10" mobile-breakpoint="100"
                                  :no-data-text="$t('vcomp.table.no_data')">
                        <template v-slot:item.label="{ item }">
                            <a :href="item.url" target="_blank">{{item.label}}</a>
                        </template>
                    </v-data-table>
                </v-skeleton-loader>
            </v-window-item>
        </v-window>

    </v-card>
</template>

<script>
    import {mapState} from 'vuex'

    export default {

        computed: {
            ...mapState({
                wid: state => state.website.statistic.data.websiteId,
                statistic: state => state.website.statistic,
                pending: state => state.pending.website.loadStatistic
            }),

            stats() {
                return this.statistic.data.referrers
            },
        },

        data() {
            return {
                window: 0,
                pendingDetails: false,
                headers: [
                    {text:'Referrer', value:'name', width: '90%'},
                    {text: '', value: 'actions', sortable: false, width: '1%'},
                    {text:this.$t('views'), value:'views'},
                    {text:this.$t('uniques'), value:'uniques'},
                ],
                detailsHeaders: [
                    {text:'URL', value:'label', width: '90%'},
                    {text:this.$t('views'), value:'views'},
                    {text:this.$t('uniques'), value:'uniques'},
                ],
                details: []
            }
        },

        methods: {

            openReferrer(item) {
                this.window = 1
                let params = {
                    wid: this.wid,
                    from: this.$time.unixTime(new Date(this.statistic.dateRange.startDate)),
                    to: this.$time.unixTime(new Date(this.statistic.dateRange.endDate)),
                    referrer: item.name
                }

                if (this.$route.name === 'share-id') {
                    params.sk = this.$route.params.id
                    delete params.wid
                }

                this.pendingDetails = true
                this.details = []
                this.$axios.get('/api/v1/statistic', {params}).then(res => {
                    this.details = res.data
                }).finally(() => {
                    this.pendingDetails = false
                })
            }

        }

    }
</script>
