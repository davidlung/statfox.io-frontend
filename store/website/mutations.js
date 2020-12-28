import Vue from 'vue'

export default {

    // WEBSITES

    SET_WEBSITES(state, websites) {
        Vue.set(state, 'websites', websites)
    },

    ADD_WEBSITE(state, website) {
        state.websites.push(website)
    },

    DELETE_WEBSITE(state, id) {
        Vue.delete(state.websites, state.websites.indexOf(state.websites.find(w => w.id === id)))
    },

    // STATISTIC

    SET_STATISTIC(state, statistic) {
        Vue.set(state.statistic, 'data', statistic)
    },

    SET_DATE_RANGE(state, dateRange) {
        Vue.set(state.statistic, 'dateRange', dateRange)
    },

}
