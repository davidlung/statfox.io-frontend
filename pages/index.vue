<template>
    <div>
        <v-app-bar dark elevate-on-scroll app class="" height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')" v-if="!$route.query.embedded">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-toolbar-title class="d-flex align-center">
                <div>
                    {{website?website.name:$t('analytics')}}
                </div>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu bottom left v-if="websites.length>1 && !$route.query.sk" min-width="200">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-monitor-dashboard</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="w in websites.filter(ws => ws.id !== (website?website.id:0))" :key="`menu-${w.id}`" @click="$store.dispatch('website/loadStatistic', w.id)">
                        <v-list-item-content>
                            <v-list-item-title>{{ w.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ w.url }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>

            <template v-if="$route.query.embedded">
                <v-toolbar-items>
                    <DarkModeSwitch/>
                </v-toolbar-items>
                <v-btn icon link target="_blank" :href="$config.BASE_BROWSER_URL">
                    <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
            </template>

            <template v-if="websites.length && !$vuetify.breakpoint.smAndDown">
                <DatePicker/>
            </template>
            <template v-else-if="$vuetify.breakpoint.smAndDown">
                <v-btn icon @click="showDatePickerDialog=!showDatePickerDialog"><v-icon>mdi-calendar</v-icon></v-btn>
            </template>
        </v-app-bar>

        <v-dialog scrollable fullscreen v-model="showDatePickerDialog" v-if="websites.length && $vuetify.breakpoint.smAndDown">
            <v-card tile flat height="100%">
                <v-card-text class="pa-0">
                    <DatePicker @applied="showDatePickerDialog=false"/>
                </v-card-text>
            </v-card>
        </v-dialog>

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
                    <TrackingCode :web-key="website.webKey"/>
                </v-card-text>
            </v-card>

            <div class="text-h5 font-weight-thin mt-10 mb-6">
                {{$t('support.title')}}
            </div>

            <v-card outlined>
                <v-expansion-panels accordion>
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium">
                            {{$t('support.no_data_event_visits.title')}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{$t('support.no_data_event_visits.please_follow_instructions')}}
                            <ol>
                                <li class="py-1">{{$t('support.no_data_event_visits.update_page')}}</li>
                                <li class="py-1">{{$t('support.no_data_event_visits.check_range')}}</li>
                                <li class="py-1">{{$t('support.no_data_event_visits.check_url')}}</li>
                                <li class="py-1">{{$t('support.no_data_event_visits.check_tracking_code')}}</li>
                                <li class="py-1">{{$t('support.no_data_event_visits.check_tracking_code_position')}}</li>
                            </ol>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium">
                            {{$t('support.no_know_how.title')}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{$t('support.no_know_how.text', ['support@statfox.io'])}}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium">
                            {{$t('support.no_ad_utm.title')}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{$t('support.no_ad_utm.text')}}
                            <div>
                                <br>Google Ads:<br>
                                <a href="https://support.google.com/analytics/answer/1033981?hl=de" target="_blank">
                                    https://support.google.com/analytics/answer/1033981?hl=de
                                </a>
                                <br>
                                <br>Bing Ads:<br>
                                <a href="https://help.ads.microsoft.com/apex/index/3/de/56762" target="_blank">
                                    https://help.ads.microsoft.com/apex/index/3/de/56762
                                </a>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>

        </v-container>
        <v-container class="max-w-1400" v-else>

            <div v-if="$vuetify.breakpoint.smAndDown" class="text-center text--secondary text-caption">
                {{rangeLabel(statistic.dateRange.startDate, statistic.dateRange.endDate)}}
            </div>

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

            <Analytics/>

        </v-container>

    </div>
</template>

<script>
import {mapState} from 'vuex'

import JSectionTitle from "../components/JSectionTitle";
import Verification from "../components/Verification";
import SubscriptionProblem from "../components/subscription/SubscriptionProblem";
import CreateWebsiteForm from "~/components/website/CreateWebsiteForm";
import TrackingCode from "~/components/website/TrackingCode";
import DatePicker from "@/components/DatePicker";
import DarkModeSwitch from "@/components/DarkModeSwitch";
import Analytics from "@/components/Analytics";

export default {

    head() {
        return {
            title: this.website?this.website.name:this.$t('statistic')
        }
    },

    components: {
        Analytics,
        DatePicker,
        TrackingCode,
        CreateWebsiteForm,
        SubscriptionProblem,
        Verification,
        JSectionTitle,
        DarkModeSwitch
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

    mounted() {
        if (this.websites.length && this.statistic.data.websiteId === null) {
            let websiteId = undefined
            if (this.$route.query.sk && this.websites.filter(w => w.shareKey === this.$route.query.sk)) {
                websiteId = this.websites.find(w => w.shareKey === this.$route.query.sk).id
            }
            this.$store.dispatch('website/loadStatistic', websiteId)
        }
    },

    data() {
        return {
            createWebsiteDialog: false,
            showDatePickerDialog: false,
        }
    },
}
</script>
