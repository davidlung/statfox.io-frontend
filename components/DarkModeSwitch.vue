<template>
    <v-switch
        class="align-center"
        :input-value="isDark"
        @change="switchTheme"
        dense inset prepend-icon="mdi-moon-waxing-crescent"
        hide-details
    ></v-switch>
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
