<template>
    <div>
        <v-app-bar dark elevate-on-scroll app class="" height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')"><v-icon>mdi-menu</v-icon></v-btn>
            <v-toolbar-title>
                {{$t('your_websites')}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="dialog.create=true">
                {{$t('add_website')}}
            </v-btn>
        </v-app-bar>

        <v-container class="max-w-1000">
            <v-card outlined v-for="website in websites" :key="website.id" class="mt-3">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="text-h6 pb-2">{{website.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{website.url}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="flex-row align-center">
                            <v-chip small outlined>{{website.timezone}}</v-chip>
                            <v-divider vertical inset class="mx-5"></v-divider>
                            <v-btn icon @click="dialogCode(website.apiKey)"><v-icon>mdi-xml</v-icon></v-btn>

                            <v-menu bottom left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list dense>
                                    <v-list-item @click="$store.dispatch('website/loadStatistic', website.id).then(() => $router.push('/'))">
                                        <v-list-item-icon class="mr-5">
                                            <v-icon>mdi-chart-bar</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{$t('statistic')}}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="dialog.code=true">
                                        <v-list-item-icon class="mr-5">
                                            <v-icon>mdi-xml</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{$t('tracking_code')}}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="dialogRename(website.id)">
                                        <v-list-item-icon class="mr-5">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{$t('rename')}}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <VDialogConfirm :title="website.url"
                                                    width="500"
                                                    :label-agree="$t('delete')"
                                                    :label-disagree="$t('cancel')"
                                                    color="red"
                                                    @confirm="deleteWebsite(website.id, $event)"
                                                    :pending="pendingDelete">
                                        <template v-slot:activator="{on}">
                                            <v-list-item  v-on="on">
                                                <v-list-item-icon class="mr-5">
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-list-item-icon>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{$t('delete')}}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:text>
                                            {{$t('delete_website_text')}}
                                        </template>
                                    </VDialogConfirm>

                                </v-list>
                            </v-menu>

                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card>
            <v-card outlined v-if="!websites.length" class="mt-6">
                <v-card-title class="justify-center">{{$t('no_website')}}</v-card-title>
                <v-card-text class="text-center">
                    {{$t('no_website_info')}}
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn depressed color="primary" @click="dialog.create=true">
                        {{$t('add_website')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog persistent v-model="dialog.create" max-width="600">
            <v-card>
                <v-card-title>
                    <span>{{$t('add_website')}}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.create=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <CreateWebsiteForm @close="dialog.create=false"/>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog.code" max-width="700">
            <v-card>
                <v-card-title>
                    <span>{{$t('tracking_code')}}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.code=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <TrackingCode :api-key="websiteId"/>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog.rename" max-width="700">
            <v-card>
                <v-card-title>
                    <span>{{$t('rename_website')}}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.rename=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <RenameWebsiteForm :website-id="websiteId" @close="dialog.rename=false"/>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import InputLabel from "@/components/InputLabel";
    import VDialogConfirm from "@/components/VDialogConfirm";
    import CreateWebsiteForm from "~/components/website/CreateWebsiteForm";
    import TrackingCode from "~/components/website/TrackingCode";
    import RenameWebsiteForm from "@/components/website/RenameWebsiteForm";

    export default {

        components: {
            RenameWebsiteForm,
            TrackingCode,
            CreateWebsiteForm,
            VDialogConfirm,
            InputLabel
        },

        computed: {
            ...mapState({
                websites: state => state.website.websites,
                pendingDelete: state => state.pending.website.deleteWebsite,
            })
        },

        data() {
            return {
                dialog: {
                    create: false,
                    code: false,
                    rename: false
                },
                websiteId: null,
            }
        },

        methods: {

            dialogCode(id) {
                id !== undefined && (this.websiteId = id) && (this.dialog.code = true)
            },

            dialogRename(id) {
                this.websiteId = id
                this.dialog.rename = true
            },

            deleteWebsite(id, event) {
                this.$store.dispatch('website/deleteWebsite', id).then(res => {
                    event.done()
                }).catch(e => this.$error(e))
            },

        }

    }
</script>
