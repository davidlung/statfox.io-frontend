<template>
    <v-card light flat color="transparent" :class="isMobile?'pa-3 mobile-view':''" >
        <v-card-text class="pa-0">
            <date-range-picker
                ref="picker"
                :opens="isMobile?'inline':'left'"
                :locale-data="localeData"
                v-model="dateRange"
                :ranges="dateRanges"
                :auto-apply="true"
                @update="apply"
            >
                <template v-slot:input="picker">
                    <div class="d-flex">
                        <v-theme-provider root>
                            <v-btn :text="isMobile" :outlined="!isMobile" min-width="120" class="pa-2 px-3">
                                {{rangeLabel(picker.startDate, picker.endDate)}}
                            </v-btn>
                        </v-theme-provider>
                        <v-spacer v-if="isMobile"></v-spacer>
                        <v-theme-provider root>
                            <v-btn icon v-if="isMobile" @click="$emit('applied')"><v-icon>mdi-close</v-icon></v-btn>
                        </v-theme-provider>
                    </div>
                </template>
                <template v-slot:footer="data">
                    <div class="d-flex pa-2 bt-1-1" v-if="!isMobile">
                        <v-spacer></v-spacer>
                        <v-btn depressed small color="primary" @click="data.clickApply">{{$t('select')}}</v-btn>
                    </div>
                    <div v-else class="pt-2 d-flex">
                        <v-btn block large depressed color="primary" @click="data.clickApply">{{$t('select')}}</v-btn>
                    </div>
                </template>
                <template #ranges="ranges">
                    <div class="ranges" v-if="!isMobile">
                        <ul v-if="!isMobile">
                            <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
                                <b>{{name}}</b>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="pa-3 full-width">
                        <v-select
                            :items="Object.keys(ranges.ranges)"
                            @change="ranges.clickRange(ranges.ranges[$event])"
                            label="Zeitraum wählen"
                            class="" dense
                            hide-details full-width solo flat
                        ></v-select>
                    </div>
                </template>
            </date-range-picker>
        </v-card-text>
    </v-card>
</template>

<script>
    import DateRangePicker from 'vue2-daterange-picker'
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
    import {mapState} from "vuex";

    export default {

        components: {
            DateRangePicker
        },

        computed: {
            ...mapState({
                statistic: state => state.website.statistic,
            }),

            dateRange: {
                get() {
                    return this.statistic.dateRange
                },
                set(dateRange) {
                    this.$store.commit('website/SET_DATE_RANGE', dateRange)
                }
            },

            dateRanges() {
                return {
                    [this.$t('time.today')]: (() => {
                        let start = new Date(), end = new Date()
                        start.setHours(0, 0, 0, 0)
                        end.setHours(23, 59, 59, 59)
                        return [start, end]
                    })(),
                    [this.$t('time.last_days', [7])]: (() => {
                        let start = new Date(), end = new Date()
                        start.setDate(start.getDate()-7)
                        start.setHours(0, 0, 0, 0)
                        end.setHours(23, 59, 59, 59)
                        return [start, end]
                    })(),
                    [this.$t('time.last_days', [30])]: (() => {
                        let start = new Date(), end = new Date()
                        start.setDate(start.getDate()-30)
                        start.setHours(0, 0, 0, 0)
                        end.setHours(23, 59, 59, 59)
                        return [start, end]
                    })(),
                    [this.$t('time.this_week')]: (() => {
                        let start = new Date(), end = new Date()
                        start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1))
                        start.setHours(0, 0, 0, 0)
                        end.setHours(23, 59, 59, 59)
                        return [start, end]
                    })(),
                    [this.$t('time.this_month')]: (() => {
                        let start = new Date(), end = new Date()
                        start.setDate(1)
                        start.setHours(0, 0, 0, 0)
                        end.setHours(23, 59, 59, 59)
                        return [start, end]
                    })(),
                    [this.$t('time.this_year')]: (() => {
                        let start = new Date(), end = new Date()
                        start.setFullYear(start.getFullYear(), 0, 1)
                        start.setHours(0, 0, 0, 0)
                        end.setHours(23, 59, 59, 59)
                        return [start, end]
                    })(),
                    [this.$t('time.all_time')]: (() => {
                        let start = new Date(), end = new Date()
                        start.setFullYear(2020, 0, 1)
                        start.setHours(0, 0, 0, 0)
                        end.setHours(23, 59, 59, 59)
                        return [start, end]
                    })()
                }
            },

            rangeLabel() {
                return (start, end) => {
                    let dateStart = new Date(start), dateEnd = new Date(end)

                    dateStart.setHours(0, 0, 0, 0)
                    dateEnd.setHours(23, 59, 59, 59)

                    let namedRange = Object.values(this.dateRanges).find(d => {
                        return d[0].toLocaleDateString() === dateStart.toLocaleDateString()
                            && d[1].toLocaleDateString() === dateEnd.toLocaleDateString()
                    })

                    if (namedRange) {
                        return Object.keys(this.dateRanges).find(k => this.dateRanges[k] === namedRange)
                    }

                    let options = {day: '2-digit', month: 'short', year: '2-digit'}
                    return dateStart.toLocaleDateString(undefined, options) + ' - ' + dateEnd.toLocaleDateString(undefined, options)
                }
            },

            localeData() {
                let date = new Date(), data = {
                    firstDay: 1,
                    daysOfWeek: [],
                    monthNames: []
                }, monthIndexes = [0,1,2,3,4,5,6,7,8,9,10,11], dayIndexes = [0,1,2,3,4,5,6]

                monthIndexes.forEach(m => {
                    date.setMonth(m)
                    data.monthNames.push(date.toLocaleString('default', {month: 'short'}))
                })

                dayIndexes.forEach(d => {
                    date.setDate(date.getDate() + (d - date.getDay()))
                    data.daysOfWeek.push(date.toLocaleString('default', {weekday: 'short'}))
                })

                return data
            },

            isMobile() {
                return this.$vuetify.breakpoint.smAndDown
            }
        },

        async beforeMount() {
            await this.$store.dispatch('website/initializeDateRange')
        },

        methods: {
            apply() {
                this.$store.dispatch('website/loadStatistic')
                this.$emit('applied')
            }
        }

    }
</script>

<style lang="sass">

    .vue-daterange-picker
        .form-control.reportrange-text
            border: none
            background: transparent

    .mobile-view
        .vue-daterange-picker.inline
            display: block

            .daterangepicker.dropdown-menu
                border: none
                background-color: transparent

                .calendars-container
                    display: block
                    width: 100%
                    .drp-calendar.col
                        width: 100%
                        display: block
                        max-width: 100%
                        padding: 15px 0 0 0

                        &.left
                            padding: 0

</style>
