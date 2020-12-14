<template>
  <v-app>
    <v-main>
      <nuxt/>
    </v-main>
  </v-app>
</template>

<script>
export default {
    beforeCreate() {
        if (process.client) {
            let darkMode = this.$cookies.get('darkMode')
            if (darkMode !== undefined) {
                this.$vuetify.theme.dark = darkMode
            }
        }
    },
}
</script>


