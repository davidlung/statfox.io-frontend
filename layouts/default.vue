<template>
    <v-app>

        <v-banner app class="app-banner" v-if="systemMessage||updateAvailable">
            <div class="orange lighten-1 font-weight-medium black--text pa-2 d-flex">
                <div>
                    <template v-if="systemMessage">
                        {{systemMessage}}
                    </template>
                    <template v-if="updateAvailable">
                        {{$t('pwa_new_version')}}
                    </template>
                </div>
                <v-spacer></v-spacer>
                <div v-if="updateAvailable" class="shrink">
                    <v-btn depressed rounded class="px-1" min-width="36" @click="reload" :loading="pendingReload"><v-icon>mdi-reload</v-icon></v-btn>
                </div>
            </div>
        </v-banner>

        <v-navigation-drawer v-if="!$route.query.embedded" app :width="300" floating v-model="drawer">

            <Brand :compact="true"/>

            <v-list nav class="grow" color="transparent">
                <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router nuxt exact>
                    <v-list-item-icon class="my-3 mr-5 ml-1">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title" class="font-weight-medium"/>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

        </v-navigation-drawer>

        <v-main class="fill-height">
            <nuxt/>
        </v-main>

        <Toast/>

        <CookieConsent/>

        <v-overlay :value="overlay.loading.show" class="text-center" style="z-index: 99999!important;">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
            <div class="text-h6 my-8" v-show="overlay.loading.message">{{overlay.loading.message}}</div>
        </v-overlay>

    </v-app>
</template>

<script>
    import {mapState} from 'vuex'
    import JSectionTitle from "../components/JSectionTitle";
    import Toast from "../components/Toast";
    import Logo from "~/components/Logo";
    import Brand from "~/components/Brand";
    import CookieConsent from "~/components/CookieConsent";
    import DarkModeSwitch from "@/components/DarkModeSwitch";

    export default {

        components: {DarkModeSwitch, Brand, Logo, Toast, JSectionTitle, CookieConsent},

        data() {
            return {
                pendingReload: false,
                items: [
                    {
                        icon: 'mdi-chart-box-outline',
                        title: "Analytics",
                        to: '/'
                    },
                    {
                        icon: 'mdi-monitor-dashboard',
                        title: 'Websites',
                        to: '/websites'
                    },
                    {
                        icon: 'mdi-cog',
                        title: this.$t('administration'),
                        to: '/settings'
                    },
                ],
            }
        },

        beforeCreate() {
            let darkMode = this.$cookies.get('darkMode')
            if (darkMode !== undefined) {
                this.$vuetify.theme.dark = darkMode
            }
        },

        async mounted() {

            const workbox = await window.$workbox;
            if (workbox) {
                workbox.addEventListener('installed', (event) => {
                    if (event.isUpdate) {
                        this.$store.commit('SET_UPDATE_AVAILABLE', true)
                    }
                });
            }

        },

        computed: {
            ...mapState({
                user: state => state.auth.user,
                systemMessage: state => state.systemMessage,
                updateAvailable: state => state.updateAvailable,
                overlay: state => state.overlay,
            }),

            drawer: {
                set(value) {
                    this.$store.commit('SHOW_MENU', value)
                },
                get() {
                    return this.$store.state.showMenu
                }
            },
        },

        methods: {
            reload() {
                this.pendingReload = true
                window.location.reload()
            }
        }
    }
</script>

<style lang="sass">
    .app-banner
        .v-banner__wrapper
            padding: 0 !important
            border: none !important
        .v-banner__content
            padding: 0 !important
</style>
