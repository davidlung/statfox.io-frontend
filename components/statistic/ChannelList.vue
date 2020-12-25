<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('channel_title')}}</v-card-title>
        <v-skeleton-loader tile :loading="pending" type="text@10, actions">
            <v-data-table dense :headers="headers" :items="stats" hide-default-footer mobile-breakpoint="100"
                          :no-data-text="$t('vcomp.table.no_data')">
                <template v-slot:item.channel="{item}">
                    {{ ({
                    referral: $t('referrer_links'),
                    organic_search: $t('organic_search'),
                    direct: $t('direct_access'),
                    ads: $t('ads'),
                    internal: $t('internal_links'),
                })[item.channel]||$t('unknown') }}
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
                return this.statistic.data.channels
            },
        },

        data() {
            return {
                headers: [
                    {text:'Channel', value:'channel', width: '90%'},
                    {text:this.$t('views'), value:'views'},
                    {text:this.$t('uniques'), value:'uniques'}
                ]
            }
        }

    }
</script>
