<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">Browser</v-card-title>
        <v-data-table dense :headers="headers" :items="stats" hide-default-footer>
            <template v-slot:item.count="{item}">
                {{ (100/stats.reduce((a, b) => a + (b['count'] || 0), 0)*item.count).toFixed(0) }} %
            </template>
        </v-data-table>
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
                return this.statistic.data.browsers
            },
        },

        data() {
            return {
                headers: [
                    {text:'Name', value:'name', width: '75%'},
                    {text:'Anteil', value:'count'},
                ]
            }
        }

    }
</script>
