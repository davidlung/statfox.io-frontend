<template>
    <v-container class="max-w-1100">

        <Brand/>

        <h1 class="text-h4 d-block text-center pt-12 pb-6">
            {{$t('welcome')}}
        </h1>

        <h2 class="text-h5 text-center pb-10 font-weight-light max-w-600 mx-auto">
            {{$t('welcome_text')}}
        </h2>

        <div class="d-flex justify-center pb-10">
            <v-btn x-large depressed nuxt link to="/" color="primary" class="px-10">
                {{$t('get_started')}}
            </v-btn>
        </div>

        <h2 class="text-h5 text-center pb-10 font-weight-light max-w-600 mx-auto">
            {{$t('welcome_advantages_title')}}
        </h2>

        <v-card outlined flat width="700" class="mx-auto">
            <v-card-text>
                <v-list three-line color="transparent">
                    <v-list-item v-for="(item, i) in intro" :key="`intro-${i}`" class="mb-4">
                        <v-list-item-icon>
                            <v-icon size="40" :color="item.color">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="text-h5 pb-2">{{item.title}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>

    </v-container>
</template>

<script>
    import Brand from "~/components/Brand";

    export default {

        layout: 'blank',

        components: {Brand},

        head() {
            return {
                title: this.$t('welcome')
            }
        },

        async middleware({store, route, redirect}) {
            if(store.state.auth.user.penultimateLoginAt !== null) {
                //await redirect('/')
            }
        },

        data() {
            return {
                intro: [
                    {
                        title: this.$t('welcome_advantages.no_cookie.title'),
                        description: this.$t('welcome_advantages.no_cookie.text'),
                        icon: 'mdi-cookie',
                        color: 'primary',
                    },
                    {
                        title: this.$t('welcome_advantages.unlimited.title'),
                        description: this.$t('welcome_advantages.unlimited.text'),
                        icon: 'mdi-rocket-launch',
                        color: 'red',
                    },
                    {
                        title: this.$t('welcome_advantages.easy.title'),
                        description: this.$t('welcome_advantages.easy.text'),
                        icon: 'mdi-chart-bar',
                        color: 'green',
                    },
                    {
                        title: this.$t('welcome_advantages.more.title'),
                        description: this.$t('welcome_advantages.more.text'),
                        icon: 'mdi-dots-vertical',
                        color: 'indigo',
                    },
                ]
            }
        },
    }
</script>
