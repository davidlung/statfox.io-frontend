<template>
    <v-card flat outlined>
        <v-card-title class="text-overline justify-center">{{name}}</v-card-title>
        <v-card-text class="text-h4 text-center pb-2">{{value}}</v-card-text>
        <v-card-text class="text-caption text-center pt-0">{{subject}} per {{valueInterval}}</v-card-text>
        <v-card-text class="font-weight-regular pt-5 text-center">
            <div class="primary--text text-h4">{{currencySign}}{{ (price/100).toFixed(0)}}</div>
            <div class="text-caption">per {{payInterval}}</div>
        </v-card-text>
        <v-card-actions class="justify-center">
            <v-chip outlined color="primary" v-if="isCurrent">Your Plan</v-chip>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {

        props: {
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
            subject: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            currencyCode: {
                type: String,
                required: true
            },
            valueInterval: {
                type: String,
                required: true
            },
            payInterval: {
                type: String,
                required: true
            },
            isCurrent: {
                type: Boolean,
                required: true
            },
        },

        computed: {
            currencySign() {
                return ({usd:"$", eur:"€"})[this.currencyCode]||''
            }
        }

    }
</script>
