<template>
    <v-card min-height="200" outlined>
        <v-card-text>
            <bar-chart v-if="stats.data.length" :chart-data="{labels, datasets}" :options="barChartOptions" :height="200" />
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import BarChart from "@/components/charts/BarChart";

    export default {
        components: {BarChart},
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
                        label: 'Besucher',
                        data: this.stats.data.map(v => v.uniques),
                        backgroundColor: '#2bb048'
                    },
                    {
                        label: 'Seitenaufrufe',
                        data: this.stats.data.map(v => v.views),
                        backgroundColor: '#136ec6'
                    }
                ]
            }
        },

        data() {
            return {
                barChartOptions: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    tooltips: {

                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false
                                },
                                stacked: true,
                            }
                        ],
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                },
                                gridLines: {
                                    display: true
                                },
                                stacked: true,
                            }
                        ]
                    }
                }
            }
        }

    }
</script>
