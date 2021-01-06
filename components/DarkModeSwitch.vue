<template>
    <v-btn icon @click="switchTheme">
        <v-icon>{{isDark ? 'mdi-moon-waxing-crescent' : 'mdi-white-balance-sunny'}}</v-icon>
    </v-btn>
</template>

<script>
    export default {

        data() {
            return {
                isDark: this.$cookies.get('darkMode')||this.$vuetify.theme.dark
            }
        },

        methods: {
            switchTheme() {
                this.$cookies.set('darkMode', this.isDark = this.$vuetify.theme.dark = !this.isDark, {
                    expires: this.$time.dateFromTime(undefined, +86400*720)
                })
            }
        }
    }
</script>
