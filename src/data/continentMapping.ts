// Maps ISO 3166-1 numeric country codes (as used in world-atlas TopoJSON) to continent IDs.
// Source: Natural Earth / world-atlas countries-110m.json uses numeric codes in "id" field.

const continentMapping: Record<string, string> = {
  // ===== ASIA =====
  "004": "asia", // Afghanistan
  "031": "asia", // Azerbaijan
  "048": "asia", // Bahrain
  "050": "asia", // Bangladesh
  "051": "asia", // Armenia
  "064": "asia", // Bhutan
  "096": "asia", // Brunei
  "104": "asia", // Myanmar
  "116": "asia", // Cambodia
  "144": "asia", // Sri Lanka
  "156": "asia", // China
  "158": "asia", // Taiwan
  "162": "asia", // Christmas Island
  "166": "asia", // Cocos Islands
  // Colombia: see South America section (170)
  "196": "asia", // Cyprus
  "268": "asia", // Georgia
  "275": "asia", // Palestine
  "356": "asia", // India
  "360": "asia", // Indonesia
  "364": "asia", // Iran
  "368": "asia", // Iraq
  "376": "asia", // Israel
  "392": "asia", // Japan
  "398": "asia", // Kazakhstan
  "400": "asia", // Jordan
  "408": "asia", // North Korea
  "410": "asia", // South Korea
  "414": "asia", // Kuwait
  "417": "asia", // Kyrgyzstan
  "418": "asia", // Laos
  "422": "asia", // Lebanon
  "458": "asia", // Malaysia
  "462": "asia", // Maldives
  "496": "asia", // Mongolia
  "512": "asia", // Oman
  "524": "asia", // Nepal
  "586": "asia", // Pakistan
  "608": "asia", // Philippines
  "626": "asia", // Timor-Leste
  "634": "asia", // Qatar
  // Russia: see Europe section (643)
  "682": "asia", // Saudi Arabia
  "702": "asia", // Singapore
  "704": "asia", // Vietnam
  "760": "asia", // Syria
  "762": "asia", // Tajikistan
  "764": "asia", // Thailand
  "784": "asia", // UAE
  "792": "asia", // Turkey
  "795": "asia", // Turkmenistan
  "860": "asia", // Uzbekistan
  "887": "asia", // Yemen

  // ===== AFRICA =====
  "012": "africa", // Algeria
  "024": "africa", // Angola
  "072": "africa", // Botswana
  "854": "africa", // Burkina Faso
  "108": "africa", // Burundi
  "120": "africa", // Cameroon
  "132": "africa", // Cape Verde
  "140": "africa", // Central African Republic
  "148": "africa", // Chad
  "174": "africa", // Comoros
  "178": "africa", // Congo
  "180": "africa", // DR Congo
  "204": "africa", // Benin
  "226": "africa", // Equatorial Guinea
  "231": "africa", // Ethiopia
  "232": "africa", // Eritrea
  "262": "africa", // Djibouti
  "266": "africa", // Gabon
  "270": "africa", // Gambia
  "288": "africa", // Ghana
  "324": "africa", // Guinea
  "384": "africa", // Ivory Coast
  "404": "africa", // Kenya
  "426": "africa", // Lesotho
  "430": "africa", // Liberia
  "434": "africa", // Libya
  "450": "africa", // Madagascar
  "454": "africa", // Malawi
  "466": "africa", // Mali
  "478": "africa", // Mauritania
  "480": "africa", // Mauritius
  "504": "africa", // Morocco
  "508": "africa", // Mozambique
  "516": "africa", // Namibia
  "562": "africa", // Niger
  "566": "africa", // Nigeria
  "624": "africa", // Guinea-Bissau
  "646": "africa", // Rwanda
  "686": "africa", // Senegal
  "694": "africa", // Sierra Leone
  "706": "africa", // Somalia
  "710": "africa", // South Africa
  "716": "africa", // Zimbabwe
  "728": "africa", // South Sudan
  "729": "africa", // Sudan
  "732": "africa", // Western Sahara
  "748": "africa", // Eswatini
  "768": "africa", // Togo
  "788": "africa", // Tunisia
  "800": "africa", // Uganda
  "818": "africa", // Egypt
  "834": "africa", // Tanzania
  "894": "africa", // Zambia

  // ===== EUROPE =====
  "008": "europe", // Albania
  "020": "europe", // Andorra
  "040": "europe", // Austria
  "056": "europe", // Belgium
  "070": "europe", // Bosnia and Herzegovina
  "100": "europe", // Bulgaria
  "112": "europe", // Belarus
  "191": "europe", // Croatia
  "203": "europe", // Czech Republic
  "208": "europe", // Denmark
  "233": "europe", // Estonia
  "234": "europe", // Faroe Islands
  "246": "europe", // Finland
  "250": "europe", // France
  "276": "europe", // Germany
  "292": "europe", // Gibraltar
  "300": "europe", // Greece
  "336": "europe", // Vatican City
  "348": "europe", // Hungary
  "352": "europe", // Iceland
  "372": "europe", // Ireland
  "380": "europe", // Italy
  "428": "europe", // Latvia
  "438": "europe", // Liechtenstein
  "440": "europe", // Lithuania
  "442": "europe", // Luxembourg
  "470": "europe", // Malta
  "498": "europe", // Moldova
  "492": "europe", // Monaco
  "499": "europe", // Montenegro
  "528": "europe", // Netherlands
  "578": "europe", // Norway
  "616": "europe", // Poland
  "620": "europe", // Portugal
  "642": "europe", // Romania
  "643": "europe", // Russia — override to Europe for this game
  "674": "europe", // San Marino
  "688": "europe", // Serbia
  "703": "europe", // Slovakia
  "705": "europe", // Slovenia
  "724": "europe", // Spain
  "752": "europe", // Sweden
  "756": "europe", // Switzerland
  "804": "europe", // Ukraine
  "807": "europe", // North Macedonia
  "826": "europe", // United Kingdom
  "-99": "europe", // Kosovo (sometimes -99 in TopoJSON)

  // ===== NORTH AMERICA =====
  "028": "north-america", // Antigua and Barbuda
  "044": "north-america", // Bahamas
  "052": "north-america", // Barbados
  "084": "north-america", // Belize
  "124": "north-america", // Canada
  "188": "north-america", // Costa Rica
  "192": "north-america", // Cuba
  "212": "north-america", // Dominica
  "214": "north-america", // Dominican Republic
  "222": "north-america", // El Salvador
  "304": "north-america", // Greenland
  "308": "north-america", // Grenada
  "320": "north-america", // Guatemala
  "332": "north-america", // Haiti
  "340": "north-america", // Honduras
  "388": "north-america", // Jamaica
  "484": "north-america", // Mexico
  "558": "north-america", // Nicaragua
  "591": "north-america", // Panama
  "630": "north-america", // Puerto Rico
  "659": "north-america", // Saint Kitts and Nevis
  "662": "north-america", // Saint Lucia
  "670": "north-america", // Saint Vincent
  "780": "north-america", // Trinidad and Tobago
  "840": "north-america", // United States

  // ===== SOUTH AMERICA =====
  "032": "south-america", // Argentina
  "068": "south-america", // Bolivia
  "076": "south-america", // Brazil
  "152": "south-america", // Chile
  "170": "south-america", // Colombia
  "218": "south-america", // Ecuador
  "238": "south-america", // Falkland Islands
  "254": "south-america", // French Guiana
  "328": "south-america", // Guyana
  "600": "south-america", // Paraguay
  "604": "south-america", // Peru
  "740": "south-america", // Suriname
  "858": "south-america", // Uruguay
  "862": "south-america", // Venezuela

  // ===== AUSTRALIA / OCEANIA =====
  "036": "australia", // Australia
  "090": "australia", // Solomon Islands
  "242": "australia", // Fiji
  "540": "australia", // New Caledonia
  "554": "australia", // New Zealand
  "598": "australia", // Papua New Guinea
  "548": "australia", // Vanuatu

  // ===== ANTARCTICA =====
  "010": "antarctica", // Antarctica
};

export function getContinentId(countryNumericCode: string): string {
  return continentMapping[countryNumericCode] || "asia";
}

export default continentMapping;
