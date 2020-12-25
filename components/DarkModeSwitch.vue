<template>
    <v-switch v-model="theme" prepend-icon="mdi-moon-waxing-crescent" hide-details flat dense inset></v-switch>
</template>

<script>
    export default {
        computed: {
            theme: {
                set(v) {
                    this.$cookies.set('darkMode', this.$vuetify.theme.dark = v, {
                        expires: this.$time.dateFromTime(undefined, +86400*720)
                    })
                },
                get() {
                    return this.$cookies.get('darkMode')||this.$vuetify.theme.dark
                }
            },
        },
    }
</script>
