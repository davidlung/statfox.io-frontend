<template>
    <v-app>

        <v-system-bar app color="orange lighten-1" v-if="systemMessage" height="50" class="font-weight-medium black--text">
            <v-icon class="px-5" size="24">mdi-information-outline</v-icon>
            {{systemMessage}}
        </v-system-bar>

        <v-navigation-drawer app :width="300" :mini-variant="false" v-model="drawer">

            <v-list-item>
                <v-list-item-avatar size="50">
                    <Logo :size="50"/>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title class="text-h6">STATFOX</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list nav class="grow" color="transparent">
                <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router nuxt exact>
                    <v-list-item-icon class="my-3 mr-5 ml-1">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title"/>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

        </v-navigation-drawer>

        <v-main class="fill-height">
            <nuxt/>
        </v-main>

        <Toast/>

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

    export default {

        components: {Logo, Toast, JSectionTitle},

        data() {
            return {
                items: [
                    {
                        icon: 'mdi-view-dashboard',
                        title: 'Dashboard',
                        to: '/'
                    },
                    {
                        icon: 'mdi-web',
                        title: 'Websites',
                        to: '/websites'
                    },
                    {
                        icon: 'mdi-cog',
                        title: 'Verwaltung',
                        to: '/settings'
                    },
                ],
                dialog: {
                    settings: false
                },
            }
        },

        beforeCreate() {
            if (process.client) {
                let darkMode = this.$cookies.get('darkMode')
                if (darkMode !== undefined) {
                    this.$vuetify.theme.dark = darkMode
                }
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

            isHomeActive(){
                return [
                    'index'
                ].includes(this.$route.name);
            },

            isServerActive(){
                return id => this.$route.params.id === id
            },

            shortName() {
                return (name) => {
                    name = name.replace(/[\W_]+/g,"")
                    return name.charAt(0) + (name.charAt(1)||'') + (name.charAt(2)||'')
                }
            }
        }
    }
</script>
