<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">Länder</v-card-title>
        <v-data-table dense :headers="headers" :items="stats" :items-per-page="10"></v-data-table>
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
                    {text:'Name', value:'code', width: '90%'},
                    {text:'Aufrufe', value:'views'},
                    {text:'Nutzer', value:'uniques'}
                ]
            }
        }

    }
</script>
