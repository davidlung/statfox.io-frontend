<template>
    <v-alert v-if="!user.verified" v-bind="$attrs" class="bg-darken-03">
        <div class="subtitle-2">{{$t('email_not_verified')}}</div>
        <div>{{$t('email_not_verified_info')}}</div>
        <VerificationButton class="mt-3" :resend="true" />
    </v-alert>
</template>

<script>
    import {mapState} from 'vuex'
    import VerificationButton from "./VerificationButton"

    export default {

        components: {
            VerificationButton
        },

        computed: {
            ...mapState({
                user: state => state.auth.user,
            }),

            outlined() {
                return this.$attrs.text !== undefined
            }
        },

    }
</script>
