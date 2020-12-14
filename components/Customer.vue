<template>
    <div>
        <InputLabel :required="true">Name or Organization</InputLabel>
        <v-text-field solo flat
                      background-color="grey lighten-3"
                      hide-details="auto"
                      :rules="rules.name"
                      v-model="data.name"
        ></v-text-field>

        <InputLabel :required="true">Address</InputLabel>
        <v-text-field solo flat
                      placeholder="e.g. street, PO Box, or company name"
                      background-color="grey lighten-3"
                      hide-details="auto"
                      :rules="rules.line1"
                      v-model="data.line1"
        ></v-text-field>

        <v-row>
            <v-col class="py-0">
                <InputLabel :required="true">City</InputLabel>
                <v-text-field solo flat
                              background-color="grey lighten-3"
                              hide-details="auto"
                              :rules="rules.city"
                              v-model="data.city"
                ></v-text-field>
            </v-col>
            <v-col cols="4" class="py-0">
                <InputLabel :required="true">Postal Code / ZIP</InputLabel>
                <v-text-field solo flat
                              background-color="grey lighten-3"
                              hide-details="auto"
                              :rules="rules.postalCode"
                              v-model="data.postalCode"
                ></v-text-field>
            </v-col>
        </v-row>

        <InputLabel :required="true">Country</InputLabel>
        <v-select solo flat
                  hide-details="auto"
                  background-color="grey lighten-3"
                  item-text="country" item-value="abbr"
                  placeholder="Select a country"
                  :rules="rules.country"
                  v-model="data.country"
                  :items="countries"
        ></v-select>

        <template v-if="data.country==='US'">
            <InputLabel :required="true">State</InputLabel>
            <v-select solo flat
                      hide-details="auto"
                      background-color="grey lighten-3"
                      item-text="state" item-value="abbr"
                      placeholder="Select a state"
                      :rules="rules.state"
                      v-model="data.state"
                      :items="countries"
            ></v-select>
        </template>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import InputLabel from "./InputLabel";

    export default {

        components: {
            InputLabel
        },

        props: ['data',],

        mounted() {
            if (this.customer) {
                this.data.name = this.customer.name
                if(this.customer.address) {
                    this.data.line1 = this.customer.address.line1
                    this.data.city = this.customer.address.city
                    this.data.postalCode = this.customer.address.postal_code
                    this.data.country = this.customer.address.country
                    this.data.state = this.customer.address.state
                }
            }
        },

        data() {
            return {
                rules: {
                    name: [
                        v => v && v.length > 0 || 'Please enter a name'
                    ],
                    city: [
                        v => v && v.length > 0 || 'Please enter a city'
                    ],
                    postalCode: [
                        v => v && v.length > 0 || 'Please enter a code/zip',
                    ],
                    line1: [
                        v => v && v.length > 0 || 'Please enter an address'
                    ],
                    country: [
                        v => v && v.length > 0 || 'Please select a country'
                    ],
                    state: [
                        v => v && v.length > 0 || 'Please select a state'
                    ],
                },
                countries: [
                    {abbr: "US", country: "United States of America"},
                    {abbr: "DE", country: "Germany"},
                    {abbr: "FR", country: "France"},
                    {abbr: "ES", country: "Spain"},
                    {abbr: "GB", country: "United Kingdom"},
                    {abbr: "AD", country: "Andorra"},
                    {abbr: "AE", country: "United Arab Emirates"},
                    {abbr: "AF", country: "Afghanistan"},
                    {abbr: "AG", country: "Antigua and Barbuda"},
                    {abbr: "AI", country: "Anguilla"},
                    {abbr: "AL", country: "Albania"},
                    {abbr: "AM", country: "Armenia"},
                    {abbr: "AO", country: "Angola"},
                    {abbr: "AQ", country: "Antarctica"},
                    {abbr: "AR", country: "Argentina"},
                    {abbr: "AS", country: "American Samoa"},
                    {abbr: "AT", country: "Austria"},
                    {abbr: "AU", country: "Australia"},
                    {abbr: "AW", country: "Aruba"},
                    {abbr: "AX", country: "Åland Islands"},
                    {abbr: "AZ", country: "Azerbaijan"},
                    {abbr: "BA", country: "Bosnia and Herzegovina"},
                    {abbr: "BB", country: "Barbados"},
                    {abbr: "BD", country: "Bangladesh"},
                    {abbr: "BE", country: "Belgium"},
                    {abbr: "BF", country: "Burkina Faso"},
                    {abbr: "BG", country: "Bulgaria"},
                    {abbr: "BH", country: "Bahrain"},
                    {abbr: "BI", country: "Burundi"},
                    {abbr: "BJ", country: "Benin"},
                    {abbr: "BL", country: "Saint Barthélemy"},
                    {abbr: "BM", country: "Bermuda"},
                    {abbr: "BN", country: "Brunei Darussalam"},
                    {abbr: "BO", country: "Bolivia (Plurinational State of)"},
                    {abbr: "BQ", country: "Bonaire, Sint Eustatius and Saba"},
                    {abbr: "BR", country: "Brazil"},
                    {abbr: "BS", country: "Bahamas"},
                    {abbr: "BT", country: "Bhutan"},
                    {abbr: "BV", country: "Bouvet Island"},
                    {abbr: "BW", country: "Botswana"},
                    {abbr: "BY", country: "Belarus"},
                    {abbr: "BZ", country: "Belize"},
                    {abbr: "CA", country: "Canada"},
                    {abbr: "CC", country: "Cocos (Keeling) Islands"},
                    {abbr: "CD", country: "Congo, Democratic Republic of the"},
                    {abbr: "CF", country: "Central African Republic"},
                    {abbr: "CG", country: "Congo"},
                    {abbr: "CH", country: "Switzerland"},
                    {abbr: "CI", country: "Côte d'Ivoire"},
                    {abbr: "CK", country: "Cook Islands"},
                    {abbr: "CL", country: "Chile"},
                    {abbr: "CM", country: "Cameroon"},
                    {abbr: "CN", country: "China"},
                    {abbr: "CO", country: "Colombia"},
                    {abbr: "CR", country: "Costa Rica"},
                    {abbr: "CU", country: "Cuba"},
                    {abbr: "CV", country: "Cabo Verde"},
                    {abbr: "CW", country: "Curaçao"},
                    {abbr: "CX", country: "Christmas Island"},
                    {abbr: "CY", country: "Cyprus"},
                    {abbr: "CZ", country: "Czechia"},
                    {abbr: "DJ", country: "Djibouti"},
                    {abbr: "DK", country: "Denmark"},
                    {abbr: "DM", country: "Dominica"},
                    {abbr: "DO", country: "Dominican Republic"},
                    {abbr: "DZ", country: "Algeria"},
                    {abbr: "EC", country: "Ecuador"},
                    {abbr: "EE", country: "Estonia"},
                    {abbr: "EG", country: "Egypt"},
                    {abbr: "EH", country: "Western Sahara"},
                    {abbr: "ER", country: "Eritrea"},
                    {abbr: "ET", country: "Ethiopia"},
                    {abbr: "FI", country: "Finland"},
                    {abbr: "FJ", country: "Fiji"},
                    {abbr: "FK", country: "Falkland Islands (Malvinas)"},
                    {abbr: "FM", country: "Micronesia (Federated States of)"},
                    {abbr: "FO", country: "Faroe Islands"},
                    {abbr: "GA", country: "Gabon"},
                    {abbr: "GD", country: "Grenada"},
                    {abbr: "GE", country: "Georgia"},
                    {abbr: "GF", country: "French Guiana"},
                    {abbr: "GG", country: "Guernsey"},
                    {abbr: "GH", country: "Ghana"},
                    {abbr: "GI", country: "Gibraltar"},
                    {abbr: "GL", country: "Greenland"},
                    {abbr: "GM", country: "Gambia"},
                    {abbr: "GN", country: "Guinea"},
                    {abbr: "GP", country: "Guadeloupe"},
                    {abbr: "GQ", country: "Equatorial Guinea"},
                    {abbr: "GR", country: "Greece"},
                    {abbr: "GS", country: "South Georgia and the South Sandwich Islands"},
                    {abbr: "GT", country: "Guatemala"},
                    {abbr: "GU", country: "Guam"},
                    {abbr: "GW", country: "Guinea-Bissau"},
                    {abbr: "GY", country: "Guyana"},
                    {abbr: "HK", country: "Hong Kong"},
                    {abbr: "HM", country: "Heard Island and McDonald Islands"},
                    {abbr: "HN", country: "Honduras"},
                    {abbr: "HR", country: "Croatia"},
                    {abbr: "HT", country: "Haiti"},
                    {abbr: "HU", country: "Hungary"},
                    {abbr: "ID", country: "Indonesia"},
                    {abbr: "IE", country: "Ireland"},
                    {abbr: "IL", country: "Israel"},
                    {abbr: "IM", country: "Isle of Man"},
                    {abbr: "IN", country: "India"},
                    {abbr: "IO", country: "British Indian Ocean Territory"},
                    {abbr: "IQ", country: "Iraq"},
                    {abbr: "IR", country: "Iran (Islamic Republic of)"},
                    {abbr: "IS", country: "Iceland"},
                    {abbr: "IT", country: "Italy"},
                    {abbr: "JE", country: "Jersey"},
                    {abbr: "JM", country: "Jamaica"},
                    {abbr: "JO", country: "Jordan"},
                    {abbr: "JP", country: "Japan"},
                    {abbr: "KE", country: "Kenya"},
                    {abbr: "KG", country: "Kyrgyzstan"},
                    {abbr: "KH", country: "Cambodia"},
                    {abbr: "KI", country: "Kiribati"},
                    {abbr: "KM", country: "Comoros"},
                    {abbr: "KN", country: "Saint Kitts and Nevis"},
                    {abbr: "KP", country: "Korea (Democratic People's Republic of)"},
                    {abbr: "KR", country: "Korea, Republic of"},
                    {abbr: "KW", country: "Kuwait"},
                    {abbr: "KY", country: "Cayman Islands"},
                    {abbr: "KZ", country: "Kazakhstan"},
                    {abbr: "LA", country: "Lao People's Democratic Republic"},
                    {abbr: "LB", country: "Lebanon"},
                    {abbr: "LC", country: "Saint Lucia"},
                    {abbr: "LI", country: "Liechtenstein"},
                    {abbr: "LK", country: "Sri Lanka"},
                    {abbr: "LR", country: "Liberia"},
                    {abbr: "LS", country: "Lesotho"},
                    {abbr: "LT", country: "Lithuania"},
                    {abbr: "LU", country: "Luxembourg"},
                    {abbr: "LV", country: "Latvia"},
                    {abbr: "LY", country: "Libya"},
                    {abbr: "MA", country: "Morocco"},
                    {abbr: "MC", country: "Monaco"},
                    {abbr: "MD", country: "Moldova, Republic of"},
                    {abbr: "ME", country: "Montenegro"},
                    {abbr: "MF", country: "Saint Martin (French part)"},
                    {abbr: "MG", country: "Madagascar"},
                    {abbr: "MH", country: "Marshall Islands"},
                    {abbr: "MK", country: "North Macedonia"},
                    {abbr: "ML", country: "Mali"},
                    {abbr: "MM", country: "Myanmar"},
                    {abbr: "MN", country: "Mongolia"},
                    {abbr: "MO", country: "Macao"},
                    {abbr: "MP", country: "Northern Mariana Islands"},
                    {abbr: "MQ", country: "Martinique"},
                    {abbr: "MR", country: "Mauritania"},
                    {abbr: "MS", country: "Montserrat"},
                    {abbr: "MT", country: "Malta"},
                    {abbr: "MU", country: "Mauritius"},
                    {abbr: "MV", country: "Maldives"},
                    {abbr: "MW", country: "Malawi"},
                    {abbr: "MX", country: "Mexico"},
                    {abbr: "MY", country: "Malaysia"},
                    {abbr: "MZ", country: "Mozambique"},
                    {abbr: "NA", country: "Namibia"},
                    {abbr: "NC", country: "New Caledonia"},
                    {abbr: "NE", country: "Niger"},
                    {abbr: "NF", country: "Norfolk Island"},
                    {abbr: "NG", country: "Nigeria"},
                    {abbr: "NI", country: "Nicaragua"},
                    {abbr: "NL", country: "Netherlands"},
                    {abbr: "NO", country: "Norway"},
                    {abbr: "NP", country: "Nepal"},
                    {abbr: "NR", country: "Nauru"},
                    {abbr: "NU", country: "Niue"},
                    {abbr: "NZ", country: "New Zealand"},
                    {abbr: "OM", country: "Oman"},
                    {abbr: "PA", country: "Panama"},
                    {abbr: "PE", country: "Peru"},
                    {abbr: "PF", country: "French Polynesia"},
                    {abbr: "PG", country: "Papua New Guinea"},
                    {abbr: "PH", country: "Philippines"},
                    {abbr: "PK", country: "Pakistan"},
                    {abbr: "PL", country: "Poland"},
                    {abbr: "PM", country: "Saint Pierre and Miquelon"},
                    {abbr: "PN", country: "Pitcairn"},
                    {abbr: "PR", country: "Puerto Rico"},
                    {abbr: "PS", country: "Palestine, State of"},
                    {abbr: "PT", country: "Portugal"},
                    {abbr: "PW", country: "Palau"},
                    {abbr: "PY", country: "Paraguay"},
                    {abbr: "QA", country: "Qatar"},
                    {abbr: "RE", country: "Réunion"},
                    {abbr: "RO", country: "Romania"},
                    {abbr: "RS", country: "Serbia"},
                    {abbr: "RU", country: "Russian Federation"},
                    {abbr: "RW", country: "Rwanda"},
                    {abbr: "SA", country: "Saudi Arabia"},
                    {abbr: "SB", country: "Solomon Islands"},
                    {abbr: "SC", country: "Seychelles"},
                    {abbr: "SD", country: "Sudan"},
                    {abbr: "SE", country: "Sweden"},
                    {abbr: "SG", country: "Singapore"},
                    {abbr: "SH", country: "Saint Helena, Ascension and Tristan da Cunha"},
                    {abbr: "SI", country: "Slovenia"},
                    {abbr: "SJ", country: "Svalbard and Jan Mayen"},
                    {abbr: "SK", country: "Slovakia"},
                    {abbr: "SL", country: "Sierra Leone"},
                    {abbr: "SM", country: "San Marino"},
                    {abbr: "SN", country: "Senegal"},
                    {abbr: "SO", country: "Somalia"},
                    {abbr: "SR", country: "Suriname"},
                    {abbr: "SS", country: "South Sudan"},
                    {abbr: "ST", country: "Sao Tome and Principe"},
                    {abbr: "SV", country: "El Salvador"},
                    {abbr: "SX", country: "Sint Maarten (Dutch part)"},
                    {abbr: "SY", country: "Syrian Arab Republic"},
                    {abbr: "SZ", country: "Eswatini"},
                    {abbr: "TC", country: "Turks and Caicos Islands"},
                    {abbr: "TD", country: "Chad"},
                    {abbr: "TF", country: "French Southern Territories"},
                    {abbr: "TG", country: "Togo"},
                    {abbr: "TH", country: "Thailand"},
                    {abbr: "TJ", country: "Tajikistan"},
                    {abbr: "TK", country: "Tokelau"},
                    {abbr: "TL", country: "Timor-Leste"},
                    {abbr: "TM", country: "Turkmenistan"},
                    {abbr: "TN", country: "Tunisia"},
                    {abbr: "TO", country: "Tonga"},
                    {abbr: "TR", country: "Turkey"},
                    {abbr: "TT", country: "Trinidad and Tobago"},
                    {abbr: "TV", country: "Tuvalu"},
                    {abbr: "TW", country: "Taiwan, Province of China"},
                    {abbr: "TZ", country: "Tanzania, United Republic of"},
                    {abbr: "UA", country: "Ukraine"},
                    {abbr: "UG", country: "Uganda"},
                    {abbr: "UM", country: "United States Minor Outlying Islands"},
                    {abbr: "UY", country: "Uruguay"},
                    {abbr: "UZ", country: "Uzbekistan"},
                    {abbr: "VA", country: "Holy See"},
                    {abbr: "VC", country: "Saint Vincent and the Grenadines"},
                    {abbr: "VE", country: "Venezuela (Bolivarian Republic of)"},
                    {abbr: "VG", country: "Virgin Islands (British)"},
                    {abbr: "VI", country: "Virgin Islands (U.S.)"},
                    {abbr: "VN", country: "Viet Nam"},
                    {abbr: "VU", country: "Vanuatu"},
                    {abbr: "WF", country: "Wallis and Futuna"},
                    {abbr: "WS", country: "Samoa"},
                    {abbr: "YE", country: "Yemen"},
                    {abbr: "YT", country: "Mayotte"},
                    {abbr: "ZA", country: "South Africa"},
                    {abbr: "ZM", country: "Zambia"},
                    {abbr: "ZW", country: "Zimbabwe"},
                ],
            }
        },

        computed: {
            ...mapState({
                customer: state => state.stripe.customer,
                pending: state => state.pending.stripe.saveCustomer
            }),
        },

    }
</script>