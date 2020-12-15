<template>
    <v-container fluid class="pt-0">

        <div class="text-h3 text-center py-12"><span class="primary--text">JsonServer</span>.io</div>

        <v-card width="450" class="mx-auto pa-3">
            <v-card-title class="justify-center text--secondary">
                <span>Password reset</span>
            </v-card-title>
            <v-card-subtitle class="text-center">
                I forgot my password
            </v-card-subtitle>

            <v-card-text class="py-0">
                <ResetPassword></ResetPassword>
            </v-card-text>

            <v-card-text class="d-flex pb-3">
                <nuxt-link to="/login" class="text-decoration-none">Login</nuxt-link>
                <v-spacer></v-spacer>
                <span>
                Not on {{$config.DOMAIN}} yet?
                <nuxt-link to="/signup" class="text-decoration-none">Register</nuxt-link>
            </span>
            </v-card-text>
        </v-card>

        <v-card flat color="transparent" width="450" class="mx-auto mt-8 text-caption text-center text--secondary">
            © 2020 {{$config.DOMAIN}}. All rights reserved.
        </v-card>
    </v-container>
</template>

<script>
    import ResetPassword from '../../components/public/ResetPassword'

    export default {
        layout: 'grey',

        head: {
            title: "Password Reset"
        },

        components: {
            ResetPassword
        },

        transition: {
            name: 'slide-y-transition'
        }
    }
</script>

