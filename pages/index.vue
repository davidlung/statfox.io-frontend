<template>
    <div>

        <v-app-bar dark elevate-on-scroll app class="" height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')"><v-icon>mdi-menu</v-icon></v-btn>
            <v-toolbar-title class="d-flex align-center">
                <div>
                    {{website.name}}
                    <v-menu bottom left v-if="websites.length>1" min-width="200">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-for="w in websites.filter(ws => ws.id !== website.id)" :key="`menu-${w.id}`" @click="$store.dispatch('website/loadStatistic', w.id)">
                                <v-list-item-content>
                                    <v-list-item-title>{{ w.name }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ w.url }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-card light flat color="transparent">
                <date-range-picker
                    ref="picker"
                    opens="left"
                    :locale-data="{ firstDay: 1 }"
                    v-model="dateRange"
                    :ranges="dateRanges"
                    @update="$store.dispatch('website/loadStatistic')"
                >
                    <template v-slot:input="picker">
                        <v-btn dark outlined min-width="120" class="pa-2 px-3">
                            {{rangeLabel(picker.startDate, picker.endDate)}}
                        </v-btn>
                    </template>
                    <template v-slot:footer="data">
                        <div class="d-flex pa-2 bt-1-1">
                            <v-spacer></v-spacer>
                            <v-btn depressed small color="primary" @click="data.clickApply">{{$t('select')}}</v-btn>
                        </div>
                    </template>
                </date-range-picker>
            </v-card>
        </v-app-bar>

        <v-container class="max-w-1200">
            <v-row>
                <v-col>
                    <UserCounter/>
                </v-col>
                <v-col>
                    <ViewCounter/>
                </v-col>
                <v-col>
                    <BounceCounter/>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <PageViewChart/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <PageList/>
                </v-col>
                <v-col cols="12" md="6">
                    <ReferrerList/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <ChannelList/>
                </v-col>
                <v-col cols="12" md="6">
                    <SocialMediaList/>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <UtmList/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <DeviceTypesList/>
                </v-col>
                <v-col cols="12" md="4">
                    <BrowserList/>
                </v-col>
                <v-col cols="12" md="4">
                    <CountryList/>
                </v-col>
            </v-row>
        </v-container>

    </div>
</template>

<script>
import {mapState} from 'vuex'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import JSectionTitle from "../components/JSectionTitle";
import Verification from "../components/Verification";
import SubscriptionProblem from "../components/subscription/SubscriptionProblem";
import PageList from "@/components/statistic/PageList";
import ReferrerList from "@/components/statistic/ReferrerList";
import ChannelList from "@/components/statistic/ChannelList";
import UserCounter from "@/components/statistic/UserCounter";
import ViewCounter from "@/components/statistic/ViewCounter";
import BounceCounter from "@/components/statistic/BounceCounter";
import SocialMediaList from "@/components/statistic/SocialMediaList";
import CountryList from "@/components/statistic/CountryList";
import DeviceTypesList from "@/components/statistic/DeviceTypesList";
import BrowserList from "@/components/statistic/BrowserList";
import PageViewChart from "@/components/statistic/PageViewChart";
import UtmList from "~/components/statistic/UtmList";

export default {

    head: {
        title: "Home"
    },

    components: {
        UtmList,
        PageViewChart,
        BrowserList,
        DeviceTypesList,
        CountryList,
        SocialMediaList,
        BounceCounter,
        ViewCounter,
        UserCounter,
        ChannelList,
        ReferrerList,
        PageList,
        SubscriptionProblem,
        Verification,
        JSectionTitle,
        DateRangePicker
    },

    computed: {
        ...mapState({
            websites: state => state.website.websites,
            statistic: state => state.website.statistic,
        }),

        website() {
            return this.websites.find(w => w.id === this.statistic.data.websiteId)||{name:""}
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

        dateRange: {
            get() {
                return this.statistic.dateRange
            },
            set(dateRange) {
                this.$store.commit('website/SET_DATE_RANGE', dateRange)
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
    },

    created() {
        let start = new Date(), end = new Date()
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 59)

        if (this.$cookies.get('dateRangeFrom')) {
            start.setTime(this.$cookies.get('dateRangeFrom'))
            end.setTime(this.$cookies.get('dateRangeEnd'))
        }

        this.dateRange = {
            startDate: start.getTime(),
            endDate: end.getTime()
        }
    },

    mounted() {
        if (this.websites.length && this.statistic.data.websiteId === null) {
            this.$store.dispatch('website/loadStatistic')
        }
    },

    data() {
        return {

        }
    },

    methods: {

    }
}
</script>

<style lang="sass">
    .v-data-footer__select
        display: none

    .vue-daterange-picker
        .form-control.reportrange-text
            border: none
            background: transparent
</style>
