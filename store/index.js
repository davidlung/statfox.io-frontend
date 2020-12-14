import info from '../system-info.json'

export const state = () => ({
    systemMessage: info.message||'',
    showMenu: true,
    overlay: {
        loading: {
            show: false,
            message: null
        }
    }
});

export const mutations = {

    SET_OVERLAY_LOADING(state, {show, message}) {
        state.overlay.loading.show = show
        state.overlay.loading.message = message || ''
    },

    SET_SYSTEM_MESSAGE(state, message) {
        state.systemMessage = (message||'') + (info.message||'')
    },

    SHOW_MENU(state, show) {
        state.showMenu = show
    }

}

export const actions = {

    async nuxtServerInit({dispatch, state, commit}, context) {
        await dispatch('auth/nuxtServerInit', context)

        if (state.auth.loggedIn) {
            await dispatch('account/initialize', context)
            await dispatch('website/initialize', context)
        }
    },

    async nuxtClientInit({dispatch, state, commit}, context) {
        await context.store.subscribe((mutation) => {
            if (mutation.type === 'auth/SET_USER' && mutation.payload.id !== undefined) {
                dispatch('account/initialize', context)
                dispatch('website/initialize', context)
            }
        })

        await dispatch('auth/nuxtClientInit', context)

        setTimeout(() => {
            if (context.$config.ENV_IS_STAGING === true) {
                commit('SET_SYSTEM_MESSAGE', 'ATTENTION: JsonServer.io is running in STAGING mode. ' +
                    'Test mode is enabled for subscription and payment processor!')
            }
        }, 3000)
    },

    showLoadingOverlay({commit}, message) {
        commit('SET_OVERLAY_LOADING', {show: true, message: message})
    },

    hideLoadingOverlay({commit}) {
        commit('SET_OVERLAY_LOADING', {show: false, message: null})
    },

    toggleMenu({commit, state}) {
        commit('SHOW_MENU', !state.showMenu)
    },


    verify({commit}, token) {
        return this.$axios.get('/api/v1/account/verify', {params: {t: token}}).then(res => {
            commit('auth/SET_VERIFIED')
            return res
        })
    },

    updateUser({commit}, {fullName, email, username, currentPassword, newPassword}) {
        return this.$axios.patch(process.env.JSIO_ENDPOINT_USER, {
            fullName, email, username, currentPassword, newPassword
        }, {_retry: true}).then(res => {
            commit('auth/SET_EMAIL', email)
            commit('auth/SET_NAME', fullName)
            username && commit('auth/SET_USERNAME', username)
            return res
        })
    },
};
