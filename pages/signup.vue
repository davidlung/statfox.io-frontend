<template>
    <v-container fluid class="full-height pt-8">

        <Brand/>

        <v-card outlined width="450" class="mx-auto pa-3">

            <v-card-title class="justify-center text--secondary">
                <span>{{$t('create_account')}}</span>
            </v-card-title>
            <v-card-subtitle class="text-center">
                {{$t('welcome_to', [$config.BRAND_ALT_3])}}
            </v-card-subtitle>

            <v-card-text class="py-0">
                <Register></Register>
            </v-card-text>

            <v-card-text class="pb-3">
                {{$t('have_account_q')}}
                <nuxt-link to="/login" class="text-decoration-none">{{$t('sign_in')}}</nuxt-link>
            </v-card-text>

        </v-card>

        <div class="mx-auto mt-8 text-caption text-center text--secondary">
            {{$t('all_rights_reserved', [$config.DOMAIN])}}
        </div>

    </v-container>
</template>

<script>
    import Register from '../components/public/Register'
    import Logo from "~/components/Logo";
    import Brand from "~/components/Brand";

    export default {
        layout: 'blank',

        head() {
            return {
                title: this.$t('sign_up')
            }
        },

        components: {
            Brand,
            Logo,
            Register
        },
    }
</script>
