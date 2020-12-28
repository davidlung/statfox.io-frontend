<template>
    <v-container fluid class="pt-0">

        <Brand/>

        <v-card width="450" class="mx-auto pa-3">
            <v-card-title class="justify-center text--secondary">
                <span>{{$t('password_reset')}}</span>
            </v-card-title>
            <v-card-subtitle class="text-center">
                {{$t('forgot_password')}}
            </v-card-subtitle>

            <v-card-text class="py-0">
                <ResetPassword></ResetPassword>
            </v-card-text>

            <v-card-text class="d-flex pb-3">
                <nuxt-link to="/login" class="text-decoration-none">{{$t('sign_in')}}</nuxt-link>
                <v-spacer></v-spacer>
                <span>
                {{$t('not_signed_up_yet', [$config.DOMAIN])}}
                <nuxt-link to="/signup" class="text-decoration-none">{{$t('sign_up')}}</nuxt-link>
            </span>
            </v-card-text>
        </v-card>

        <div class="mx-auto mt-8 text-caption text-center text--secondary">
            {{$t('all_rights_reserved', [$config.DOMAIN])}}
        </div>
    </v-container>
</template>

<script>
    import ResetPassword from '../../components/public/ResetPassword'
    import Brand from "~/components/Brand";

    export default {

        layout: 'blank',

        head() {
            return {
                title: this.$t('password_reset')
            }
        },

        components: {
            Brand,
            ResetPassword
        },

        transition: {
            name: 'slide-y-transition'
        }
    }
</script>

