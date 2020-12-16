<template>
    <v-card min-height="200" outlined>
        <v-card-title class="pt-3 text-subtitle-2">
            <v-spacer></v-spacer>
            <v-icon :color="type==='bar'?'primary':'grey'" class="mr-4" @click="type='bar'">mdi-chart-bar</v-icon>
            <v-icon :color="type==='line'?'primary':'grey'" class="mr-2" @click="type='line'">mdi-chart-line</v-icon>
        </v-card-title>
        <v-card-text>
            <bar-chart v-if="stats.data.length && type==='bar'" :chart-data="{labels, datasets}" :options="options" :height="150"/>
            <line-chart v-if="stats.data.length && type==='line'" :chart-data="{labels, datasets}" :options="options" :height="150"/>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import BarChart from "@/components/charts/BarChart";
    import LineChart from "~/components/charts/LineChart";

    export default {
        components: {LineChart, BarChart},
        computed: {
            ...mapState({
                wid: state => state.website.statistic.data.websiteId,
                statistic: state => state.website.statistic,
                pending: state => state.pending.website.loadStatistic
            }),

            stats() {
                return this.statistic.data.viewsChart
            },

            labels() {
                let options = {hour12: false}

                if (this.stats.proportion === 'yearly') {
                    options.year = "numeric"
                }
                if (this.stats.proportion === 'monthly') {
                    options.year = "2-digit"
                    options.month = "short"
                }
                if (this.stats.proportion === 'daily') {
                    options.month = "short"
                    options.day = "2-digit"
                }
                if (this.stats.proportion === 'hourly') {
                    options.hour = "2-digit"
                }

                return this.stats.data.map(v => {
                    let d = new Date(v.date)
                    return this.stats.proportion !== 'hourly'
                        ? d.toLocaleDateString(undefined, options)
                        : d.toLocaleTimeString(undefined, options)
                })
            },

            datasets() {
                return [
                    {
                        label: this.$t('visitors'),
                        data: this.stats.data.map(v => v.uniques),
                        backgroundColor: this.$vuetify.theme.dark ? '#679910' : '#8dd411',
                        borderColor: this.$vuetify.theme.dark ? '#679910' : '#8dd411',
                        fill: false,
                        lineTension: 0
                    },
                    {
                        label: this.$t('page_views'),
                        data: this.stats.data.map(v => v.views),
                        backgroundColor: this.$vuetify.theme.dark ? '#4f6772' : '#607D8B',
                        borderColor: this.$vuetify.theme.dark ? '#4f6772' : '#607D8B',
                        fill: false,
                        lineTension: 0
                    }
                ]
            }
        },

        data() {
            return {
                type: 'bar',
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    tooltips: {

                    },
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    fontColor: this.$vuetify.theme.dark ? '#eee' : '#333',
                                    showLabelBackdrop: false
                                },
                                gridLines: {
                                    display: false,
                                },
                                stacked: true,
                            }
                        ],
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    fontColor: this.$vuetify.theme.dark ? '#eee' : '#333',
                                    showLabelBackdrop: false
                                },
                                gridLines: {
                                    display: true,
                                    color:   this.$vuetify.theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                stacked: true,
                            }
                        ]
                    }
                },
            }
        }

    }
</script>
