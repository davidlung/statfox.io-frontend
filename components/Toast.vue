<template>
    <div id="toast-container">
        <v-scale-transition origin="bottom right" group>
            <div class="toast elevation-3" :class="`${toast.type}-toast`" v-for="toast in toasts" :key="`toast-${toast.id}`">
                <v-icon v-if="toast.icon">{{toast.icon}}</v-icon>
                <v-icon v-else>{{icon(toast.type)}}</v-icon>
                <div class="text-caption d-flex">
                    <span>{{caption(toast.type)}}</span>
                    <v-spacer></v-spacer>
                    <v-icon @click="$store.dispatch('toast/close', toast.id)">mdi-close</v-icon>
                </div>
                <div v-if="toast.title" class="font-weight-medium">{{toast.title}}</div>
                <div>{{toast.message}}</div>
            </div>
        </v-scale-transition>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {

        computed: {
            ...mapState({
                toasts: state => state.__toast.toasts,
            }),

            icon() {
                return type => {
                    return {
                        info:'mdi-information',
                        success:'mdi-check',
                        error:'mdi-close-octagon',
                        warning:'mdi-alert',
                    }[type]
                }
            },

            caption() {
                return type => {
                    return {
                        info:'INFORMATION',
                        success:'SUCCESS',
                        error:'ERROR',
                        warning:'WARNING',
                    }[type]
                }
            }
        },

    }
</script>

<style lang="sass" scoped>
    #toast-container
        position: fixed
        z-index: 999999999999
        bottom: 0
        right: 0
        padding: 30px

    .toast
        position: relative
        padding: 15px 15px
        border-radius: 3px
        border-left: 50px solid
        background-color: #fff
        margin-top: 12px
        min-width: 350px
        max-width: 600px

        &>i
            position: absolute
            left: -37px
            top: 36%
            color: #fff

        &.info-toast
            border-color: #42A5F5

        &.success-toast
            border-color: #4CAF50

        &.error-toast
            border-color: #F44336

        &.warning-toast
            border-color: #FFB300

</style>