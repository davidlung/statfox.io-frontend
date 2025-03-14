<template>
    <v-card outlined height="100%">
        <v-card-title class="pt-3 text-subtitle-2">{{$t('countries')}}</v-card-title>
        <v-skeleton-loader tile :loading="pending||!wid" type="text@10, actions">
            <v-data-table dense :headers="headers" :items="stats" :items-per-page="10" mobile-breakpoint="100"
                          :no-data-text="$t('vcomp.table.no_data')">
                <template v-slot:item.code="item">
                    {{countryName(item.value)}}
                </template>
            </v-data-table>
        </v-skeleton-loader>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'

    export default {

        computed: {
            ...mapState({
                wid: state => state.website.statistic.data.websiteId,
                statistic: state => state.website.statistic,
                pending: state => state.pending.website.loadStatistic
            }),

            stats() {
                return this.statistic.data.countries
            },

            countryName() {
                return code => {
                    if(this.countries[this.$i18n.locale]) {
                        return this.countries[this.$i18n.locale][code]||'-'
                    }
                    return this.countries['de'][code]||'-'
                }
            }
        },

        data() {
            return {
                headers: [
                    {text:this.$t('name'), value:'code', width: '90%'},
                    {text:this.$t('views'), value:'views'},
                    {text:this.$t('uniques'), value:'uniques'}
                ],
                countries: {
                    "de": {
                        "RW":"Ruanda",
                        "SO":"Somalia",
                        "YE":"Jemen",
                        "IQ":"Irak",
                        "SA":"Saudi-Arabien",
                        "IR":"Iran (Islamische Republik)",
                        "CY":"Zypern",
                        "TZ":"Tansania",
                        "SY":"Syrien",
                        "AM":"Armenien",
                        "KE":"Kenia",
                        "CD":"Kongo",
                        "DJ":"Dschibuti",
                        "UG":"Uganda",
                        "CF":"Zentralafrikanische Republik",
                        "SC":"Seychellen",
                        "JO":"Jordanien",
                        "LB":"Libanon",
                        "KW":"Kuwait",
                        "OM":"Oman",
                        "QA":"Katar",
                        "BH":"Bahrain",
                        "AE":"Vereinigte Arabische Emirate",
                        "IL":"Israel",
                        "TR":"Türkei",
                        "ET":"Äthiopien",
                        "ER":"Eritrea",
                        "EG":"Ägypten",
                        "SD":"Sudan",
                        "GR":"Griechenland",
                        "BI":"Burundi",
                        "EE":"Estland",
                        "LV":"Lettland",
                        "AZ":"Aserbaidschan",
                        "LT":"Litauen",
                        "SJ":"Svalbard und Jan Mayen",
                        "GE":"Georgien",
                        "MD":"Moldau (Republik Moldau)",
                        "BY":"Weißrussland",
                        "FI":"Finnland",
                        "AX":"Alandinseln",
                        "UA":"Ukraine",
                        "MK":"Nordmazedonien",
                        "HU":"Ungarn",
                        "BG":"Bulgarien",
                        "AL":"Albanien",
                        "PL":"Polen",
                        "RO":"Rumänien",
                        "XK":"Kosovo",
                        "ZW":"Simbabwe",
                        "ZM":"Sambia",
                        "KM":"Komoren",
                        "MW":"Malawi",
                        "LS":"Lesotho",
                        "BW":"Botswana",
                        "MU":"Mauritius",
                        "SZ":"Swasiland",
                        "RE":"Réunion",
                        "ZA":"Südafrika",
                        "YT":"Mayotte",
                        "MZ":"Mosambik",
                        "MG":"Madagaskar",
                        "AF":"Afghanistan",
                        "PK":"Pakistan",
                        "BD":"Bangladesch",
                        "TM":"Turkmenistan",
                        "TJ":"Tadschikistan",
                        "LK":"Sri Lanka",
                        "BT":"Bhutan",
                        "IN":"Indien",
                        "MV":"Malediven",
                        "IO":"Britisches Territorium im Indi",
                        "NP":"Nepal",
                        "MM":"Birma (Myanmar)",
                        "UZ":"Usbekistan",
                        "KZ":"Kasachstan",
                        "KG":"Kirgistan",
                        "TF":"Französische Süd- und Antarkti",
                        "HM":"Heard- und McDonald-Inseln",
                        "CC":"Kokosinseln",
                        "PW":"Palau",
                        "VN":"Vietnam",
                        "TH":"Thailand",
                        "ID":"Indonesien",
                        "LA":"Laos",
                        "TW":"Taiwan",
                        "PH":"Philippinen",
                        "MY":"Malaysia",
                        "CN":"China",
                        "HK":"Hongkong",
                        "BN":"Brunei",
                        "MO":"Macau",
                        "KH":"Kambodscha",
                        "KR":"Südkorea",
                        "JP":"Japan",
                        "KP":"Nordkorea",
                        "SG":"Singapur",
                        "CK":"Cookinseln",
                        "TL":"Timor-Leste",
                        "RU":"Russland",
                        "MN":"Mongolei",
                        "AU":"Australien",
                        "CX":"Weihnachtsinsel",
                        "MH":"Marshall-Inseln",
                        "FM":"Mikronesien",
                        "PG":"Papua-Neuguinea",
                        "SB":"Solomon-Inseln",
                        "TV":"Tuwalu",
                        "NR":"Nauru",
                        "VU":"Vanuatu",
                        "NC":"Neukaledonien",
                        "NF":"Norfolkinsel",
                        "NZ":"Neuseeland",
                        "FJ":"Fidschi",
                        "LY":"Libysch-Arabische Dschamahirij",
                        "CM":"Kamerun",
                        "SN":"Senegal",
                        "CG":"Kongo (Republik Kongo)",
                        "PT":"Portugal",
                        "LR":"Liberia",
                        "CI":"Elfenbeinküste",
                        "GH":"Ghana",
                        "GQ":"Äquatorialguinea",
                        "NG":"Nigeria",
                        "BF":"Burkina Faso",
                        "TG":"Togo",
                        "GW":"Guinea-Bissau",
                        "MR":"Mauretanien",
                        "BJ":"Benin",
                        "GA":"Gabun",
                        "SL":"Sierra Leone",
                        "ST":"Sao Tomé und Principe",
                        "GI":"Gibraltar",
                        "GM":"Gambia",
                        "GN":"Guinea",
                        "TD":"Tschad",
                        "NE":"Niger",
                        "ML":"Mali",
                        "EH":"Westsahara",
                        "TN":"Tunesien",
                        "ES":"Spanien",
                        "MA":"Marokko",
                        "MT":"Malta",
                        "DZ":"Algerien",
                        "FO":"Färöer-Inseln",
                        "DK":"Dänemark",
                        "IS":"Island",
                        "GB":"Vereinigtes Königreich",
                        "CH":"Schweiz",
                        "SE":"Schweden",
                        "NL":"Niederlande",
                        "AT":"Österreich",
                        "BE":"Belgien",
                        "DE":"Deutschland",
                        "LU":"Luxemburg",
                        "IE":"Irland",
                        "MC":"Monaco",
                        "FR":"Frankreich",
                        "AD":"Andorra",
                        "LI":"Liechtenstein",
                        "JE":"Jersey",
                        "IM":"Isle of Man",
                        "GG":"Guernsey",
                        "SK":"Slowakei (Slowakische Republik",
                        "CZ":"Tschechien",
                        "NO":"Norwegen",
                        "VA":"Staat der Vatikanstadt",
                        "SM":"San Marino",
                        "IT":"Italien",
                        "SI":"Slowenien",
                        "ME":"Montenegro",
                        "HR":"Kroatien",
                        "BA":"Bosnien und Herzegowina",
                        "AO":"Angola",
                        "NA":"Namibia",
                        "SH":"St. Helena",
                        "BV":"Bouvetinsel",
                        "BB":"Barbados",
                        "CV":"Kapverden",
                        "GY":"Guyana",
                        "GF":"Französisch-Guayana",
                        "SR":"Suriname",
                        "PM":"St. Pierre und Miquelon",
                        "GL":"Grönland",
                        "PY":"Paraguay",
                        "UY":"Uruguay",
                        "BR":"Brasilien",
                        "FK":"Falklandinseln",
                        "GS":"Südgeorgien und die Südlichen ",
                        "JM":"Jamaika",
                        "DO":"Dom. Republik",
                        "CU":"Kuba",
                        "MQ":"Martinique",
                        "BS":"Bahamas",
                        "BM":"Bermuda",
                        "AI":"Anguilla",
                        "TT":"Trinidad und Tobago",
                        "KN":"Saint Kitts und Nevis",
                        "DM":"Dominica",
                        "AG":"Antigua und Barbuda",
                        "LC":"St. Lucia",
                        "TC":"Turks- und Caicosinseln",
                        "AW":"Aruba",
                        "VG":"Britische Jungferninseln",
                        "VC":"St. Vincent und die Grenadinen",
                        "MS":"Montserrat",
                        "MF":"St. Martin",
                        "BL":"St. Barthélemy",
                        "GP":"Guadeloupe",
                        "GD":"Grenada",
                        "KY":"Kaimaninseln",
                        "BZ":"Belize",
                        "SV":"El Salvador",
                        "GT":"Guatemala",
                        "HN":"Honduras",
                        "NI":"Nikaragua",
                        "CR":"Costa Rica",
                        "VE":"Venezuela",
                        "EC":"Ecuador",
                        "CO":"Kolumbien",
                        "PA":"Panama",
                        "HT":"Haiti",
                        "AR":"Argentinien",
                        "CL":"Chile",
                        "BO":"Bolivien",
                        "PE":"Peru",
                        "MX":"Mexiko",
                        "PF":"Französisch-Polynesien",
                        "PN":"Pitcairn",
                        "KI":"Kiribati",
                        "TK":"Tokelau",
                        "TO":"Tonga",
                        "WF":"Wallis und Futuna",
                        "WS":"Samoa",
                        "NU":"Niue",
                        "MP":"Nördliche Marianen",
                        "GU":"Guam",
                        "PR":"Puerto Rico",
                        "VI":"Amerikanische Jungferninseln",
                        "UM":"Amerikanisch-Ozeanien",
                        "AS":"Amerikanisch-Samoa",
                        "CA":"Kanada",
                        "US":"USA",
                        "PS":"Palästinensische Autonomiegebi",
                        "RS":"Serbien",
                        "AQ":"Antarktis",
                        "SX":"Sint Maarten",
                        "CW":"Curaçao",
                        "BQ":"Bonaire",
                        "SS":"Südsudan",
                    },
                    "en": {
                        "RW":"Rwanda",
                        "SO":"Somalia",
                        "YE":"Yemen",
                        "IQ":"Iraq",
                        "SA":"Saudi Arabia",
                        "IR":"Iran",
                        "CY":"Cyprus",
                        "TZ":"Tanzania",
                        "SY":"Syria",
                        "AM":"Armenia",
                        "KE":"Kenya",
                        "CD":"DR Congo",
                        "DJ":"Djibouti",
                        "UG":"Uganda",
                        "CF":"Central African Republic",
                        "SC":"Seychelles",
                        "JO":"Hashemite Kingdom of Jordan",
                        "LB":"Lebanon",
                        "KW":"Kuwait",
                        "OM":"Oman",
                        "QA":"Qatar",
                        "BH":"Bahrain",
                        "AE":"United Arab Emirates",
                        "IL":"Israel",
                        "TR":"Turkey",
                        "ET":"Ethiopia",
                        "ER":"Eritrea",
                        "EG":"Egypt",
                        "SD":"Sudan",
                        "GR":"Greece",
                        "BI":"Burundi",
                        "EE":"Estonia",
                        "LV":"Latvia",
                        "AZ":"Azerbaijan",
                        "LT":"Republic of Lithuania",
                        "SJ":"Svalbard and Jan Mayen",
                        "GE":"Georgia",
                        "MD":"Republic of Moldova",
                        "BY":"Belarus",
                        "FI":"Finland",
                        "AX":"Åland",
                        "UA":"Ukraine",
                        "MK":"North Macedonia",
                        "HU":"Hungary",
                        "BG":"Bulgaria",
                        "AL":"Albania",
                        "PL":"Poland",
                        "RO":"Romania",
                        "XK":"Kosovo",
                        "ZW":"Zimbabwe",
                        "ZM":"Zambia",
                        "KM":"Comoros",
                        "MW":"Malawi",
                        "LS":"Lesotho",
                        "BW":"Botswana",
                        "MU":"Mauritius",
                        "SZ":"Eswatini",
                        "RE":"Réunion",
                        "ZA":"South Africa",
                        "YT":"Mayotte",
                        "MZ":"Mozambique",
                        "MG":"Madagascar",
                        "AF":"Afghanistan",
                        "PK":"Pakistan",
                        "BD":"Bangladesh",
                        "TM":"Turkmenistan",
                        "TJ":"Tajikistan",
                        "LK":"Sri Lanka",
                        "BT":"Bhutan",
                        "IN":"India",
                        "MV":"Maldives",
                        "IO":"British Indian Ocean Territory",
                        "NP":"Nepal",
                        "MM":"Myanmar",
                        "UZ":"Uzbekistan",
                        "KZ":"Kazakhstan",
                        "KG":"Kyrgyzstan",
                        "TF":"French Southern Territories",
                        "HM":"Heard Island and McDonald Isla",
                        "CC":"Cocos [Keeling] Islands",
                        "PW":"Palau",
                        "VN":"Vietnam",
                        "TH":"Thailand",
                        "ID":"Indonesia",
                        "LA":"Laos",
                        "TW":"Taiwan",
                        "PH":"Philippines",
                        "MY":"Malaysia",
                        "CN":"China",
                        "HK":"Hong Kong",
                        "BN":"Brunei",
                        "MO":"Macao",
                        "KH":"Cambodia",
                        "KR":"South Korea",
                        "JP":"Japan",
                        "KP":"North Korea",
                        "SG":"Singapore",
                        "CK":"Cook Islands",
                        "TL":"East Timor",
                        "RU":"Russia",
                        "MN":"Mongolia",
                        "AU":"Australia",
                        "CX":"Christmas Island",
                        "MH":"Marshall Islands",
                        "FM":"Federated States of Micronesia",
                        "PG":"Papua New Guinea",
                        "SB":"Solomon Islands",
                        "TV":"Tuvalu",
                        "NR":"Nauru",
                        "VU":"Vanuatu",
                        "NC":"New Caledonia",
                        "NF":"Norfolk Island",
                        "NZ":"New Zealand",
                        "FJ":"Fiji",
                        "LY":"Libya",
                        "CM":"Cameroon",
                        "SN":"Senegal",
                        "CG":"Congo Republic",
                        "PT":"Portugal",
                        "LR":"Liberia",
                        "CI":"Ivory Coast",
                        "GH":"Ghana",
                        "GQ":"Equatorial Guinea",
                        "NG":"Nigeria",
                        "BF":"Burkina Faso",
                        "TG":"Togo",
                        "GW":"Guinea-Bissau",
                        "MR":"Mauritania",
                        "BJ":"Benin",
                        "GA":"Gabon",
                        "SL":"Sierra Leone",
                        "ST":"São Tomé and Príncipe",
                        "GI":"Gibraltar",
                        "GM":"Gambia",
                        "GN":"Guinea",
                        "TD":"Chad",
                        "NE":"Niger",
                        "ML":"Mali",
                        "EH":"Western Sahara",
                        "TN":"Tunisia",
                        "ES":"Spain",
                        "MA":"Morocco",
                        "MT":"Malta",
                        "DZ":"Algeria",
                        "FO":"Faroe Islands",
                        "DK":"Denmark",
                        "IS":"Iceland",
                        "GB":"United Kingdom",
                        "CH":"Switzerland",
                        "SE":"Sweden",
                        "NL":"Netherlands",
                        "AT":"Austria",
                        "BE":"Belgium",
                        "DE":"Germany",
                        "LU":"Luxembourg",
                        "IE":"Ireland",
                        "MC":"Monaco",
                        "FR":"France",
                        "AD":"Andorra",
                        "LI":"Liechtenstein",
                        "JE":"Jersey",
                        "IM":"Isle of Man",
                        "GG":"Guernsey",
                        "SK":"Slovakia",
                        "CZ":"Czechia",
                        "NO":"Norway",
                        "VA":"Vatican City",
                        "SM":"San Marino",
                        "IT":"Italy",
                        "SI":"Slovenia",
                        "ME":"Montenegro",
                        "HR":"Croatia",
                        "BA":"Bosnia and Herzegovina",
                        "AO":"Angola",
                        "NA":"Namibia",
                        "SH":"Saint Helena",
                        "BV":"Bouvet Island",
                        "BB":"Barbados",
                        "CV":"Cabo Verde",
                        "GY":"Guyana",
                        "GF":"French Guiana",
                        "SR":"Suriname",
                        "PM":"Saint Pierre and Miquelon",
                        "GL":"Greenland",
                        "PY":"Paraguay",
                        "UY":"Uruguay",
                        "BR":"Brazil",
                        "FK":"Falkland Islands",
                        "GS":"South Georgia and the South Sa",
                        "JM":"Jamaica",
                        "DO":"Dominican Republic",
                        "CU":"Cuba",
                        "MQ":"Martinique",
                        "BS":"Bahamas",
                        "BM":"Bermuda",
                        "AI":"Anguilla",
                        "TT":"Trinidad and Tobago",
                        "KN":"St Kitts and Nevis",
                        "DM":"Dominica",
                        "AG":"Antigua and Barbuda",
                        "LC":"Saint Lucia",
                        "TC":"Turks and Caicos Islands",
                        "AW":"Aruba",
                        "VG":"British Virgin Islands",
                        "VC":"Saint Vincent and the Grenadin",
                        "MS":"Montserrat",
                        "MF":"Saint Martin",
                        "BL":"Saint Barthélemy",
                        "GP":"Guadeloupe",
                        "GD":"Grenada",
                        "KY":"Cayman Islands",
                        "BZ":"Belize",
                        "SV":"El Salvador",
                        "GT":"Guatemala",
                        "HN":"Honduras",
                        "NI":"Nicaragua",
                        "CR":"Costa Rica",
                        "VE":"Venezuela",
                        "EC":"Ecuador",
                        "CO":"Colombia",
                        "PA":"Panama",
                        "HT":"Haiti",
                        "AR":"Argentina",
                        "CL":"Chile",
                        "BO":"Bolivia",
                        "PE":"Peru",
                        "MX":"Mexico",
                        "PF":"French Polynesia",
                        "PN":"Pitcairn Islands",
                        "KI":"Kiribati",
                        "TK":"Tokelau",
                        "TO":"Tonga",
                        "WF":"Wallis and Futuna",
                        "WS":"Samoa",
                        "NU":"Niue",
                        "MP":"Northern Mariana Islands",
                        "GU":"Guam",
                        "PR":"Puerto Rico",
                        "VI":"U.S. Virgin Islands",
                        "UM":"U.S. Minor Outlying Islands",
                        "AS":"American Samoa",
                        "CA":"Canada",
                        "US":"United States",
                        "PS":"Palestine",
                        "RS":"Serbia",
                        "AQ":"Antarctica",
                    },

                }
            }
        }

    }
</script>
