<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('viewed_pages')}}</v-card-title>
        <v-skeleton-loader tile :loading="pending" type="text@10, actions">
            <v-data-table dense :headers="headers" :items="stats" :items-per-page="10"></v-data-table>
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
                return this.statistic.data.pages
            },
        },

        data() {
            return {
                headers: [
                    {text:this.$t('page'), value:'page', width: '90%'},
                    {text:this.$t('views'), value:'views'},
                    {text:this.$t('uniques'), value:'uniques'}
                ]
            }
        }

    }
</script>
