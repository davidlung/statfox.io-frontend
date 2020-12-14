export default () => ({

    plans: [],
    selection: {
        currency: 'usd',
        interval: 'month',
        priceId: null
    },
    attributes: {
        requests: {
            name: "Requests per day",
            info: "The request quota is reset every day at 0:00 UTC.",
        },
        servers: {
            name: "Servers",
            info: null,
        },
        resourcesPerServer: {
            name: "Resources per server",
            info: null,
        },
        teams: {
            name: "Teams",
            info: null,
        },
        usersPerTeam: {
            name: "Users per team",
            info: null,
        },
        requestRechargeRate: {
            name: "Request charging rate",
            info: null,
        },
        spawns: {
            name: "Spawns per property",
            info: "Spawns are the amount of entries/array size which you can generate by one property e.g.\n" +
                "you can spawn max. x phone numbers per one phone property.",
        },
        values: {
            name: "Faked values per request",
            info: "The max count of faked values generated within one response from server.",
        },
        responseHeaders: {
            name: "Custom response headers",
            info: null,
        },
        responseOptions: {
            name: "Response options",
            info: "Options for a resource like response delay or status code.",
        },
    }

})