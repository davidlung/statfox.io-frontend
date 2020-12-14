export default () => ({

    plan: {
        id: null,
        name: 'Free',
        level: 0,
        version: 0,
        limits: {
            requests: 0,
            chargingRate: 0,
            resources: 0,
            servers: 0,
            teams: 0,
            usersPerTeam: 0,
        },
        constraints: {
            spawns: 0
        },
        features: {
            responseHeaders: false,
            responseOptions: false
        }
    },

    billing: {
        balance: 0,
        defaultPaymentMethod: null,
        currency: null,
    },

    invoices: [],

    paymentMethods: [],

    subscription: null,

    subscriptionRecentlyUpdated: false,

})