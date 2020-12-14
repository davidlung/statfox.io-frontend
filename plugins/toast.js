import Vue from "vue";

export default function ({store}, inject) {

    let toastCounter = 0

    store.registerModule('__toast', {
        namespaced: true,
        state: () => ({toasts: []}),
        mutations: {
            ADD(state, {id, type, title, message}) {
                state.toasts.push({id, type, title, message})
            },

            DELETE(state, id) {
                let toast = state.toasts.find(t => t.id === id)
                toast && Vue.delete(state.toasts, state.toasts.indexOf(toast))
            },
        },
        actions: {
            show({commit, dispatch}, {type, title, message}) {
                let id = ++toastCounter
                commit('ADD', {id, type, title, message});
                setTimeout(() => dispatch('close', id), 4000)
            },

            close({commit}, id) {
                commit('DELETE', id);
            },
        }
    })

    const show = (type, message, title) => {
        store.dispatch('__toast/show', {type, title, message})
    }

    const toast =  {

        info(message, title) {
            show('info', message, title)
        },

        success(message, title) {
            show('success', message, title)
        },

        error(message, title) {
            show('error', message, title)
        },

        warning(message, title) {
            show('warning', message, title)
        },

        oops() {
            show('error','Sorry, something went wrong with this action. Please try again later or contact the support.')
        },

    }

    inject('toast', toast)
}