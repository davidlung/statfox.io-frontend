<template>
    <v-container class="max-w-1100">

        <h1 class="text-h3 d-block text-center pt-12 pb-6">
            Welcome to <span class="primary--text">JsonServer</span>.io
        </h1>

        <h2 class="text-h5 text-center pb-10 font-weight-light">
            Thank you for choosing {{$config.DOMAIN}} for creating powerful fake data API.
        </h2>

        <v-card flat color="transparent" width="700" class="mx-auto">

            <template v-if="step === 0">
                <v-list three-line color="transparent">
                    <v-list-item v-for="(item, i) in intro" :key="`intro-${i}`" class="mb-4">
                        <v-list-item-icon>
                            <v-icon size="40" :color="item.color">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="text-h5 pb-2">{{item.title}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-card-actions class="justify-center">
                    <v-btn depressed @click="next" color="primary" class="px-10">Get Started Now</v-btn>
                </v-card-actions>
            </template>

            <template v-if="step === 1">
                <v-card-title class="pt-12">Create your first server</v-card-title>
                <v-card-text>
                    A server is a soft encapsulation of json/api resources which you can manage through the user interface.
                    It is possible to create multiple servers and share them with your teams for collaboration.
                </v-card-text>
                <v-card-text>
                    <v-subheader class="pa-0">How do you want to name your server?</v-subheader>
                    <v-form v-model="form.createServer.valid" ref="formServerCreate" class="mb-4" @submit="createServer">
                        <v-text-field autofocus solo flat required persistent-hint
                                      background-color="grey lighten-3"
                                      autocomplete="off"
                                      placeholder="Any name you like e.g. My Awesome Project or project.example.com"
                                      v-model="form.createServer.name"
                                      :disabled="pendingCreate"
                                      append-icon="mdi-server"
                                      hint="You can change this name again at any time."
                                      :rules="rules.createServer"
                        >
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed @click="next" text>Skip</v-btn>
                    <v-btn depressed @click="createServer" color="primary" :loading="pendingCreate"
                           :disabled="!form.createServer.valid" class="px-12">
                        Create
                    </v-btn>
                </v-card-actions>
            </template>

        </v-card>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {

        layout: 'blank',

        head: {
            title: "Welcome"
        },

        async middleware({store, route, redirect}) {
            if(store.state.auth.user.penultimateLoginAt !== null) {
                await redirect('/')
            }
        },

        data() {
            return {
                step: 0,
                steps: 2,
                form: {
                    createServer: {
                        valid: true,
                        name: null,
                    }
                },
                rules: {
                    createServer: [
                        v => (v && v.trim().length > 0) || 'Please enter a name.',
                        v => (v && v.trim().length <= 40) || 'The name must not be longer then 40 chars.',
                        v => (v && (/^[\p{L}\s:._\-\d]+$/u).test(v)) || 'The name contains not allowed characters.'
                    ]
                },
                intro: [
                    {
                        title: 'Powerful API resources',
                        description: 'A bundle of extra functionality like delay control, ' +
                                     'custom response headers/status and more, allows you to create powerful fake API.',
                        icon: 'mdi-code-braces-box',
                        color: 'primary',
                    },
                    {
                        title: 'Multiple Servers',
                        description: 'Create multiple servers for your fake API resources to separate them or just to organize your projects.',
                        icon: 'mdi-server',
                        color: 'purple',
                    },
                    {
                        title: 'Collaboration',
                        description: 'Share your servers with your team. Create teams and invite your project mates to collaborate on same servers.',
                        icon: 'mdi-account-group',
                        color: 'blue',
                    },
                    {
                        title: 'Statistic and Analysis',
                        description: 'Use the statistics to analyze the accesses of your API to identify potential request overhead or to study the access behavior.',
                        icon: 'mdi-chart-bar-stacked',
                        color: 'orange',
                    },
                ]
            }
        },

        computed: {

            ...mapState({
                pendingCreate: state => state.pending.server.create
            }),

            hasNext()
            {
                return this.step<this.steps-1;
            },

            hasPrev()
            {
                return this.step>0;
            }
        },

        methods: {

            prev()
            {
                this.hasPrev && this.step--;
            },

            next()
            {
                this.hasNext ? this.step++ : this.$router.push('/');
            },

            saveAccount()
            {
                this.next();
            },

            createServer(e)
            {
                e && e.preventDefault();

                if(this.pendingCreate || !this.$refs.formServerCreate.validate()) return;

                return this.$store.dispatch('server/createServer', this.form.createServer.name).then(res => {
                    this.form.createServer.name = null;
                    this.$refs.formServerCreate.reset();
                    this.$refs.formServerCreate.resetValidation();
                    this.$router.push('/');
                }).catch(e => this.$error(e));
            },

        }
    }
</script>
