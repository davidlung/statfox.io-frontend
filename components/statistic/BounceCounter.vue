<template>
    <v-card outlined min-height="110">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('bounce_rate')}}</v-card-title>
        <v-card-text class="text-h4">
            <v-skeleton-loader type="button" :loading="pending||!wid">
                {{stats}} <span class="text-body-1">%</span>
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
                return this.wid ? this.statistic.data.views.bounce : '-'
            },
        }

    }
</script>
