<template>
    <div>
        <div class="text-h5">{{$t('tracking_code')}}</div>
        <div class="py-4">{{$t('tracking_code_info')}}</div>
        <div class="pb-1 text-h6">Script-Tag</div>
        <div class="d-flex">
            <v-text-field solo outlined flat
                          class="tracking-code-field"
                          :value="code"
                          @focus="select($event)"
                          @click="select($event)"
                          hide-details>
                <template v-slot:append>
                    <v-btn color="primary" depressed class="ml-2 px-2" min-width="24">
                        <v-icon>mdi-clipboard-text-outline</v-icon>
                    </v-btn>
                </template>
            </v-text-field>

        </div>
        <div class="pt-4 pb-1 text-h6">Public Website Key</div>
        <v-text-field solo outlined flat
                      class="tracking-code-field"
                      :value="webKey"
                      @focus="select($event)"
                      @click="select($event)"
                      hide-details>
            <template v-slot:append>
                <v-btn color="primary" depressed class="ml-2 px-2" min-width="24">
                    <v-icon>mdi-clipboard-text-outline</v-icon>
                </v-btn>
            </template>
        </v-text-field>
    </div>
</template>

<script>
    export default {

        props: {
            webKey: {
                type: String,
                required: true
            }
        },

        computed: {

            code() {
                let tag = 'script',
                    src = this.$config.TRACKING_SCRIPT_URL
                return `<${tag} src="${src}" wk="${this.webKey}" defer></${tag}>`
            }

        },

        methods: {

            select(e) {
                e.target && e.target.select && e.target.select()

                try {
                    document.execCommand('copy');
                    this.$toast.success(this.$t('toast.tracking_code.copied_success'))
                } catch (err) {
                    this.$toast.success(this.$t('toast.tracking_code.copied_error'))
                }
            }

        }

    }
</script>

<style lang="sass" scoped>

    .tracking-code-field
        font-family: Consolas, Monospaced, 'Courier New', serif !important
        font-size: .9rem

</style>
