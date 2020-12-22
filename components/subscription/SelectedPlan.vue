<template>
    <v-card outlined>
        <v-card-title class="text-overline pb-0">
            <span>{{plan.name}}</span>
        </v-card-title>
        <v-card-text class="text-h6 pb-0 d-flex">
            <span>{{plan.pageViews.toLocaleString()}}</span>
            <v-spacer></v-spacer>
            <div>
                {{price.currencySign}}{{ (price.amount/100).toFixed(0)}}
                <span class="text-caption">{{$t('per_interval', [$t(interval)])}}</span>
            </div>
        </v-card-text>
        <v-card-text class="text-caption pt-0">
            <span>{{$t('page_view_month')}}</span>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'

    export default {

        computed: {
            ...mapState({
                plans: state => state.subscription.plans,
                currency: state => state.subscription.selection.currency,
                interval: state => state.subscription.selection.interval,
                priceId: state => state.subscription.selection.priceId,
            }),

            price() {
                return this.plan.prices.find(p => p.currency===this.currency && p.interval===this.interval)
            },

            plan() {
                return this.plans.find(p => p.prices.filter(pr => pr.id === this.priceId).length>0)
            },
        },

    }
</script>
