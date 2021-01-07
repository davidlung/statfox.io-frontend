<template>
    <div>
        <div class="text-h5">{{$t('tracking_code')}}</div>
        <div class="py-4">{{$t('tracking_code_info')}}</div>
        <div class="pb-1 text-h6">Script-Tag</div>
        <v-text-field solo outlined flat
                      class="tracking-code-field"
                      :value="code"
                      @focus="select($event)"
                      @click="select($event)"
                      hide-details>
        </v-text-field>
        <div class="pt-4 pb-1 text-h6">Public Website Key</div>
        <v-text-field solo outlined flat
                      class="tracking-code-field"
                      :value="apiKey"
                      @focus="select($event)"
                      @click="select($event)"
                      hide-details>
        </v-text-field>
    </div>
</template>

<script>
    export default {

        props: {
            apiKey: {
                type: String,
                required: true
            }
        },

        computed: {

            code() {
                let tag = 'script',
                    src = this.$config.TRACKING_SCRIPT_URL
                return `<${tag} src="${src}" wid="${this.apiKey}" defer></${tag}>`
            }

        },

        methods: {

            select(e) {
                e.target && e.target.select && e.target.select()
            }

        }

    }
</script>

<style lang="sass" scoped>

    .tracking-code-field
        font-family: Consolas, Monospaced, 'Courier New', serif !important
        font-size: .9rem

</style>
