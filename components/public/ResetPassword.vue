<template>
    <v-form v-model="valid" @submit.prevent="save" :disabled="pending">

        <template v-if="!saved">
            <InputLabel>{{$t('new_password')}}</InputLabel>
            <v-text-field solo flat autofocus hide-details
                          autocomplete="current-password"
                          :placeholder="$t('enter_new_password')"
                          v-model="password"
                          :rules="rules"
                          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword ? 'text' : 'password'"
                          @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-btn large block depressed
                   class="mt-8"
                   color="primary"
                   type="submit"
                   :loading="pending"
                   :disabled="!valid">
                {{$t('save')}}
            </v-btn>
        </template>
        <template v-else>
            <v-alert text type="success" class="green--text darken-2">
                {{$t('password_updated_info')}}
            </v-alert>
        </template>

    </v-form>
</template>

<script>
    import InputLabel from './../InputLabel'

    export default {

        components: {
            InputLabel
        },

        data() {
            return {
                valid: true,
                saved: false,
                showPassword: false,
                password: null,
                pending: false,
                rules: [
                    v => v && v.trim().length >= 6 || this.$t('rule.password.empty'),
                ]
            }
        },

        methods: {

            save() {
                if(!this.pending) {
                    this.pending = true
                    let t = this.$route.params.token
                    this.$axios.post('/api/v1/password', {password: this.password}, {params: {t}}).then(res => {
                        this.saved = true
                    }).catch(e => this.$error(e)).finally(() => this.pending = false);
                }
            }

        }

    }
</script>
