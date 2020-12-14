<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">Soziale Netzwerke</v-card-title>
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
                return this.statistic.data.socialMedia
            },
        },

        data() {
            return {
                headers: [
                    {text:'Name', value:'referrer_name', width: '90%'},
                    {text:'Aufrufe', value:'views'},
                    {text:'Nutzer', value:'uniques'}
                ]
            }
        }

    }
</script>
