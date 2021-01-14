<template>
    <v-app>

        <v-system-bar app color="orange lighten-1" v-if="systemMessage" height="50" class="font-weight-medium black--text">
            <v-icon class="px-5" size="24">mdi-information-outline</v-icon>
            {{systemMessage}}
        </v-system-bar>

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
                        this.$store.dispatch('showSystemMessage', this.$t('pwa_new_version'))
                    }
                });
            }

        },

        computed: {
            ...mapState({
                user: state => state.auth.user,
                systemMessage: state => state.systemMessage,
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
        }
    }
</script>
