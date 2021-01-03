<template>
    <div>
        <v-app-bar dark elevate-on-scroll app class="" height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')"><v-icon>mdi-menu</v-icon></v-btn>
            <v-toolbar-title class="d-flex align-center">
                <div>
                    {{website?website.name:$t('statistic')}}
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
            <v-card light flat color="transparent" v-if="websites.length">
                <date-range-picker
                    ref="picker"
                    opens="left"
                    :locale-data="localeData"
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

        <v-container class="max-w-1200 text-center" v-if="websites.length===0">
            <div class="d-flex justify-center py-10">
                <v-img src="/img/no_website.png" max-width="400"/>
            </div>
            <div class="text-h4 font-weight-thin my-5">
                {{$t('no_websites_headline')}}
            </div>
            <div class="text-subtitle-1 font-weight-thin my-5">
                {{$t('no_websites_text')}}
            </div>
            <v-btn x-large depressed color="primary" @click="createWebsiteDialog=true">
                {{$t('add_website')}}
            </v-btn>

            <v-dialog persistent v-model="createWebsiteDialog" max-width="600">
                <v-card>
                    <v-card-title>
                        <span>{{$t('add_website')}}</span>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="createWebsiteDialog=false"><v-icon>mdi-close</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text>
                        <CreateWebsiteForm @close="createWebsiteDialog=false"/>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
        <v-container class="max-w-900" v-else-if="noDataYet">
            <div class="text-h4 font-weight-thin my-5">
                {{$t('no_tracking_data_headline')}}
            </div>
            <div class="text-subtitle-1 font-weight-thin my-5">
                {{$t('no_tracking_data_text')}}
            </div>
            <v-card flat outlined>
                <v-card-text>
                    <TrackingCode :api-key="website.apiKey"/>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container class="max-w-1400" v-else>
            <v-row v-if="limitReached">
                <v-col>
                    <v-card outlined>
                        <v-card-title class="font-weight-thin">
                            <v-icon class="mr-4">mdi-clock-alert-outline</v-icon>
                            {{$t('limit_reached_title')}}
                        </v-card-title>
                        <v-card-text>{{$t('limit_reached_info')}}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6" lg="3">
                    <UserCounter/>
                </v-col>
                <v-col cols="6" lg="3">
                    <ViewCounter/>
                </v-col>
                <v-col cols="6" lg="3">
                    <BounceCounter/>
                </v-col>
                <v-col cols="6" lg="3">
                    <AvgVisitTimeCounter/>
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
import CreateWebsiteForm from "~/components/website/CreateWebsiteForm";
import TrackingCode from "~/components/website/TrackingCode";
import AvgVisitTimeCounter from "@/components/statistic/AvgVisitTimeCounter";

export default {

    head() {
        return {
            title: this.website?this.website.name:this.$t('statistic')
        }
    },

    components: {
        AvgVisitTimeCounter,
        TrackingCode,
        CreateWebsiteForm,
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
            limitReached: state => state.account.limitReached
        }),

        website() {
            return this.websites.find(w => w.id === this.statistic.data.websiteId)
        },

        noDataYet() {
            return this.website && !this.statistic.data.views.allTime
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
        }
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
            createWebsiteDialog: false
        }
    },
}
</script>

<style lang="sass">
    .v-data-footer__select
        display: none !important

    .vue-daterange-picker
        .form-control.reportrange-text
            border: none
            background: transparent


</style>
