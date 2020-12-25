<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('countries')}}</v-card-title>
        <v-data-table dense :headers="headers" :items="stats" :items-per-page="10" mobile-breakpoint="100"
                      :no-data-text="$t('vcomp.table.no_data')"></v-data-table>
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
                return this.statistic.data.countries
            },
        },

        data() {
            return {
                headers: [
                    {text:this.$t('name'), value:'code', width: '90%'},
                    {text:this.$t('views'), value:'views'},
                    {text:this.$t('uniques'), value:'uniques'}
                ]
            }
        }

    }
</script>
