<template>

    <v-card flat color="transparent" class="pa-3">

        <!-- VERIFICATION INFO -->
        <Verification/>

        <!-- EDIT -->
        <v-card-text>
            <v-form v-model="form.valid" ref="formAccountEdit" @submit="save" :disabled="pending">
                <InputLabel :required="true">{{$t('name')}}</InputLabel>
                <v-text-field solo flat required
                              hide-details="auto"
                              :placeholder="$t('your_name')"
                              v-model="form.data.name"
                              :rules="form.rules.name">
                </v-text-field>

                <InputLabel :required="true">
                    {{$t('email')}}
                    <span v-if="!availability.email" class="red--text">{{$t('email_in_use')}}</span>
                </InputLabel>

                <v-text-field solo flat required
                              type="email" hide-details="auto"
                              autocomplete="username"
                              v-model="form.data.email"
                              :rules="form.rules.email"
                              @blur="isAvailable('email')">
                </v-text-field>
                <InputLabel :required="true">{{$t('current_password')}}</InputLabel>
                <v-text-field solo flat required ref="password"
                              type="password" hide-details="auto" autocomplete="current-password"
                              :error-messages="form.incorrectPassword?$t('incorrect_password'):null"
                              v-model="form.data.currentPassword"
                              :rules="form.rules.password"
                              :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showCurrentPassword ? 'text' : 'password'"
                              @click:append="showCurrentPassword = !showCurrentPassword">
                </v-text-field>
                <template v-if="form.changePassword">
                    <InputLabel :required="true">{{$t('new_password')}}</InputLabel>
                    <v-text-field solo flat required
                                  type="password" hide-details="auto" autocomplete="new-password"
                                  v-model="form.data.newPassword"
                                  :rules="form.rules.password"
                                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                  :type="showNewPassword ? 'text' : 'password'"
                                  @click:append="showNewPassword = !showNewPassword">
                    </v-text-field>
                </template>
                <v-card-actions class="pa-0 mt-5">
                    <v-btn text @click="form.changePassword=true" color="primary"
                           v-if="!form.changePassword">{{$t('change_password_q')}}</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn depressed text v-if="form.changePassword"
                           @click="edit(false)">
                        {{$t('cancel')}}
                    </v-btn>
                    <v-btn depressed
                           type="submit"
                           color="primary"
                           :loading="pending"
                           :disabled="!form.valid||!this.availability.username||!this.availability.email">
                        {{$t('save')}}
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card-text>

        <v-divider class="my-7"></v-divider>

        <v-list>
            <v-list-item>
                <v-list-item-content>
                    {{$t('language')}}
                </v-list-item-content>
                <v-list-item-action>
                    <v-select solo flat hide-details :items="locales" v-model="locale"></v-select>
                </v-list-item-action>
            </v-list-item>
        </v-list>

    </v-card>



</template>

<script>
    import {mapState} from 'vuex'
    import Verification from "./Verification";
    import InputLabel from './InputLabel'
    import JSectionTitle from "@/components/JSectionTitle";

    export default {

        components: {
            JSectionTitle,
            Verification,
            InputLabel
        },

        mounted() {
            this.form.data.name = this.user.fullName||null
            this.form.data.email = this.user.email
        },

        data() {
            return {
                locales: [
                    {text: 'Deutsch', value: 'de'},
                    {text: 'English', value: 'en'},
                ],
                showCurrentPassword: false,
                showNewPassword: false,
                availability: {
                    email: true,
                    username: true,
                },
                form: {
                    valid: true,
                    changePassword: false,
                    incorrectPassword: false,
                    data: {
                        name: null,
                        email: null,
                        currentPassword: null,
                        newPassword: null,
                    },
                    rules: {
                            name: [
                                v => (v && v.trim().length > 0) || this.$t('rule.name.empty'),
                                v => (v && v.trim().length <= 40) || this.$t('rule.name.to_long', [40]),
                                v => (v && (/^[\p{L}\s\-]+$/u).test(v)) || this.$t('rule.name.invalid')
                            ],
                            email: [
                                v => (v && v.trim().length > 0) || this.$t('rule.email.empty'),
                                v => (v && v.trim().length <= 40) || this.$t('rule.email.to_long', [100]),
                                v => (v && (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(v)) || this.$t('rule.email.invalid')
                            ],
                            password: [
                                v => (v && v.trim().length >= 6) || this.$t('rule.password.to_short'),
                            ],
                        }
                }
            }
        },

        watch: {
            'form.data.currentPassword': function () {
                this.form.incorrectPassword = false
            },

            'form.data.email': function () {
                this.availability.email = true
            }
        },

        computed: {
            ...mapState({
                user: state => state.auth.user,
                account: state => state.account,
                pending: state => state.pending.updateUser
            }),

            locale: {
                get() {
                    return this.$i18n.locale
                },
                set(locale) {
                    this.$i18n.setLocale(locale)
                    this.$store.dispatch('account/changeLocale', locale)
                }
            }
        },

        methods: {

            edit(value) {
                this.form.data.currentPassword = null
                this.form.data.newPassword = null

                if(value){
                    this.form.data.email = this.user.email
                    this.form.data.name = this.user.fullName||null
                    this.form.data.username = this.user.username||null
                }else{

                    this.$emit('input', false)
                    this.form.changePassword = false
                }

                if(this.$refs.formAccountEdit) {
                    this.$refs.formAccountEdit.resetValidation()
                }
            },

            async isAvailable(field) {
                if (this.form.data[field] && this.form.data[field] !== this.user[field]) {
                    let res = await this.$axios.post('/api/v1/signup:check', {[field]: this.form.data[field]})
                    this.availability[field] = res.data.available
                }
            },

            async save(e) {

                e && e.preventDefault();

                await this.isAvailable('email')

                if(this.pending || !this.availability.email || !this.availability.username) return

                this.$store.dispatch('updateUser', {
                    fullName: this.form.data.name,
                    email: this.form.data.email,
                    currentPassword: this.form.data.currentPassword,
                    newPassword: this.form.data.newPassword
                }).then(res => {
                    this.$toast.success(this.$t('toast.account.updated'))
                }).catch(e => {
                    if(e.response && e.response.status === 401) {
                        this.form.incorrectPassword = true
                    }else{
                        this.$error(e)
                    }
                })
            },

        },
    }
</script>
