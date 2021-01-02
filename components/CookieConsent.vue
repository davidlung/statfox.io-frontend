<template>
    <v-container v-if="showConsent" fluid class="cookie-consent px-6 elevation-10">
        <v-row v-if="!showSettings">
            <v-col cols="12" sm="10">
                <div class="text-h6 mb-2">{{$t('cookie_consent.title')}}</div>
                <div class="text-caption">{{$t('cookie_consent.info')}}</div>
            </v-col>
            <v-col cols="shrink text-right">
                <v-btn depressed color="primary" @click="consent">{{$t('accept')}}</v-btn>
                <v-btn text @click="showSettings=true">{{$t('settings')}}</v-btn>
            </v-col>
        </v-row>
        <div v-else v-model="showSettings">
            <div class="text-h6 mb-2">{{$t('cookie_consent.settings')}}</div>
            <div class="d-flex">
                <div><b>{{$t('cookie_consent.required')}}</b></div>
                <div class="pl-3 primary--text">{{$t('cookie_consent.always_active')}}</div>
            </div>
            <div class="text-caption">
                {{$t('cookie_consent.required_info')}}
            </div>
            <div class="d-flex mt-2">
                <div><b>{{$t('cookie_consent.analytics')}}</b></div>
                <div class="pl-3 red--text">{{$t('cookie_consent.always_inactive')}}</div>
            </div>
            <div class="text-caption">
                {{$t('cookie_consent.analytics_info')}}
            </div>
            <v-btn depressed color="primary" class="mt-3" @click="consent">{{$t('accept')}}</v-btn>
        </div>
    </v-container>
</template>

<script>
    export default {

        data() {
            return {
                showConsent: this.$cookies.get('SF_CONSENT') === undefined,
                showSettings: false,
            }
        },

        methods: {
            consent() {
                this.$cookies.set('SF_CONSENT', this.$time.now())
                this.showConsent = false
                this.showSettings = false
            }
        }

    }
</script>

<style lang="sass">
    .cookie-consent
        position: fixed
        z-index: 10
        bottom: 0

</style>
