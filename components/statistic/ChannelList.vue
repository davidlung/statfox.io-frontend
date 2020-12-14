<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">Wie wird meine Website gefunden?</v-card-title>
        <v-skeleton-loader tile :loading="pending" type="text@10, actions">
            <v-data-table dense :headers="headers" :items="stats" hide-default-footer>
                <template v-slot:item.channel="{item}">
                    {{ ({
                    referral: 'Verlinkung',
                    organic_search: 'Organische Suche (Google, Bing, etc.)',
                    direct: 'Direkte Zugriffe',
                    ads: 'Bezahlte Werbung',
                    internal: 'Interne Links',
                })[item.channel]||'unknown' }}
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
                    {text:'Aufrufe', value:'views'},
                    {text:'Nutzer', value:'uniques'}
                ]
            }
        }

    }
</script>
