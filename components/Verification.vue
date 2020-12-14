<template>
    <v-alert v-if="!user.verified" v-bind="$attrs" type="warning" color="orange">
        <div class="subtitle-2">EMAIL NOT VERIFIED</div>
        <div>
            Please verify you email by checking your inbox for the verification email and follow the instructions.
            If you did not receive an email or if it expired, then use the resend button bellow.
        </div>
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