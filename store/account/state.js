export default () => ({

    plan: {
        id: null,
        name: 'Free',
        level: 0,
        version: 0,
        pageViews: 0
    },

    billing: {
        balance: 0,
        defaultPaymentMethod: null,
        currency: null,
    },

    limitReached: false,

    invoices: [],

    paymentMethods: [],

    subscription: null,

    subscriptionRecentlyUpdated: false,

})
