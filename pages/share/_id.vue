<template>
    <v-container class="max-w-1400">
        <template v-if="!e404">
            <div class="d-flex sf-toolbar">
                <v-toolbar-title class="d-flex align-center">
                    <a :href="websiteUrl" target="_blank" v-if="statistic.data.websiteId">
                        {{websiteName}}
                    </a>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <DarkModeSwitch/>
                <template v-if="!$vuetify.breakpoint.smAndDown">
                    <DatePicker/>
                </template>
                <template v-else>
                    <v-btn icon @click="showDatePickerDialog=!showDatePickerDialog"><v-icon>mdi-calendar</v-icon></v-btn>
                </template>
            </div>
            <Analytics/>
            <v-dialog scrollable fullscreen v-model="showDatePickerDialog" v-if="$vuetify.breakpoint.smAndDown">
                <v-card tile flat height="100%">
                    <v-card-text class="pa-0">
                        <DatePicker @applied="showDatePickerDialog=false"/>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </template>
        <template v-else>
            <div class="text-center pt-16">
                <v-icon size="50">mdi-electric-switch</v-icon>
                <div class="py-10 text-h6">
                    Tut uns Leid, aber leider ist unter diesem Link keine Website veröffentlich.
                </div>
                <div>
                    <a href="https://www.statfox.io">www.statfox.io</a>
                </div>
            </div>
        </template>
    </v-container>
</template>

<script>
    import Analytics from "@/components/Analytics";
    import DatePicker from "@/components/DatePicker";
    import DarkModeSwitch from "@/components/DarkModeSwitch";
    import {mapState} from "vuex";

    export default {

        layout: 'blank',

        components: {DatePicker, Analytics, DarkModeSwitch},

        computed: {
            ...mapState({
                statistic: state => state.website.statistic,
            }),

            websiteName() {
                return this.statistic.data.websiteName
            },

            websiteUrl() {
                return this.statistic.data.websiteUrl
            },
        },

        data() {
            return {
                showDatePickerDialog: false,
                e404: false
            }
        },

        mounted() {
            this.$store.dispatch('website/loadStatistic').catch(e => {
                this.e404 = true
            })
        }

    }
</script>

<style lang="sass" scoped>
    .v-input--selection-controls
        margin: 0
</style>
