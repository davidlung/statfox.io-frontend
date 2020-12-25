<template>
    <v-card outlined>
        <v-card-title class="pt-3 text-subtitle-2">{{$t('ad_campaigns')}}</v-card-title>
        <v-skeleton-loader tile :loading="pending" type="text@10, actions">
            <v-data-table dense :headers="headers" :items="stats" :items-per-page="10" mobile-breakpoint="100"
                          :no-data-text="$t('vcomp.table.no_data')"></v-data-table>
        </v-skeleton-loader>
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
                return this.statistic.data.utm
            },
        },

        data() {
            return {
                headers: [
                    {text:this.$t('ad_provider'), value:'source'},
                    {text:this.$t('ad_medium'), value:'medium'},
                    {text:this.$t('ad_campaign'), value:'campaign'},
                    {text:this.$t('views'), value:'views'},
                    {text:this.$t('uniques'), value:'uniques'}
                ]
            }
        }

    }
</script>
