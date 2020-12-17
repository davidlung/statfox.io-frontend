<template>
    <v-card outlined min-height="110">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('page_views')}}</v-card-title>
        <v-card-text class="text-h4">
            <v-skeleton-loader type="button" :loading="pending">
                {{stats}}
            </v-skeleton-loader>
        </v-card-text>
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
                if (this.wid) {
                    if (this.statistic.data.views.total >= 10000) {
                        return (this.statistic.data.views.total/10000).toFixed(1) + 'K'
                    }
                    return this.statistic.data.views.total
                }
                return '-'
            },
        }

    }
</script>
