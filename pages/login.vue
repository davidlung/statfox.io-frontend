<template>
    <v-container fluid class="pt-8">

        <Brand/>

        <v-card outlined width="450" class="mx-auto pa-3">
            <v-card-title class="justify-center text--secondary">
                <span>{{$t('sign_in')}}</span>
            </v-card-title>
            <v-card-subtitle class="text-center">
                {{$t('welcome_back', [$config.BRAND_ALT_3])}}
            </v-card-subtitle>

            <v-card-text class="py-0">
                <Login></Login>
            </v-card-text>

            <v-card-text class="d-flex pb-3">
                <nuxt-link to="/forgot" class="text-decoration-none">{{$t('password_forgot_q')}}</nuxt-link>
                <v-spacer></v-spacer>
                <span>
                    {{$t('not_signed_up_yet', [$config.DOMAIN])}}
                <nuxt-link to="/signup" class="text-decoration-none">{{$t('sign_up')}}</nuxt-link>
            </span>
            </v-card-text>
        </v-card>

        <div class="mt-3">
            <div class="max-w-50 mx-auto text-center">
                <DarkModeSwitch/>
            </div>
        </div>

        <div class="mx-auto mt-3 text-caption text-center text--secondary">
            {{$t('all_rights_reserved', [$config.DOMAIN])}}
        </div>
    </v-container>
</template>

<script>
    import Login from '../components/public/Login'
    import Logo from "~/components/Logo";
    import DarkModeSwitch from "~/components/DarkModeSwitch";
    import Brand from "~/components/Brand";

    export default {
        layout: 'blank',

        head() {
            return {
                title: this.$t('sign_in')
            }
        },

        components: {
            Brand,
            DarkModeSwitch,
            Logo,
            Login
        },

        transition: {
            name: 'slide-y-transition'
        }
    }
</script>

