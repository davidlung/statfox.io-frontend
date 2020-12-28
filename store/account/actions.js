export default {

    async initialize({dispatch}) {
        await dispatch('loadAccount')
    },

    loadAccount({commit}) {
        return this.$axios.get('/api/v1/account').then(res => {
            commit('SET_PLAN', res.data.plan)
            commit('SET_BILLING', res.data.billing)
            commit('SET_SUBSCRIPTION', res.data.subscription)
            commit('SET_LIMIT_REACHED', res.data.limitReached)
            return res
        })
    },

    register({commit, state, dispatch}, {email, password, captcha}) {
        return this.$axios.post('/auth/signup', {email, password, captcha}).then(() => {
            return dispatch('auth/login', {email, password}, {root: true})
        })
    },

    // PAYMENT METHODS

    loadPaymentMethods({state, commit}, reload) {
        if (state.paymentMethods.length > 0 && (reload === undefined || !reload)) {
            return new Promise( (resolve, reject) => resolve(state.paymentMethods) )
        }
        return this.$axios.get('/api/v1/account/payment-methods').then(res => {
            commit('SET_PAYMENT_METHODS', res.data)
            return res
        })
    },

    addPaymentMethod({commit}, {card, billing}) {
        return this.$axios.post('/api/v1/account/payment-methods', {card, billing}).then(res => {
            commit('ADD_PAYMENT_METHOD', res.data)
            commit('SET_DEFAULT_PAYMENT_METHOD', res.data.id)
            return res
        })
    },

    setDefaultPaymentMethod({commit}, id) {
        return this.$axios.patch('/api/v1/account/payment-methods/' + id, {default: true}).then(res => {
            commit('SET_DEFAULT_PAYMENT_METHOD', id)
            this.$toast.success('Default payment method has been changed.')
            return res
        })
    },

    updatePaymentMethod({commit}, {id, card, billing}) {
        return this.$axios.patch('/api/v1/account/payment-methods/' + id, {card, billing}).then(res => {
            commit('SET_PAYMENT_METHOD', res.data)
            this.$toast.success('Payment method has been updated.')
            return res
        })
    },

    deletePaymentMethod({commit}, id) {
        return this.$axios.delete('/api/v1/account/payment-methods/' + id).then(res => {
            commit('DELETE_PAYMENT_METHOD', id)
            this.$toast.success('Payment method has been deleted.')
            return res
        })
    },

    // SUBSCRIPTION

    loadSubscription({state, commit}, reload) {
        if (state.subscription === null && (reload === undefined || !reload)) {
            return new Promise( (resolve, reject) => resolve(state.subscription) )
        }
        return this.$axios.get('/api/v1/account/subscription').then(res => {
            commit('SET_SUBSCRIPTION', res.data)
            return res
        })
    },

    createSubscription({commit}, priceId) {
        return this.$axios.post('/api/v1/account/subscription', {priceId}).then(res => {
            commit('SET_SUBSCRIPTION', res.data)
            commit('SET_SUBSCRIPTION_RECENTLY_UPDATED')
            return res
        })
    },

    switchSubscription({commit}, {priceId, prorationDate}) {
        return this.$axios.patch('/api/v1/account/subscription', {priceId, prorationDate}).then(res => {
            commit('SET_SUBSCRIPTION', res.data)
            commit('SET_SUBSCRIPTION_RECENTLY_UPDATED')
            return res
        })
    },

    cancelSubscription({commit}) {
        return this.$axios.patch('/api/v1/account/subscription', {cancel:true}).then(res => {
            commit('SET_SUBSCRIPTION', res.data)
            this.$toast.success('Subscription has been canceled.')
            return res
        })
    },

    revokeCancellation({commit}) {
        return this.$axios.patch('/api/v1/account/subscription', {cancel:false}).then(res => {
            commit('SET_SUBSCRIPTION', res.data)
            this.$toast.success('Subscription has been resumed.')
            return res
        })
    },

    synchronizeSubscription({dispatch, commit}) {
        return this.$axios.post('/api/v1/account/subscription:synchronize').then(res => {
            dispatch('account/loadAccount', null, {root:true})
            commit('SET_SUBSCRIPTION_RECENTLY_UPDATED')
            return res
        })
    },

    // INVOICES

    loadInvoices({state, commit}, reload) {
        if (state.invoices.length > 0 && (reload === undefined || !reload)) {
            return new Promise( (resolve, reject) => resolve(state.invoices) )
        }
        return this.$axios.get('/api/v1/account/invoices').then(res => {
            commit('SET_INVOICES', res.data)
            return res
        })
    },
}
