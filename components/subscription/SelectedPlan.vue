<template>
    <v-card outlined class="my-10">
        <v-card-subtitle class="pb-1 text-overline">{{$t('selected_plan')}}</v-card-subtitle>
        <v-card-text class="d-flex">
            <div>
                <div class="text-h6">{{plan.name}}</div>
                <div>
                    {{plan.pageViews.toLocaleString()}} {{$t('page_views')}} {{$t('per_interval', [$t('month')])}}
                </div>
            </div>
            <v-spacer></v-spacer>
            <span class="text-subtitle-2">
                    {{price.currencySign}}{{ (price.amount/100).toFixed(0)}} {{$t('per_interval', [$t(interval)])}}
                </span>
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
