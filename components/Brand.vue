<template>
    <div>
        <div v-if="!compact" class="text-h3 text-center py-12">
            <div class="primary--text">
                <Logo :size="100"/>
            </div>
            <span class="font-weight-bold">
                <span :class="`blue-grey--text text--${nuance}-2`">STAT</span><span class="orange--text text--darken-2">FOX</span>
            </span>
        </div>
        <v-list-item v-else class="pt-4 pb-2">
            <v-list-item-avatar size="50">
                <Logo :size="50"/>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title class="text-h5 font-weight-bold">
                    <span :class="`blue-grey--text text--${nuance}-2`">STAT</span><span class="orange--text text--darken-2">FOX</span>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </div>
</template>

<script>
    import Logo from "~/components/Logo";
    export default {
        components: {Logo},

        props: {
            compact: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        computed: {

            dark() {
                return this.$vuetify.theme.dark
            },

            nuance() {
                return this.dark ? 'lighten' : 'darken'
            }

        }
    }
</script>
