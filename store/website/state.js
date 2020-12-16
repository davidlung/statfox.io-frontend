export default () => ({

    websites: [],

    statistic: {
        dateRange: {
            startDate: null,
            endDate: null
        },
        data: {
            websiteId: null,
            views: {
                allTime: 0,
                total: 0,
                uniques: 0,
                bounce: 0
            },
            viewsChart: {
                proportion: null,
                data: []
            },
            pages: [],
            referrers: [],
            channels: [],
            socialMedia: [],
            countries: [],
            deviceTypes: [],
            browsers: [],
            utm: [],
        }
    },

})
