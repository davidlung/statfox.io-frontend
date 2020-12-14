import Vue from 'vue'

export default {

    // PLAN

    SET_PLAN(state, plan) {
        Vue.set(state.plan, 'id', plan.id || state.plan.id)
        Vue.set(state.plan, 'name', plan.name || state.plan.name)
        Vue.set(state.plan, 'level', plan.level || state.plan.level)
        Vue.set(state.plan, 'version', plan.version || state.plan.version)
        Vue.set(state.plan, 'limits', plan.limits || state.plan.limits)
        Vue.set(state.plan, 'features', plan.features || state.plan.features)
        Vue.set(state.plan, 'constraints', plan.constraints || state.plan.constraints)
    },

    SET_PAYMENT_METHODS(state, paymentMethods) {
        Vue.set(state, 'paymentMethods', paymentMethods)
    },

    // PAYMENT METHODS

    SET_PAYMENT_METHOD(state, paymentMethod) {
        let old = state.paymentMethods.find(p => p.id === paymentMethod.id)
        Vue.set(state.paymentMethods, state.paymentMethods.indexOf(old), paymentMethod)
    },

    DELETE_PAYMENT_METHOD(state, id) {
        let paymentMethod = state.paymentMethods.find(p => p.id === id)
        Vue.delete(state.paymentMethods, state.paymentMethods.indexOf(paymentMethod))
    },

    ADD_PAYMENT_METHOD(state, paymentMethod) {
        state.paymentMethods.unshift(paymentMethod)
        Vue.set(state.billing, 'defaultPaymentMethod', paymentMethod.id)
    },

    SET_DEFAULT_PAYMENT_METHOD(state, id) {
        Vue.set(state.billing, 'defaultPaymentMethod', id)
    },

    // BILLING

    SET_BILLING(state, billing) {
        Vue.set(state, 'billing', billing)
    },

    // SUBSCRIPTION

    SET_SUBSCRIPTION(state, subscription) {
        Vue.set(state, 'subscription', subscription)
    },

    SET_SUBSCRIPTION_RECENTLY_UPDATED(state) {
        Vue.set(state, 'subscriptionRecentlyUpdated', true)
    },

    // INVOICES

    SET_INVOICES(state, invoices) {
        Vue.set(state, 'invoices', invoices)
    },


}