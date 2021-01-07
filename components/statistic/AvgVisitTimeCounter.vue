<template>
    <v-card outlined min-height="110">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('avg_visit_duration')}} ø</v-card-title>
        <v-card-text class="text-h4">
            <v-skeleton-loader type="button" :loading="pending||!wid">
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
                    let date = new Date(null)
                    date.setSeconds(this.statistic.data.views.duration)
                    return date.toLocaleTimeString().substr(3)
                }
                return '-'
            },
        }

    }
</script>
