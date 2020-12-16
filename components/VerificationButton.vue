<template>

    <div>
        <v-btn class="bg-darken-1" depressed v-bind="$attrs" @click="send" :loading="pending" :disabled="sent" :text="sent" v-if="notVerified&&!sent">
            {{resend ? $t('resend_verification_email') : $t('send_verification_email')}}
        </v-btn>
        <div v-if="sent">{{$t('verification_check_inbox', [$config.DOMAIN])}}</div>
    </div>

</template>

<script>
    export default {

        props: {
            resend: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        data() {
            return {
                pending: false,
                sent: false
            }
        },

        mounted(){
            this.sent = this.$cookies.get('_vs')||false
        },

        computed: {
            notVerified() {
                return !this.$store.state.auth.user.verified
            }
        },

        methods: {

            send() {
                this.pending = true
                this.$axios.post('/api/v1/account/verify').then(res => {
                    this.sent = true
                    this.$cookies.set('_vs', true, {maxAge: 30})
                    setTimeout(()=>{this.sent = false}, 30000)
                }).catch(e => this.$error(e)).finally(() => {
                    this.pending = false
                })
            }

        }
    }
</script>
