<template>
    <v-container fluid class="pt-8">

        <div class="text-h3 text-center py-12">
            <div class="primary--text">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 585 653" width="48" height="54"><style>tspan { white-space:pre } </style><path fill-rule="evenodd" class="shp0" d="M578.96 453.28C578.96 453.88 579 454.43 579 454.99C578.96 477.2 567.43 498.79 546.86 510.66L324.12 639.24C303.55 651.16 279.08 650.34 259.83 639.24C259.36 638.98 258.89 638.69 258.38 638.38L37.14 510.71C16.57 498.75 5.04 477.15 5 455.03L5.04 199.59C5.04 199 5 198.44 5 197.88C5.04 175.68 16.57 154.08 37.14 142.21L259.88 13.63C280.45 1.72 304.92 2.53 324.17 13.63C324.64 13.89 325.11 14.19 325.62 14.49L546.86 142.21C566.06 153.31 578.96 174.05 579 197.88L578.96 453.28ZM536.31 326.41L497.57 304.04L497.57 207.7L375.42 137.19L291.98 185.36L414.13 255.87L414.13 396.96L291.98 467.5L375.42 515.68L458.87 467.5L497.57 445.13L497.57 348.79L536.31 326.41ZM208.53 137.19L86.39 207.7L86.39 304.04L47.64 326.41L86.39 348.79L86.39 445.13L125.08 467.5L208.53 515.68L291.98 467.5L169.83 396.96L169.83 255.87L291.98 185.36L208.53 137.19Z" />
                </svg>
            </div>
            <span class="primary--text">JsonServer</span>.io
        </div>

        <v-card outlined width="450" class="mx-auto pa-3">
            <v-card-title class="justify-center text--secondary">
                <span>Sign in</span>
            </v-card-title>
            <v-card-subtitle class="text-center">
                Welcome back to jsonserver.io
            </v-card-subtitle>

            <v-card-text class="py-0">
                <Login></Login>
            </v-card-text>

            <v-card-text class="d-flex pb-3">
                <nuxt-link to="/forgot" class="text-decoration-none">Forgot password?</nuxt-link>
                <v-spacer></v-spacer>
                <span>
                Not on jsonserver.io yet?
                <nuxt-link to="/signup" class="text-decoration-none">Register</nuxt-link>
            </span>
            </v-card-text>
        </v-card>

        <div class="mx-auto mt-8 text-caption text-center text--secondary">
            © 2020 jsonserver.io. All rights reserved.
        </div>
    </v-container>
</template>

<script>
    import Login from '../components/public/Login'

    export default {
        layout: 'blank',

        head: {
            title: "Login"
        },

        components: {
            Login
        },

        transition: {
            name: 'slide-y-transition'
        }
    }
</script>

