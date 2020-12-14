<template>
  <v-app>
      <v-container fluid class="fill-height">
          <v-row align="center" justify="center">
              <v-col class="text-center">

                  <div v-if="error.statusCode === 404">
                      <v-icon size="100" color="blue-grey lighten-3">mdi-door-closed</v-icon>
                      <h1 class="text-h5 py-10">Sorry, but you hit a non existing page</h1>
                      <h2 class="text-subtitle-1">
                          This page was never intended to be developed.
                      </h2>
                      <div class="text--secondary mt-6" v-if="error.message">
                          {{error.message}}
                      </div>
                  </div>

                  <div v-else-if="error.statusCode >= 500">
                      <v-icon size="100" color="blue-grey lighten-3">mdi-weather-lightning-rainy</v-icon>
                      <h1 class="text-h5 py-10">Oh, it seems that something went wrong</h1>
                      <h2 class="text-subtitle-1">
                          Unfortunately the server is currently not able process the action you have requested.
                      </h2>
                      <div class="text--secondary mt-6" v-if="error.message">
                          {{error.message}}
                      </div>
                  </div>

                  <div v-else>
                      <v-icon size="100" color="blue-grey lighten-3">mdi-alert-octagon</v-icon>
                      <h1 class="text-h5 py-10">Oh, it seems that something went wrong</h1>
                      <h2 class="text-subtitle-1">
                          This is not the rule but a rarity, so try again later.
                      </h2>
                      <div class="text--secondary mt-6" v-if="error.message">
                          {{error.message}}
                      </div>
                  </div>

                  <v-btn depressed large nuxt to="/" color="primary" class="my-10 px-10">Back to home</v-btn>
              </v-col>
          </v-row>
      </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'blank',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    const title = this.error.statusCode === 404 ? '404 Not Found' : 'An error occurred';
    return {
      title
    }
  },
  data () {
    return {

    }
  }
}
</script>

