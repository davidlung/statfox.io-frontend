<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('devices')}}</v-card-title>
        <v-skeleton-loader tile :loading="pending||!wid" type="text@10, actions">
            <v-data-table dense :headers="headers" :items="stats" hide-default-footer mobile-breakpoint="100"
                          :no-data-text="$t('vcomp.table.no_data')">
                <template v-slot:item.count="{item}">
                    {{ (100/stats.reduce((a, b) => a + (b['count'] || 0), 0)*item.count).toFixed(0) }} %
                </template>
            </v-data-table>
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
                return this.statistic.data.deviceTypes
            },
        },

        data() {
            return {
                headers: [
                    {text:this.$t('type'), value:'type', width: '75%'},
                    {text:this.$t('ratio'), value:'count'},
                ]
            }
        }

    }
</script>
