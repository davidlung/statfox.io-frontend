<template>
    <div>
        <v-form v-model="form.valid" ref="form" @submit.prevent="rename">
            <InputLabel>{{$t('name')}}</InputLabel>
            <v-text-field solo flat required autofocus
                          :placeholder="$t('website_name')"
                          :rules="form.rules.name"
                          v-model="form.data.name"
                          :disabled="pending"
            ></v-text-field>
            <v-card-actions class="pa-0">
                <v-spacer></v-spacer>
                <v-btn :disabled="pending" text @click="close">{{$t('cancel')}}</v-btn>
                <v-btn depressed :disabled="!form.valid" :loading="pending" color="primary"
                       type="submit">
                    {{$t('rename')}}
                </v-btn>
            </v-card-actions>
        </v-form>
    </div>
</template>

<script>
    import InputLabel from "~/components/InputLabel";
    import {mapState} from "vuex";

    export default {

        components: {InputLabel},

        props: {
            websiteId: {
                type: String,
                required: true
            }
        },

        computed: {
            ...mapState({
                pending: state => state.pending.website.renameWebsite,
            })
        },

        data() {
            return {
                form: {
                    valid: true,
                    rules: {
                        name: [
                            v => (v && v.trim().length > 0) || this.$t('rule.name.empty'),
                            v => (v && (/^[\p{L}\d\s.]+$/u).test(v)) || this.$t('rule.name.invalid'),
                        ],
                    },
                    data: {
                        name: null,
                    }
                },
            }
        },

        methods: {

            close() {
                if (this.$refs.form) {
                    this.$refs.form.reset()
                    this.$refs.form.resetValidation()
                }

                this.$emit('close')
            },

            rename() {
                if (this.pending || !this.$refs.form.validate()) return

                this.$store.dispatch('website/renameWebsite', {
                    id: this.websiteId ,
                    name: this.form.data.name
                }).then(res => {
                    this.close()
                }).catch(e => this.$error(e))
            },

        }
    }
</script>
