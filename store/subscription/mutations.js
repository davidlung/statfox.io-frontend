import Vue from 'vue';

export default {

    SET_PLANS(state, plans)
    {
        Vue.set(state, 'plans', plans)
    },

    SET_SUBSCRIPTION_PRICE_ID(state, priceId)
    {
        Vue.set(state.selection, 'priceId', priceId)
    },

    SET_CURRENCY(state, currency)
    {
        Vue.set(state.selection, 'currency', currency)
    },

    SET_INTERVAL(state, interval)
    {
        Vue.set(state.selection, 'interval', interval)
    },

}