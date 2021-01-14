<template>
    <div>
        <div class="text-h5">{{$t('share_analytics')}}</div>
        <div class="py-4">{{$t('share_analytics_info')}}</div>
        <div class="d-flex justify-center">
            <v-switch :loading="pending" inset :label="status" :input-value="website.isShared" @change="toggleShare"></v-switch>
        </div>
        <template v-if="website.isShared">
            <div class="pb-1 text-h6">Link</div>
            <div>
                <v-chip outlined large label class="d-block">
                    <a :href="`${$config.BASE_BROWSER_URL}/analytics/${shareKey}`" target="_blank">{{$config.BASE_BROWSER_URL}}/analytics/{{shareKey}}</a>
                </v-chip>
            </div>
            <div class="pt-4 pb-1 d-flex">
                <span class="text-h6">{{$t('website_share_key')}}</span>
                <v-spacer></v-spacer>
                <v-dialog-confirm :title="$t('website_renew_share_key')"
                                  :pending="pendingRenew"
                                  @confirm="renewShareKey($event)"
                                  :label-agree="$t('yes')"
                                  :label-disagree="$t('cancel')">
                    <template v-slot:activator="{on}">
                        <v-btn small text color="primary" v-on="on">{{$t('website_renew_share_key')}}</v-btn>
                    </template>
                    <template v-slot:text>{{$t('website_renew_share_key_info')}}</template>
                </v-dialog-confirm>
            </div>
            <v-text-field solo outlined flat
                          class="tracking-code-field"
                          :value="shareKey"
                          @focus="select($event)"
                          @click="select($event)"
                          hide-details>
                <template v-slot:append>
                    <v-btn color="primary" depressed class="ml-2 px-2" min-width="24">
                        <v-icon>mdi-clipboard-text-outline</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </template>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import VDialogConfirm from "@/components/VDialogConfirm";

    export default {
        components: {VDialogConfirm},
        props: {
            websiteId: {
                type: String,
                required: true
            }
        },

        computed: {

            ...mapState({
                websites: state => state.website.websites,
                pending: state => state.pending.website.changeShareState,
                pendingRenew: state => state.pending.website.renewShareKey,
            }),

            website() {
                return this.websites.find(w => w.id === this.websiteId)
            },

            shareKey() {
                return this.website.shareKey
            },

            status() {
                return this.website.isShared ? this.$t('active') : this.$t('inactive')
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
            },

            toggleShare(shared) {
                this.$store.dispatch('website/changeShareState', {id: this.website.id, shared})
            },

            renewShareKey(event) {
                this.$store.dispatch('website/renewShareKey', this.website.id).then(res => {
                    event.done()
                })
            }

        }

    }
</script>

<style lang="sass" scoped>

    .tracking-code-field
        font-family: Consolas, Monospaced, 'Courier New', serif !important
        font-size: .9rem

</style>
