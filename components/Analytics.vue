<template>
    <div class="statfox-analytics">
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
    </div>
</template>

<script>
    import UserCounter from "@/components/statistic/UserCounter"
    import ViewCounter from "@/components/statistic/ViewCounter"
    import BounceCounter from "@/components/statistic/BounceCounter"
    import AvgVisitTimeCounter from "@/components/statistic/AvgVisitTimeCounter"
    import PageViewChart from "@/components/statistic/PageViewChart"
    import PageList from "@/components/statistic/PageList"
    import ReferrerList from "@/components/statistic/ReferrerList"
    import ChannelList from "@/components/statistic/ChannelList"
    import SocialMediaList from "@/components/statistic/SocialMediaList"
    import UtmList from "@/components/statistic/UtmList"
    import DeviceTypesList from "@/components/statistic/DeviceTypesList"
    import BrowserList from "@/components/statistic/BrowserList"
    import CountryList from "@/components/statistic/CountryList"

    export default {

        components: {
            CountryList,
            BrowserList,
            DeviceTypesList,
            UtmList,
            SocialMediaList,
            ChannelList,
            ReferrerList,
            PageList,
            PageViewChart,
            AvgVisitTimeCounter,
            BounceCounter,
            ViewCounter,
            UserCounter
        }

    }
</script>

<style lang="sass">
    .v-data-footer__select
        display: none !important
</style>
