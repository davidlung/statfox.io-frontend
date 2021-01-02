<template>
    <v-app>
        <v-main>
            <nuxt/>
            <CookieConsent/>
        </v-main>
    </v-app>
</template>

<script>

import CookieConsent from "~/components/CookieConsent";

export default {

    components: {CookieConsent},

    beforeCreate() {
        let darkMode = this.$cookies.get('darkMode')
        if (darkMode !== undefined) {
            this.$vuetify.theme.dark = darkMode
        }
    },
}
</script>


