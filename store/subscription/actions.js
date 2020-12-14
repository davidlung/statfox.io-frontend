export default {

    loadPlans({state, commit}, reload) {
        if (state.plans.length > 0 && (reload === undefined || !reload)) {
            return new Promise( (resolve, reject) => resolve(state.plans) )
        }
        return this.$axios.get('/api/v1/plans').then(res => {
            commit('SET_PLANS', res.data)
            return res
        });
    },

    selectPrice({commit}, priceId) {
        commit('SET_SUBSCRIPTION_PRICE_ID', priceId)
    },

    changeCurrency({commit}, currency) {
        commit('SET_CURRENCY', currency)
    },

    changeInterval({commit}, interval) {
        commit('SET_INTERVAL', interval)
    }

}