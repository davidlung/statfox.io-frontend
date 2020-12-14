<template>
    <div>
        <v-dialog v-model="show" :max-width="width" persistent>
            <template v-slot:activator="{ on, attrs }">
                <slot name="activator" :on="on" :attrs="attrs"></slot>
            </template>
            <v-card>
                <v-card-title>
                    <slot name="title">
                        <span>{{title}}</span>
                    </slot>
                </v-card-title>

                <v-card-text class="subtitle-2">
                    <slot name="text">{{text}}</slot>
                    <slot></slot>
                </v-card-text>

                <slot name="additional"></slot>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text :disabled="pending" @click.stop="show=false">{{labelDisagree}}</v-btn>
                    <v-btn depressed dark :color="color" :loading="pending" @click="agree">{{labelAgree}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {

        props: {
            title:{
                type: String,
                required: false,
                default: ''
            },
            text:{
                type: String,
                required: false,
                default: ''
            },
            color:{
                type: String,
                required: false,
                default: 'primary'
            },
            labelAgree: {
              type: String,
              required: false,
              default: 'Yes'
            },
            labelDisagree: {
              type: String,
              required: false,
              default: 'Cancel'
            },
            pending: {
                type: Boolean,
                required: false,
                default: false
            },
            width: {
                type: String,
                required: false,
                default: "400"
            }
        },

        data() {
            return {
                show: false
            }
        },

        methods: {

            async agree()
            {
                this.$emit('confirm', {done: () => {this.show=false}});
            },
        }

    }
</script>
