<template>
    <div>
        <v-app-bar dark elevate-on-scroll app class="" height="64">
            <v-btn icon @click="$store.dispatch('toggleMenu')"><v-icon>mdi-menu</v-icon></v-btn>
            <v-toolbar-title>
                Deine Websites
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="dialogCreate(true)">
                Website hinzufügen
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
                            <v-btn icon @click="dialogCode(website.id)"><v-icon>mdi-xml</v-icon></v-btn>

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
                                            <v-list-item-title>Statistik</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="dialog.code=true">
                                        <v-list-item-icon class="mr-5">
                                            <v-icon>mdi-xml</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Tracking-Code</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="">
                                        <v-list-item-icon class="mr-5">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Umbenennen</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <VDialogConfirm :title="website.url"
                                                    :width="500"
                                                    label-agree="Ja, Löschen"
                                                    label-disagree="Abbrechen"
                                                    color="red"
                                                    @confirm="deleteWebsite(website.id, $event)"
                                                    :pending="pendingDelete">
                                        <template v-slot:activator="{on}">
                                            <v-list-item  v-on="on">
                                                <v-list-item-icon class="mr-5">
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-list-item-icon>
                                                <v-list-item-content>
                                                    <v-list-item-title>Löschen</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:text>
                                            Möchtest du diese Website wirklich löschen? Dieser Vorgang entfernt die Website
                                            und dessen Statistiken. Möchtest du fortfahren?
                                        </template>
                                    </VDialogConfirm>

                                </v-list>
                            </v-menu>

                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card>
            <v-card outlined v-if="!websites.length" class="mt-6">
                <v-card-title class="justify-center">Keine Website vorhanden</v-card-title>
                <v-card-text class="text-center">
                    Du hast noch keine Website hinzugefügt. Um die Statistik/Tracking nutzen zu können,
                    muss mindestens eine Website hinzugefügt werden.
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn depressed color="primary" @click="dialogCreate(true)">
                        Website hinzufügen
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog persistent v-model="dialog.create" max-width="600">
            <v-card>
                <v-card-title>
                    <span>Website hinzufügen</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogCreate(false)"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form v-model="form.create.valid" ref="formWebsiteCreate" @submit.prevent="submitWebsite">
                        <InputLabel>Name</InputLabel>
                        <v-text-field solo flat required autofocus
                                      placeholder="Name der Website"
                                      :rules="form.create.rules.name"
                                      v-model="form.create.data.name"
                                      :disabled="pendingCreate"
                        ></v-text-field>
                        <InputLabel>Website-URL</InputLabel>
                        <v-text-field solo flat required persistent-hint
                                      placeholder="https://www.example.com"
                                      :rules="form.create.rules.url"
                                      v-model="form.create.data.url"
                                      :disabled="pendingCreate"
                        ></v-text-field>
                        <InputLabel>Zeitzone</InputLabel>
                        <v-row>
                            <v-col>
                                <v-select solo flat required
                                          :items="Object.keys(timezone.items)"
                                          label="Bitte auswählen"
                                          v-model="timezone.zone"
                                ></v-select>
                            </v-col>
                            <v-col>
                                <v-select solo flat required
                                          :items="timezone.items[timezone.zone]||[]"
                                          item-text="t"
                                          item-value="v"
                                          :rules="form.create.rules.tz"
                                          label="Bitte auswählen"
                                          v-model="form.create.data.tz"
                                          no-data-text="Wähle zuerst die Hauptzone aus"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-card-actions class="pa-0">
                            <v-spacer></v-spacer>
                            <v-btn :disabled="pendingCreate" text @click="dialogCreate(false)">Abbrechen</v-btn>
                            <v-btn depressed :disabled="!form.create.valid" :loading="pendingCreate" color="primary"
                                   type="submit">
                                Hinzufügen
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog.code" max-width="700">
            <v-card>
                <v-card-title>
                    <span>Tracking-Code</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog.code=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    Dies ist der Tracking-Code, der auf jeder Seite der Website platziert werden muss, um diese zu
                    tracken. Kopiere diesen Code, um ihn in den &lt;head> Bereich aller Seiten einzufügen, die Sie erfassen möchten.
                    <div class="blue-grey darken-5 white--text pa-5 mt-5 text-center">
                        <pre>&lt;script src="dsaasd" wid="{{codeWid}}" defer>&lt;/script></pre>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import InputLabel from "@/components/InputLabel";
    import VDialogConfirm from "@/components/VDialogConfirm";

    export default {

        components: {
            VDialogConfirm,
            InputLabel
        },

        computed: {
            ...mapState({
                websites: state => state.website.websites,
                pendingCreate: state => state.pending.website.createWebsite,
                pendingDelete: state => state.pending.website.deleteWebsite
            })
        },

        data() {
            return {
                dialog: {
                    create: false,
                    code: false
                },
                codeWid: null,
                form: {
                    create: {
                        valid: true,
                        rules: {
                            name: [
                                v => (v && v.trim().length > 0) || 'Bitte lege einen Namen für diese Website fest.',
                                v => (v && (/^[\p{L}\d\s.]+$/u).test(v)) || 'Der Name enthält unerlaubte Zeichen.',
                            ],
                            url: [
                                v => (v && v.trim().length > 0) || 'Bitte trage die URL deiner Website ein.',
                                v => (v && (/^(http|https):\/\/[\w.-]+\/?$/).test(v)) || 'Die URL scheint nicht korrekt zu sein, bitte überprüfe diese.',
                            ],
                            tz: [
                                v => (v && v.trim().length > 0) || 'Bitte wähle eine Zeitzone aus.',
                                v => (v && (/^[\w/-]+[a-z]$/).test(v)) || 'Wähle eine Zeitzone aus.',
                            ],
                        },
                        data: {
                            name: null,
                            url: null,
                            tz: null,
                        }
                    },
                },
                timezone: {
                    zone: null,
                    items: {
                        "Africa": [
                            {
                                "t": "Abidjan (GMT +00:00)",
                                "v": "Africa\/Abidjan"
                            },
                            {
                                "t": "Accra (GMT +00:00)",
                                "v": "Africa\/Accra"
                            },
                            {
                                "t": "Addis_Ababa (GMT +03:00)",
                                "v": "Africa\/Addis_Ababa"
                            },
                            {
                                "t": "Algiers (GMT +01:00)",
                                "v": "Africa\/Algiers"
                            },
                            {
                                "t": "Asmara (GMT +03:00)",
                                "v": "Africa\/Asmara"
                            },
                            {
                                "t": "Bamako (GMT +00:00)",
                                "v": "Africa\/Bamako"
                            },
                            {
                                "t": "Bangui (GMT +01:00)",
                                "v": "Africa\/Bangui"
                            },
                            {
                                "t": "Banjul (GMT +00:00)",
                                "v": "Africa\/Banjul"
                            },
                            {
                                "t": "Bissau (GMT +00:00)",
                                "v": "Africa\/Bissau"
                            },
                            {
                                "t": "Blantyre (GMT +02:00)",
                                "v": "Africa\/Blantyre"
                            },
                            {
                                "t": "Brazzaville (GMT +01:00)",
                                "v": "Africa\/Brazzaville"
                            },
                            {
                                "t": "Bujumbura (GMT +02:00)",
                                "v": "Africa\/Bujumbura"
                            },
                            {
                                "t": "Cairo (GMT +02:00)",
                                "v": "Africa\/Cairo"
                            },
                            {
                                "t": "Casablanca (GMT +01:00)",
                                "v": "Africa\/Casablanca"
                            },
                            {
                                "t": "Ceuta (GMT +01:00)",
                                "v": "Africa\/Ceuta"
                            },
                            {
                                "t": "Conakry (GMT +00:00)",
                                "v": "Africa\/Conakry"
                            },
                            {
                                "t": "Dakar (GMT +00:00)",
                                "v": "Africa\/Dakar"
                            },
                            {
                                "t": "Dar_es_Salaam (GMT +03:00)",
                                "v": "Africa\/Dar_es_Salaam"
                            },
                            {
                                "t": "Djibouti (GMT +03:00)",
                                "v": "Africa\/Djibouti"
                            },
                            {
                                "t": "Douala (GMT +01:00)",
                                "v": "Africa\/Douala"
                            },
                            {
                                "t": "El_Aaiun (GMT +01:00)",
                                "v": "Africa\/El_Aaiun"
                            },
                            {
                                "t": "Freetown (GMT +00:00)",
                                "v": "Africa\/Freetown"
                            },
                            {
                                "t": "Gaborone (GMT +02:00)",
                                "v": "Africa\/Gaborone"
                            },
                            {
                                "t": "Harare (GMT +02:00)",
                                "v": "Africa\/Harare"
                            },
                            {
                                "t": "Johannesburg (GMT +02:00)",
                                "v": "Africa\/Johannesburg"
                            },
                            {
                                "t": "Juba (GMT +03:00)",
                                "v": "Africa\/Juba"
                            },
                            {
                                "t": "Kampala (GMT +03:00)",
                                "v": "Africa\/Kampala"
                            },
                            {
                                "t": "Khartoum (GMT +02:00)",
                                "v": "Africa\/Khartoum"
                            },
                            {
                                "t": "Kigali (GMT +02:00)",
                                "v": "Africa\/Kigali"
                            },
                            {
                                "t": "Kinshasa (GMT +01:00)",
                                "v": "Africa\/Kinshasa"
                            },
                            {
                                "t": "Lagos (GMT +01:00)",
                                "v": "Africa\/Lagos"
                            },
                            {
                                "t": "Libreville (GMT +01:00)",
                                "v": "Africa\/Libreville"
                            },
                            {
                                "t": "Lome (GMT +00:00)",
                                "v": "Africa\/Lome"
                            },
                            {
                                "t": "Luanda (GMT +01:00)",
                                "v": "Africa\/Luanda"
                            },
                            {
                                "t": "Lubumbashi (GMT +02:00)",
                                "v": "Africa\/Lubumbashi"
                            },
                            {
                                "t": "Lusaka (GMT +02:00)",
                                "v": "Africa\/Lusaka"
                            },
                            {
                                "t": "Malabo (GMT +01:00)",
                                "v": "Africa\/Malabo"
                            },
                            {
                                "t": "Maputo (GMT +02:00)",
                                "v": "Africa\/Maputo"
                            },
                            {
                                "t": "Maseru (GMT +02:00)",
                                "v": "Africa\/Maseru"
                            },
                            {
                                "t": "Mbabane (GMT +02:00)",
                                "v": "Africa\/Mbabane"
                            },
                            {
                                "t": "Mogadishu (GMT +03:00)",
                                "v": "Africa\/Mogadishu"
                            },
                            {
                                "t": "Monrovia (GMT +00:00)",
                                "v": "Africa\/Monrovia"
                            },
                            {
                                "t": "Nairobi (GMT +03:00)",
                                "v": "Africa\/Nairobi"
                            },
                            {
                                "t": "Ndjamena (GMT +01:00)",
                                "v": "Africa\/Ndjamena"
                            },
                            {
                                "t": "Niamey (GMT +01:00)",
                                "v": "Africa\/Niamey"
                            },
                            {
                                "t": "Nouakchott (GMT +00:00)",
                                "v": "Africa\/Nouakchott"
                            },
                            {
                                "t": "Ouagadougou (GMT +00:00)",
                                "v": "Africa\/Ouagadougou"
                            },
                            {
                                "t": "Porto-Novo (GMT +01:00)",
                                "v": "Africa\/Porto-Novo"
                            },
                            {
                                "t": "Sao_Tome (GMT +00:00)",
                                "v": "Africa\/Sao_Tome"
                            },
                            {
                                "t": "Tripoli (GMT +02:00)",
                                "v": "Africa\/Tripoli"
                            },
                            {
                                "t": "Tunis (GMT +01:00)",
                                "v": "Africa\/Tunis"
                            },
                            {
                                "t": "Windhoek (GMT +02:00)",
                                "v": "Africa\/Windhoek"
                            }
                        ],
                        "America": [
                            {
                                "t": "Adak (GMT -10:00)",
                                "v": "America\/Adak"
                            },
                            {
                                "t": "Anchorage (GMT -9:00)",
                                "v": "America\/Anchorage"
                            },
                            {
                                "t": "Anguilla (GMT -4:00)",
                                "v": "America\/Anguilla"
                            },
                            {
                                "t": "Antigua (GMT -4:00)",
                                "v": "America\/Antigua"
                            },
                            {
                                "t": "Araguaina (GMT -3:00)",
                                "v": "America\/Araguaina"
                            },
                            {
                                "t": "Argentina\/Buenos_Aires (GMT -3:00)",
                                "v": "America\/Argentina\/Buenos_Aires"
                            },
                            {
                                "t": "Argentina\/Catamarca (GMT -3:00)",
                                "v": "America\/Argentina\/Catamarca"
                            },
                            {
                                "t": "Argentina\/Cordoba (GMT -3:00)",
                                "v": "America\/Argentina\/Cordoba"
                            },
                            {
                                "t": "Argentina\/Jujuy (GMT -3:00)",
                                "v": "America\/Argentina\/Jujuy"
                            },
                            {
                                "t": "Argentina\/La_Rioja (GMT -3:00)",
                                "v": "America\/Argentina\/La_Rioja"
                            },
                            {
                                "t": "Argentina\/Mendoza (GMT -3:00)",
                                "v": "America\/Argentina\/Mendoza"
                            },
                            {
                                "t": "Argentina\/Rio_Gallegos (GMT -3:00)",
                                "v": "America\/Argentina\/Rio_Gallegos"
                            },
                            {
                                "t": "Argentina\/Salta (GMT -3:00)",
                                "v": "America\/Argentina\/Salta"
                            },
                            {
                                "t": "Argentina\/San_Juan (GMT -3:00)",
                                "v": "America\/Argentina\/San_Juan"
                            },
                            {
                                "t": "Argentina\/San_Luis (GMT -3:00)",
                                "v": "America\/Argentina\/San_Luis"
                            },
                            {
                                "t": "Argentina\/Tucuman (GMT -3:00)",
                                "v": "America\/Argentina\/Tucuman"
                            },
                            {
                                "t": "Argentina\/Ushuaia (GMT -3:00)",
                                "v": "America\/Argentina\/Ushuaia"
                            },
                            {
                                "t": "Aruba (GMT -4:00)",
                                "v": "America\/Aruba"
                            },
                            {
                                "t": "Asuncion (GMT -3:00)",
                                "v": "America\/Asuncion"
                            },
                            {
                                "t": "Atikokan (GMT -5:00)",
                                "v": "America\/Atikokan"
                            },
                            {
                                "t": "Bahia (GMT -3:00)",
                                "v": "America\/Bahia"
                            },
                            {
                                "t": "Bahia_Banderas (GMT -6:00)",
                                "v": "America\/Bahia_Banderas"
                            },
                            {
                                "t": "Barbados (GMT -4:00)",
                                "v": "America\/Barbados"
                            },
                            {
                                "t": "Belem (GMT -3:00)",
                                "v": "America\/Belem"
                            },
                            {
                                "t": "Belize (GMT -6:00)",
                                "v": "America\/Belize"
                            },
                            {
                                "t": "Blanc-Sablon (GMT -4:00)",
                                "v": "America\/Blanc-Sablon"
                            },
                            {
                                "t": "Boa_Vista (GMT -4:00)",
                                "v": "America\/Boa_Vista"
                            },
                            {
                                "t": "Bogota (GMT -5:00)",
                                "v": "America\/Bogota"
                            },
                            {
                                "t": "Boise (GMT -7:00)",
                                "v": "America\/Boise"
                            },
                            {
                                "t": "Cambridge_Bay (GMT -7:00)",
                                "v": "America\/Cambridge_Bay"
                            },
                            {
                                "t": "Campo_Grande (GMT -4:00)",
                                "v": "America\/Campo_Grande"
                            },
                            {
                                "t": "Cancun (GMT -5:00)",
                                "v": "America\/Cancun"
                            },
                            {
                                "t": "Caracas (GMT -4:00)",
                                "v": "America\/Caracas"
                            },
                            {
                                "t": "Cayenne (GMT -3:00)",
                                "v": "America\/Cayenne"
                            },
                            {
                                "t": "Cayman (GMT -5:00)",
                                "v": "America\/Cayman"
                            },
                            {
                                "t": "Chicago (GMT -6:00)",
                                "v": "America\/Chicago"
                            },
                            {
                                "t": "Chihuahua (GMT -7:00)",
                                "v": "America\/Chihuahua"
                            },
                            {
                                "t": "Costa_Rica (GMT -6:00)",
                                "v": "America\/Costa_Rica"
                            },
                            {
                                "t": "Creston (GMT -7:00)",
                                "v": "America\/Creston"
                            },
                            {
                                "t": "Cuiaba (GMT -4:00)",
                                "v": "America\/Cuiaba"
                            },
                            {
                                "t": "Curacao (GMT -4:00)",
                                "v": "America\/Curacao"
                            },
                            {
                                "t": "Danmarkshavn (GMT +00:00)",
                                "v": "America\/Danmarkshavn"
                            },
                            {
                                "t": "Dawson (GMT -7:00)",
                                "v": "America\/Dawson"
                            },
                            {
                                "t": "Dawson_Creek (GMT -7:00)",
                                "v": "America\/Dawson_Creek"
                            },
                            {
                                "t": "Denver (GMT -7:00)",
                                "v": "America\/Denver"
                            },
                            {
                                "t": "Detroit (GMT -5:00)",
                                "v": "America\/Detroit"
                            },
                            {
                                "t": "Dominica (GMT -4:00)",
                                "v": "America\/Dominica"
                            },
                            {
                                "t": "Edmonton (GMT -7:00)",
                                "v": "America\/Edmonton"
                            },
                            {
                                "t": "Eirunepe (GMT -5:00)",
                                "v": "America\/Eirunepe"
                            },
                            {
                                "t": "El_Salvador (GMT -6:00)",
                                "v": "America\/El_Salvador"
                            },
                            {
                                "t": "Fort_Nelson (GMT -7:00)",
                                "v": "America\/Fort_Nelson"
                            },
                            {
                                "t": "Fortaleza (GMT -3:00)",
                                "v": "America\/Fortaleza"
                            },
                            {
                                "t": "Glace_Bay (GMT -4:00)",
                                "v": "America\/Glace_Bay"
                            },
                            {
                                "t": "Goose_Bay (GMT -4:00)",
                                "v": "America\/Goose_Bay"
                            },
                            {
                                "t": "Grand_Turk (GMT -5:00)",
                                "v": "America\/Grand_Turk"
                            },
                            {
                                "t": "Grenada (GMT -4:00)",
                                "v": "America\/Grenada"
                            },
                            {
                                "t": "Guadeloupe (GMT -4:00)",
                                "v": "America\/Guadeloupe"
                            },
                            {
                                "t": "Guatemala (GMT -6:00)",
                                "v": "America\/Guatemala"
                            },
                            {
                                "t": "Guayaquil (GMT -5:00)",
                                "v": "America\/Guayaquil"
                            },
                            {
                                "t": "Guyana (GMT -4:00)",
                                "v": "America\/Guyana"
                            },
                            {
                                "t": "Halifax (GMT -4:00)",
                                "v": "America\/Halifax"
                            },
                            {
                                "t": "Havana (GMT -5:00)",
                                "v": "America\/Havana"
                            },
                            {
                                "t": "Hermosillo (GMT -7:00)",
                                "v": "America\/Hermosillo"
                            },
                            {
                                "t": "Indiana\/Indianapolis (GMT -5:00)",
                                "v": "America\/Indiana\/Indianapolis"
                            },
                            {
                                "t": "Indiana\/Knox (GMT -6:00)",
                                "v": "America\/Indiana\/Knox"
                            },
                            {
                                "t": "Indiana\/Marengo (GMT -5:00)",
                                "v": "America\/Indiana\/Marengo"
                            },
                            {
                                "t": "Indiana\/Petersburg (GMT -5:00)",
                                "v": "America\/Indiana\/Petersburg"
                            },
                            {
                                "t": "Indiana\/Tell_City (GMT -6:00)",
                                "v": "America\/Indiana\/Tell_City"
                            },
                            {
                                "t": "Indiana\/Vevay (GMT -5:00)",
                                "v": "America\/Indiana\/Vevay"
                            },
                            {
                                "t": "Indiana\/Vincennes (GMT -5:00)",
                                "v": "America\/Indiana\/Vincennes"
                            },
                            {
                                "t": "Indiana\/Winamac (GMT -5:00)",
                                "v": "America\/Indiana\/Winamac"
                            },
                            {
                                "t": "Inuvik (GMT -7:00)",
                                "v": "America\/Inuvik"
                            },
                            {
                                "t": "Iqaluit (GMT -5:00)",
                                "v": "America\/Iqaluit"
                            },
                            {
                                "t": "Jamaica (GMT -5:00)",
                                "v": "America\/Jamaica"
                            },
                            {
                                "t": "Juneau (GMT -9:00)",
                                "v": "America\/Juneau"
                            },
                            {
                                "t": "Kentucky\/Louisville (GMT -5:00)",
                                "v": "America\/Kentucky\/Louisville"
                            },
                            {
                                "t": "Kentucky\/Monticello (GMT -5:00)",
                                "v": "America\/Kentucky\/Monticello"
                            },
                            {
                                "t": "Kralendijk (GMT -4:00)",
                                "v": "America\/Kralendijk"
                            },
                            {
                                "t": "La_Paz (GMT -4:00)",
                                "v": "America\/La_Paz"
                            },
                            {
                                "t": "Lima (GMT -5:00)",
                                "v": "America\/Lima"
                            },
                            {
                                "t": "Los_Angeles (GMT -8:00)",
                                "v": "America\/Los_Angeles"
                            },
                            {
                                "t": "Lower_Princes (GMT -4:00)",
                                "v": "America\/Lower_Princes"
                            },
                            {
                                "t": "Maceio (GMT -3:00)",
                                "v": "America\/Maceio"
                            },
                            {
                                "t": "Managua (GMT -6:00)",
                                "v": "America\/Managua"
                            },
                            {
                                "t": "Manaus (GMT -4:00)",
                                "v": "America\/Manaus"
                            },
                            {
                                "t": "Marigot (GMT -4:00)",
                                "v": "America\/Marigot"
                            },
                            {
                                "t": "Martinique (GMT -4:00)",
                                "v": "America\/Martinique"
                            },
                            {
                                "t": "Matamoros (GMT -6:00)",
                                "v": "America\/Matamoros"
                            },
                            {
                                "t": "Mazatlan (GMT -7:00)",
                                "v": "America\/Mazatlan"
                            },
                            {
                                "t": "Menominee (GMT -6:00)",
                                "v": "America\/Menominee"
                            },
                            {
                                "t": "Merida (GMT -6:00)",
                                "v": "America\/Merida"
                            },
                            {
                                "t": "Metlakatla (GMT -9:00)",
                                "v": "America\/Metlakatla"
                            },
                            {
                                "t": "Mexico_City (GMT -6:00)",
                                "v": "America\/Mexico_City"
                            },
                            {
                                "t": "Miquelon (GMT -3:00)",
                                "v": "America\/Miquelon"
                            },
                            {
                                "t": "Moncton (GMT -4:00)",
                                "v": "America\/Moncton"
                            },
                            {
                                "t": "Monterrey (GMT -6:00)",
                                "v": "America\/Monterrey"
                            },
                            {
                                "t": "Montevideo (GMT -3:00)",
                                "v": "America\/Montevideo"
                            },
                            {
                                "t": "Montserrat (GMT -4:00)",
                                "v": "America\/Montserrat"
                            },
                            {
                                "t": "Nassau (GMT -5:00)",
                                "v": "America\/Nassau"
                            },
                            {
                                "t": "New_York (GMT -5:00)",
                                "v": "America\/New_York"
                            },
                            {
                                "t": "Nipigon (GMT -5:00)",
                                "v": "America\/Nipigon"
                            },
                            {
                                "t": "Nome (GMT -9:00)",
                                "v": "America\/Nome"
                            },
                            {
                                "t": "Noronha (GMT -2:00)",
                                "v": "America\/Noronha"
                            },
                            {
                                "t": "North_Dakota\/Beulah (GMT -6:00)",
                                "v": "America\/North_Dakota\/Beulah"
                            },
                            {
                                "t": "North_Dakota\/Center (GMT -6:00)",
                                "v": "America\/North_Dakota\/Center"
                            },
                            {
                                "t": "North_Dakota\/New_Salem (GMT -6:00)",
                                "v": "America\/North_Dakota\/New_Salem"
                            },
                            {
                                "t": "Nuuk (GMT -3:00)",
                                "v": "America\/Nuuk"
                            },
                            {
                                "t": "Ojinaga (GMT -7:00)",
                                "v": "America\/Ojinaga"
                            },
                            {
                                "t": "Panama (GMT -5:00)",
                                "v": "America\/Panama"
                            },
                            {
                                "t": "Pangnirtung (GMT -5:00)",
                                "v": "America\/Pangnirtung"
                            },
                            {
                                "t": "Paramaribo (GMT -3:00)",
                                "v": "America\/Paramaribo"
                            },
                            {
                                "t": "Phoenix (GMT -7:00)",
                                "v": "America\/Phoenix"
                            },
                            {
                                "t": "Port-au-Prince (GMT -5:00)",
                                "v": "America\/Port-au-Prince"
                            },
                            {
                                "t": "Port_of_Spain (GMT -4:00)",
                                "v": "America\/Port_of_Spain"
                            },
                            {
                                "t": "Porto_Velho (GMT -4:00)",
                                "v": "America\/Porto_Velho"
                            },
                            {
                                "t": "Puerto_Rico (GMT -4:00)",
                                "v": "America\/Puerto_Rico"
                            },
                            {
                                "t": "Punta_Arenas (GMT -3:00)",
                                "v": "America\/Punta_Arenas"
                            },
                            {
                                "t": "Rainy_River (GMT -6:00)",
                                "v": "America\/Rainy_River"
                            },
                            {
                                "t": "Rankin_Inlet (GMT -6:00)",
                                "v": "America\/Rankin_Inlet"
                            },
                            {
                                "t": "Recife (GMT -3:00)",
                                "v": "America\/Recife"
                            },
                            {
                                "t": "Regina (GMT -6:00)",
                                "v": "America\/Regina"
                            },
                            {
                                "t": "Resolute (GMT -6:00)",
                                "v": "America\/Resolute"
                            },
                            {
                                "t": "Rio_Branco (GMT -5:00)",
                                "v": "America\/Rio_Branco"
                            },
                            {
                                "t": "Santarem (GMT -3:00)",
                                "v": "America\/Santarem"
                            },
                            {
                                "t": "Santiago (GMT -3:00)",
                                "v": "America\/Santiago"
                            },
                            {
                                "t": "Santo_Domingo (GMT -4:00)",
                                "v": "America\/Santo_Domingo"
                            },
                            {
                                "t": "Sao_Paulo (GMT -3:00)",
                                "v": "America\/Sao_Paulo"
                            },
                            {
                                "t": "Scoresbysund (GMT -1:00)",
                                "v": "America\/Scoresbysund"
                            },
                            {
                                "t": "Sitka (GMT -9:00)",
                                "v": "America\/Sitka"
                            },
                            {
                                "t": "St_Barthelemy (GMT -4:00)",
                                "v": "America\/St_Barthelemy"
                            },
                            {
                                "t": "St_Johns (GMT -3:00)",
                                "v": "America\/St_Johns"
                            },
                            {
                                "t": "St_Kitts (GMT -4:00)",
                                "v": "America\/St_Kitts"
                            },
                            {
                                "t": "St_Lucia (GMT -4:00)",
                                "v": "America\/St_Lucia"
                            },
                            {
                                "t": "St_Thomas (GMT -4:00)",
                                "v": "America\/St_Thomas"
                            },
                            {
                                "t": "St_Vincent (GMT -4:00)",
                                "v": "America\/St_Vincent"
                            },
                            {
                                "t": "Swift_Current (GMT -6:00)",
                                "v": "America\/Swift_Current"
                            },
                            {
                                "t": "Tegucigalpa (GMT -6:00)",
                                "v": "America\/Tegucigalpa"
                            },
                            {
                                "t": "Thule (GMT -4:00)",
                                "v": "America\/Thule"
                            },
                            {
                                "t": "Thunder_Bay (GMT -5:00)",
                                "v": "America\/Thunder_Bay"
                            },
                            {
                                "t": "Tijuana (GMT -8:00)",
                                "v": "America\/Tijuana"
                            },
                            {
                                "t": "Toronto (GMT -5:00)",
                                "v": "America\/Toronto"
                            },
                            {
                                "t": "Tortola (GMT -4:00)",
                                "v": "America\/Tortola"
                            },
                            {
                                "t": "Vancouver (GMT -8:00)",
                                "v": "America\/Vancouver"
                            },
                            {
                                "t": "Whitehorse (GMT -7:00)",
                                "v": "America\/Whitehorse"
                            },
                            {
                                "t": "Winnipeg (GMT -6:00)",
                                "v": "America\/Winnipeg"
                            },
                            {
                                "t": "Yakutat (GMT -9:00)",
                                "v": "America\/Yakutat"
                            },
                            {
                                "t": "Yellowknife (GMT -7:00)",
                                "v": "America\/Yellowknife"
                            }
                        ],
                        "Antarctica": [
                            {
                                "t": "Casey (GMT +11:00)",
                                "v": "Antarctica\/Casey"
                            },
                            {
                                "t": "Davis (GMT +07:00)",
                                "v": "Antarctica\/Davis"
                            },
                            {
                                "t": "DumontDUrville (GMT +10:00)",
                                "v": "Antarctica\/DumontDUrville"
                            },
                            {
                                "t": "Macquarie (GMT +11:00)",
                                "v": "Antarctica\/Macquarie"
                            },
                            {
                                "t": "Mawson (GMT +05:00)",
                                "v": "Antarctica\/Mawson"
                            },
                            {
                                "t": "McMurdo (GMT +13:00)",
                                "v": "Antarctica\/McMurdo"
                            },
                            {
                                "t": "Palmer (GMT -3:00)",
                                "v": "Antarctica\/Palmer"
                            },
                            {
                                "t": "Rothera (GMT -3:00)",
                                "v": "Antarctica\/Rothera"
                            },
                            {
                                "t": "Syowa (GMT +03:00)",
                                "v": "Antarctica\/Syowa"
                            },
                            {
                                "t": "Troll (GMT +00:00)",
                                "v": "Antarctica\/Troll"
                            },
                            {
                                "t": "Vostok (GMT +06:00)",
                                "v": "Antarctica\/Vostok"
                            }
                        ],
                        "Arctic": [
                            {
                                "t": "Longyearbyen (GMT +01:00)",
                                "v": "Arctic\/Longyearbyen"
                            }
                        ],
                        "Asia": [
                            {
                                "t": "Aden (GMT +03:00)",
                                "v": "Asia\/Aden"
                            },
                            {
                                "t": "Almaty (GMT +06:00)",
                                "v": "Asia\/Almaty"
                            },
                            {
                                "t": "Amman (GMT +02:00)",
                                "v": "Asia\/Amman"
                            },
                            {
                                "t": "Anadyr (GMT +12:00)",
                                "v": "Asia\/Anadyr"
                            },
                            {
                                "t": "Aqtau (GMT +05:00)",
                                "v": "Asia\/Aqtau"
                            },
                            {
                                "t": "Aqtobe (GMT +05:00)",
                                "v": "Asia\/Aqtobe"
                            },
                            {
                                "t": "Ashgabat (GMT +05:00)",
                                "v": "Asia\/Ashgabat"
                            },
                            {
                                "t": "Atyrau (GMT +05:00)",
                                "v": "Asia\/Atyrau"
                            },
                            {
                                "t": "Baghdad (GMT +03:00)",
                                "v": "Asia\/Baghdad"
                            },
                            {
                                "t": "Bahrain (GMT +03:00)",
                                "v": "Asia\/Bahrain"
                            },
                            {
                                "t": "Baku (GMT +04:00)",
                                "v": "Asia\/Baku"
                            },
                            {
                                "t": "Bangkok (GMT +07:00)",
                                "v": "Asia\/Bangkok"
                            },
                            {
                                "t": "Barnaul (GMT +07:00)",
                                "v": "Asia\/Barnaul"
                            },
                            {
                                "t": "Beirut (GMT +02:00)",
                                "v": "Asia\/Beirut"
                            },
                            {
                                "t": "Bishkek (GMT +06:00)",
                                "v": "Asia\/Bishkek"
                            },
                            {
                                "t": "Brunei (GMT +08:00)",
                                "v": "Asia\/Brunei"
                            },
                            {
                                "t": "Chita (GMT +09:00)",
                                "v": "Asia\/Chita"
                            },
                            {
                                "t": "Choibalsan (GMT +08:00)",
                                "v": "Asia\/Choibalsan"
                            },
                            {
                                "t": "Colombo (GMT +05:00)",
                                "v": "Asia\/Colombo"
                            },
                            {
                                "t": "Damascus (GMT +02:00)",
                                "v": "Asia\/Damascus"
                            },
                            {
                                "t": "Dhaka (GMT +06:00)",
                                "v": "Asia\/Dhaka"
                            },
                            {
                                "t": "Dili (GMT +09:00)",
                                "v": "Asia\/Dili"
                            },
                            {
                                "t": "Dubai (GMT +04:00)",
                                "v": "Asia\/Dubai"
                            },
                            {
                                "t": "Dushanbe (GMT +05:00)",
                                "v": "Asia\/Dushanbe"
                            },
                            {
                                "t": "Famagusta (GMT +02:00)",
                                "v": "Asia\/Famagusta"
                            },
                            {
                                "t": "Gaza (GMT +02:00)",
                                "v": "Asia\/Gaza"
                            },
                            {
                                "t": "Hebron (GMT +02:00)",
                                "v": "Asia\/Hebron"
                            },
                            {
                                "t": "Ho_Chi_Minh (GMT +07:00)",
                                "v": "Asia\/Ho_Chi_Minh"
                            },
                            {
                                "t": "Hong_Kong (GMT +08:00)",
                                "v": "Asia\/Hong_Kong"
                            },
                            {
                                "t": "Hovd (GMT +07:00)",
                                "v": "Asia\/Hovd"
                            },
                            {
                                "t": "Irkutsk (GMT +08:00)",
                                "v": "Asia\/Irkutsk"
                            },
                            {
                                "t": "Jakarta (GMT +07:00)",
                                "v": "Asia\/Jakarta"
                            },
                            {
                                "t": "Jayapura (GMT +09:00)",
                                "v": "Asia\/Jayapura"
                            },
                            {
                                "t": "Jerusalem (GMT +02:00)",
                                "v": "Asia\/Jerusalem"
                            },
                            {
                                "t": "Kabul (GMT +04:00)",
                                "v": "Asia\/Kabul"
                            },
                            {
                                "t": "Kamchatka (GMT +12:00)",
                                "v": "Asia\/Kamchatka"
                            },
                            {
                                "t": "Karachi (GMT +05:00)",
                                "v": "Asia\/Karachi"
                            },
                            {
                                "t": "Kathmandu (GMT +05:00)",
                                "v": "Asia\/Kathmandu"
                            },
                            {
                                "t": "Khandyga (GMT +09:00)",
                                "v": "Asia\/Khandyga"
                            },
                            {
                                "t": "Kolkata (GMT +05:00)",
                                "v": "Asia\/Kolkata"
                            },
                            {
                                "t": "Krasnoyarsk (GMT +07:00)",
                                "v": "Asia\/Krasnoyarsk"
                            },
                            {
                                "t": "Kuala_Lumpur (GMT +08:00)",
                                "v": "Asia\/Kuala_Lumpur"
                            },
                            {
                                "t": "Kuching (GMT +08:00)",
                                "v": "Asia\/Kuching"
                            },
                            {
                                "t": "Kuwait (GMT +03:00)",
                                "v": "Asia\/Kuwait"
                            },
                            {
                                "t": "Macau (GMT +08:00)",
                                "v": "Asia\/Macau"
                            },
                            {
                                "t": "Magadan (GMT +11:00)",
                                "v": "Asia\/Magadan"
                            },
                            {
                                "t": "Makassar (GMT +08:00)",
                                "v": "Asia\/Makassar"
                            },
                            {
                                "t": "Manila (GMT +08:00)",
                                "v": "Asia\/Manila"
                            },
                            {
                                "t": "Muscat (GMT +04:00)",
                                "v": "Asia\/Muscat"
                            },
                            {
                                "t": "Nicosia (GMT +02:00)",
                                "v": "Asia\/Nicosia"
                            },
                            {
                                "t": "Novokuznetsk (GMT +07:00)",
                                "v": "Asia\/Novokuznetsk"
                            },
                            {
                                "t": "Novosibirsk (GMT +07:00)",
                                "v": "Asia\/Novosibirsk"
                            },
                            {
                                "t": "Omsk (GMT +06:00)",
                                "v": "Asia\/Omsk"
                            },
                            {
                                "t": "Oral (GMT +05:00)",
                                "v": "Asia\/Oral"
                            },
                            {
                                "t": "Phnom_Penh (GMT +07:00)",
                                "v": "Asia\/Phnom_Penh"
                            },
                            {
                                "t": "Pontianak (GMT +07:00)",
                                "v": "Asia\/Pontianak"
                            },
                            {
                                "t": "Pyongyang (GMT +09:00)",
                                "v": "Asia\/Pyongyang"
                            },
                            {
                                "t": "Qatar (GMT +03:00)",
                                "v": "Asia\/Qatar"
                            },
                            {
                                "t": "Qostanay (GMT +06:00)",
                                "v": "Asia\/Qostanay"
                            },
                            {
                                "t": "Qyzylorda (GMT +05:00)",
                                "v": "Asia\/Qyzylorda"
                            },
                            {
                                "t": "Riyadh (GMT +03:00)",
                                "v": "Asia\/Riyadh"
                            },
                            {
                                "t": "Sakhalin (GMT +11:00)",
                                "v": "Asia\/Sakhalin"
                            },
                            {
                                "t": "Samarkand (GMT +05:00)",
                                "v": "Asia\/Samarkand"
                            },
                            {
                                "t": "Seoul (GMT +09:00)",
                                "v": "Asia\/Seoul"
                            },
                            {
                                "t": "Shanghai (GMT +08:00)",
                                "v": "Asia\/Shanghai"
                            },
                            {
                                "t": "Singapore (GMT +08:00)",
                                "v": "Asia\/Singapore"
                            },
                            {
                                "t": "Srednekolymsk (GMT +11:00)",
                                "v": "Asia\/Srednekolymsk"
                            },
                            {
                                "t": "Taipei (GMT +08:00)",
                                "v": "Asia\/Taipei"
                            },
                            {
                                "t": "Tashkent (GMT +05:00)",
                                "v": "Asia\/Tashkent"
                            },
                            {
                                "t": "Tbilisi (GMT +04:00)",
                                "v": "Asia\/Tbilisi"
                            },
                            {
                                "t": "Tehran (GMT +03:00)",
                                "v": "Asia\/Tehran"
                            },
                            {
                                "t": "Thimphu (GMT +06:00)",
                                "v": "Asia\/Thimphu"
                            },
                            {
                                "t": "Tokyo (GMT +09:00)",
                                "v": "Asia\/Tokyo"
                            },
                            {
                                "t": "Tomsk (GMT +07:00)",
                                "v": "Asia\/Tomsk"
                            },
                            {
                                "t": "Ulaanbaatar (GMT +08:00)",
                                "v": "Asia\/Ulaanbaatar"
                            },
                            {
                                "t": "Urumqi (GMT +06:00)",
                                "v": "Asia\/Urumqi"
                            },
                            {
                                "t": "Ust-Nera (GMT +10:00)",
                                "v": "Asia\/Ust-Nera"
                            },
                            {
                                "t": "Vientiane (GMT +07:00)",
                                "v": "Asia\/Vientiane"
                            },
                            {
                                "t": "Vladivostok (GMT +10:00)",
                                "v": "Asia\/Vladivostok"
                            },
                            {
                                "t": "Yakutsk (GMT +09:00)",
                                "v": "Asia\/Yakutsk"
                            },
                            {
                                "t": "Yangon (GMT +06:00)",
                                "v": "Asia\/Yangon"
                            },
                            {
                                "t": "Yekaterinburg (GMT +05:00)",
                                "v": "Asia\/Yekaterinburg"
                            },
                            {
                                "t": "Yerevan (GMT +04:00)",
                                "v": "Asia\/Yerevan"
                            }
                        ],
                        "Atlantic": [
                            {
                                "t": "Azores (GMT -1:00)",
                                "v": "Atlantic\/Azores"
                            },
                            {
                                "t": "Bermuda (GMT -4:00)",
                                "v": "Atlantic\/Bermuda"
                            },
                            {
                                "t": "Canary (GMT +00:00)",
                                "v": "Atlantic\/Canary"
                            },
                            {
                                "t": "Cape_Verde (GMT -1:00)",
                                "v": "Atlantic\/Cape_Verde"
                            },
                            {
                                "t": "Faroe (GMT +00:00)",
                                "v": "Atlantic\/Faroe"
                            },
                            {
                                "t": "Madeira (GMT +00:00)",
                                "v": "Atlantic\/Madeira"
                            },
                            {
                                "t": "Reykjavik (GMT +00:00)",
                                "v": "Atlantic\/Reykjavik"
                            },
                            {
                                "t": "South_Georgia (GMT -2:00)",
                                "v": "Atlantic\/South_Georgia"
                            },
                            {
                                "t": "St_Helena (GMT +00:00)",
                                "v": "Atlantic\/St_Helena"
                            },
                            {
                                "t": "Stanley (GMT -3:00)",
                                "v": "Atlantic\/Stanley"
                            }
                        ],
                        "Australia": [
                            {
                                "t": "Adelaide (GMT +10:00)",
                                "v": "Australia\/Adelaide"
                            },
                            {
                                "t": "Brisbane (GMT +10:00)",
                                "v": "Australia\/Brisbane"
                            },
                            {
                                "t": "Broken_Hill (GMT +10:00)",
                                "v": "Australia\/Broken_Hill"
                            },
                            {
                                "t": "Currie (GMT +11:00)",
                                "v": "Australia\/Currie"
                            },
                            {
                                "t": "Darwin (GMT +09:00)",
                                "v": "Australia\/Darwin"
                            },
                            {
                                "t": "Eucla (GMT +08:00)",
                                "v": "Australia\/Eucla"
                            },
                            {
                                "t": "Hobart (GMT +11:00)",
                                "v": "Australia\/Hobart"
                            },
                            {
                                "t": "Lindeman (GMT +10:00)",
                                "v": "Australia\/Lindeman"
                            },
                            {
                                "t": "Lord_Howe (GMT +11:00)",
                                "v": "Australia\/Lord_Howe"
                            },
                            {
                                "t": "Melbourne (GMT +11:00)",
                                "v": "Australia\/Melbourne"
                            },
                            {
                                "t": "Perth (GMT +08:00)",
                                "v": "Australia\/Perth"
                            },
                            {
                                "t": "Sydney (GMT +11:00)",
                                "v": "Australia\/Sydney"
                            }
                        ],
                        "Europe": [
                            {
                                "t": "Amsterdam (GMT +01:00)",
                                "v": "Europe\/Amsterdam"
                            },
                            {
                                "t": "Andorra (GMT +01:00)",
                                "v": "Europe\/Andorra"
                            },
                            {
                                "t": "Astrakhan (GMT +04:00)",
                                "v": "Europe\/Astrakhan"
                            },
                            {
                                "t": "Athens (GMT +02:00)",
                                "v": "Europe\/Athens"
                            },
                            {
                                "t": "Belgrade (GMT +01:00)",
                                "v": "Europe\/Belgrade"
                            },
                            {
                                "t": "Berlin (GMT +01:00)",
                                "v": "Europe\/Berlin"
                            },
                            {
                                "t": "Bratislava (GMT +01:00)",
                                "v": "Europe\/Bratislava"
                            },
                            {
                                "t": "Brussels (GMT +01:00)",
                                "v": "Europe\/Brussels"
                            },
                            {
                                "t": "Bucharest (GMT +02:00)",
                                "v": "Europe\/Bucharest"
                            },
                            {
                                "t": "Budapest (GMT +01:00)",
                                "v": "Europe\/Budapest"
                            },
                            {
                                "t": "Busingen (GMT +01:00)",
                                "v": "Europe\/Busingen"
                            },
                            {
                                "t": "Chisinau (GMT +02:00)",
                                "v": "Europe\/Chisinau"
                            },
                            {
                                "t": "Copenhagen (GMT +01:00)",
                                "v": "Europe\/Copenhagen"
                            },
                            {
                                "t": "Dublin (GMT +00:00)",
                                "v": "Europe\/Dublin"
                            },
                            {
                                "t": "Gibraltar (GMT +01:00)",
                                "v": "Europe\/Gibraltar"
                            },
                            {
                                "t": "Guernsey (GMT +00:00)",
                                "v": "Europe\/Guernsey"
                            },
                            {
                                "t": "Helsinki (GMT +02:00)",
                                "v": "Europe\/Helsinki"
                            },
                            {
                                "t": "Isle_of_Man (GMT +00:00)",
                                "v": "Europe\/Isle_of_Man"
                            },
                            {
                                "t": "Istanbul (GMT +03:00)",
                                "v": "Europe\/Istanbul"
                            },
                            {
                                "t": "Jersey (GMT +00:00)",
                                "v": "Europe\/Jersey"
                            },
                            {
                                "t": "Kaliningrad (GMT +02:00)",
                                "v": "Europe\/Kaliningrad"
                            },
                            {
                                "t": "Kiev (GMT +02:00)",
                                "v": "Europe\/Kiev"
                            },
                            {
                                "t": "Kirov (GMT +03:00)",
                                "v": "Europe\/Kirov"
                            },
                            {
                                "t": "Lisbon (GMT +00:00)",
                                "v": "Europe\/Lisbon"
                            },
                            {
                                "t": "Ljubljana (GMT +01:00)",
                                "v": "Europe\/Ljubljana"
                            },
                            {
                                "t": "London (GMT +00:00)",
                                "v": "Europe\/London"
                            },
                            {
                                "t": "Luxembourg (GMT +01:00)",
                                "v": "Europe\/Luxembourg"
                            },
                            {
                                "t": "Madrid (GMT +01:00)",
                                "v": "Europe\/Madrid"
                            },
                            {
                                "t": "Malta (GMT +01:00)",
                                "v": "Europe\/Malta"
                            },
                            {
                                "t": "Mariehamn (GMT +02:00)",
                                "v": "Europe\/Mariehamn"
                            },
                            {
                                "t": "Minsk (GMT +03:00)",
                                "v": "Europe\/Minsk"
                            },
                            {
                                "t": "Monaco (GMT +01:00)",
                                "v": "Europe\/Monaco"
                            },
                            {
                                "t": "Moscow (GMT +03:00)",
                                "v": "Europe\/Moscow"
                            },
                            {
                                "t": "Oslo (GMT +01:00)",
                                "v": "Europe\/Oslo"
                            },
                            {
                                "t": "Paris (GMT +01:00)",
                                "v": "Europe\/Paris"
                            },
                            {
                                "t": "Podgorica (GMT +01:00)",
                                "v": "Europe\/Podgorica"
                            },
                            {
                                "t": "Prague (GMT +01:00)",
                                "v": "Europe\/Prague"
                            },
                            {
                                "t": "Riga (GMT +02:00)",
                                "v": "Europe\/Riga"
                            },
                            {
                                "t": "Rome (GMT +01:00)",
                                "v": "Europe\/Rome"
                            },
                            {
                                "t": "Samara (GMT +04:00)",
                                "v": "Europe\/Samara"
                            },
                            {
                                "t": "San_Marino (GMT +01:00)",
                                "v": "Europe\/San_Marino"
                            },
                            {
                                "t": "Sarajevo (GMT +01:00)",
                                "v": "Europe\/Sarajevo"
                            },
                            {
                                "t": "Saratov (GMT +04:00)",
                                "v": "Europe\/Saratov"
                            },
                            {
                                "t": "Simferopol (GMT +03:00)",
                                "v": "Europe\/Simferopol"
                            },
                            {
                                "t": "Skopje (GMT +01:00)",
                                "v": "Europe\/Skopje"
                            },
                            {
                                "t": "Sofia (GMT +02:00)",
                                "v": "Europe\/Sofia"
                            },
                            {
                                "t": "Stockholm (GMT +01:00)",
                                "v": "Europe\/Stockholm"
                            },
                            {
                                "t": "Tallinn (GMT +02:00)",
                                "v": "Europe\/Tallinn"
                            },
                            {
                                "t": "Tirane (GMT +01:00)",
                                "v": "Europe\/Tirane"
                            },
                            {
                                "t": "Ulyanovsk (GMT +04:00)",
                                "v": "Europe\/Ulyanovsk"
                            },
                            {
                                "t": "Uzhgorod (GMT +02:00)",
                                "v": "Europe\/Uzhgorod"
                            },
                            {
                                "t": "Vaduz (GMT +01:00)",
                                "v": "Europe\/Vaduz"
                            },
                            {
                                "t": "Vatican (GMT +01:00)",
                                "v": "Europe\/Vatican"
                            },
                            {
                                "t": "Vienna (GMT +01:00)",
                                "v": "Europe\/Vienna"
                            },
                            {
                                "t": "Vilnius (GMT +02:00)",
                                "v": "Europe\/Vilnius"
                            },
                            {
                                "t": "Volgograd (GMT +04:00)",
                                "v": "Europe\/Volgograd"
                            },
                            {
                                "t": "Warsaw (GMT +01:00)",
                                "v": "Europe\/Warsaw"
                            },
                            {
                                "t": "Zagreb (GMT +01:00)",
                                "v": "Europe\/Zagreb"
                            },
                            {
                                "t": "Zaporozhye (GMT +02:00)",
                                "v": "Europe\/Zaporozhye"
                            },
                            {
                                "t": "Zurich (GMT +01:00)",
                                "v": "Europe\/Zurich"
                            }
                        ],
                        "Indian": [
                            {
                                "t": "Antananarivo (GMT +03:00)",
                                "v": "Indian\/Antananarivo"
                            },
                            {
                                "t": "Chagos (GMT +06:00)",
                                "v": "Indian\/Chagos"
                            },
                            {
                                "t": "Christmas (GMT +07:00)",
                                "v": "Indian\/Christmas"
                            },
                            {
                                "t": "Cocos (GMT +06:00)",
                                "v": "Indian\/Cocos"
                            },
                            {
                                "t": "Comoro (GMT +03:00)",
                                "v": "Indian\/Comoro"
                            },
                            {
                                "t": "Kerguelen (GMT +05:00)",
                                "v": "Indian\/Kerguelen"
                            },
                            {
                                "t": "Mahe (GMT +04:00)",
                                "v": "Indian\/Mahe"
                            },
                            {
                                "t": "Maldives (GMT +05:00)",
                                "v": "Indian\/Maldives"
                            },
                            {
                                "t": "Mauritius (GMT +04:00)",
                                "v": "Indian\/Mauritius"
                            },
                            {
                                "t": "Mayotte (GMT +03:00)",
                                "v": "Indian\/Mayotte"
                            },
                            {
                                "t": "Reunion (GMT +04:00)",
                                "v": "Indian\/Reunion"
                            }
                        ],
                        "Pacific": [
                            {
                                "t": "Apia (GMT +14:00)",
                                "v": "Pacific\/Apia"
                            },
                            {
                                "t": "Auckland (GMT +13:00)",
                                "v": "Pacific\/Auckland"
                            },
                            {
                                "t": "Bougainville (GMT +11:00)",
                                "v": "Pacific\/Bougainville"
                            },
                            {
                                "t": "Chatham (GMT +13:00)",
                                "v": "Pacific\/Chatham"
                            },
                            {
                                "t": "Chuuk (GMT +10:00)",
                                "v": "Pacific\/Chuuk"
                            },
                            {
                                "t": "Easter (GMT -5:00)",
                                "v": "Pacific\/Easter"
                            },
                            {
                                "t": "Efate (GMT +11:00)",
                                "v": "Pacific\/Efate"
                            },
                            {
                                "t": "Enderbury (GMT +13:00)",
                                "v": "Pacific\/Enderbury"
                            },
                            {
                                "t": "Fakaofo (GMT +13:00)",
                                "v": "Pacific\/Fakaofo"
                            },
                            {
                                "t": "Fiji (GMT +12:00)",
                                "v": "Pacific\/Fiji"
                            },
                            {
                                "t": "Funafuti (GMT +12:00)",
                                "v": "Pacific\/Funafuti"
                            },
                            {
                                "t": "Galapagos (GMT -6:00)",
                                "v": "Pacific\/Galapagos"
                            },
                            {
                                "t": "Gambier (GMT -9:00)",
                                "v": "Pacific\/Gambier"
                            },
                            {
                                "t": "Guadalcanal (GMT +11:00)",
                                "v": "Pacific\/Guadalcanal"
                            },
                            {
                                "t": "Guam (GMT +10:00)",
                                "v": "Pacific\/Guam"
                            },
                            {
                                "t": "Honolulu (GMT -10:00)",
                                "v": "Pacific\/Honolulu"
                            },
                            {
                                "t": "Kiritimati (GMT +14:00)",
                                "v": "Pacific\/Kiritimati"
                            },
                            {
                                "t": "Kosrae (GMT +11:00)",
                                "v": "Pacific\/Kosrae"
                            },
                            {
                                "t": "Kwajalein (GMT +12:00)",
                                "v": "Pacific\/Kwajalein"
                            },
                            {
                                "t": "Majuro (GMT +12:00)",
                                "v": "Pacific\/Majuro"
                            },
                            {
                                "t": "Marquesas (GMT -9:00)",
                                "v": "Pacific\/Marquesas"
                            },
                            {
                                "t": "Midway (GMT -11:00)",
                                "v": "Pacific\/Midway"
                            },
                            {
                                "t": "Nauru (GMT +12:00)",
                                "v": "Pacific\/Nauru"
                            },
                            {
                                "t": "Niue (GMT -11:00)",
                                "v": "Pacific\/Niue"
                            },
                            {
                                "t": "Norfolk (GMT +12:00)",
                                "v": "Pacific\/Norfolk"
                            },
                            {
                                "t": "Noumea (GMT +11:00)",
                                "v": "Pacific\/Noumea"
                            },
                            {
                                "t": "Pago_Pago (GMT -11:00)",
                                "v": "Pacific\/Pago_Pago"
                            },
                            {
                                "t": "Palau (GMT +09:00)",
                                "v": "Pacific\/Palau"
                            },
                            {
                                "t": "Pitcairn (GMT -8:00)",
                                "v": "Pacific\/Pitcairn"
                            },
                            {
                                "t": "Pohnpei (GMT +11:00)",
                                "v": "Pacific\/Pohnpei"
                            },
                            {
                                "t": "Port_Moresby (GMT +10:00)",
                                "v": "Pacific\/Port_Moresby"
                            },
                            {
                                "t": "Rarotonga (GMT -10:00)",
                                "v": "Pacific\/Rarotonga"
                            },
                            {
                                "t": "Saipan (GMT +10:00)",
                                "v": "Pacific\/Saipan"
                            },
                            {
                                "t": "Tahiti (GMT -10:00)",
                                "v": "Pacific\/Tahiti"
                            },
                            {
                                "t": "Tarawa (GMT +12:00)",
                                "v": "Pacific\/Tarawa"
                            },
                            {
                                "t": "Tongatapu (GMT +13:00)",
                                "v": "Pacific\/Tongatapu"
                            },
                            {
                                "t": "Wake (GMT +12:00)",
                                "v": "Pacific\/Wake"
                            },
                            {
                                "t": "Wallis (GMT +12:00)",
                                "v": "Pacific\/Wallis"
                            }
                        ]
                    }
                },
            }
        },

        methods: {

            dialogCreate(open) {
                this.dialog.create = open
            },

            dialogCode(id) {
                id !== undefined && (this.codeWid = id) && (this.dialog.code = true)
            },

            submitWebsite() {
                if (this.pendingCreate || !this.$refs.formWebsiteCreate.validate()) return

                let data = {
                    name: this.form.create.data.name,
                    url: this.form.create.data.url,
                    timezone: this.form.create.data.tz,
                }

                this.$store.dispatch('website/createWebsite', data).then(res => {
                    this.dialogCreate(false)
                    this.dialogCode(res.data.id)
                }).catch(e => this.$error(e))
            },

            deleteWebsite(id, event) {
                this.$store.dispatch('website/deleteWebsite', id).then(res => {
                    event.done()
                })
            }

        }

    }
</script>
