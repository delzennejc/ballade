// Country centroid coordinates [latitude, longitude]
// Keys match the French country names in geography.ts

export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  // Afrique du Nord
  'Algérie': [28.0339, 1.6596],
  'Égypte': [26.8206, 30.8025],
  'Libye': [26.3351, 17.2283],
  'Maroc': [31.7917, -7.0926],
  'Soudan': [12.8628, 30.2176],
  'Tunisie': [33.8869, 9.5375],
  'Sahara occidental': [24.2155, -12.8858],

  // Afrique de l'Ouest
  'Bénin': [9.3077, 2.3158],
  'Burkina Faso': [12.2383, -1.5616],
  'Cap-Vert': [16.5388, -23.0418],
  'Côte d\'Ivoire': [7.5400, -5.5471],
  'Gambie': [13.4432, -15.3101],
  'Ghana': [7.9465, -1.0232],
  'Guinée': [9.9456, -9.6966],
  'Guinée-Bissau': [11.8037, -15.1804],
  'Liberia': [6.4281, -9.4295],
  'Mali': [17.5707, -3.9962],
  'Mauritanie': [21.0079, -10.9408],
  'Niger': [17.6078, 8.0817],
  'Nigeria': [9.0820, 8.6753],
  'Sénégal': [14.4974, -14.4524],
  'Sierra Leone': [8.4606, -11.7799],
  'Togo': [8.6195, 0.8248],

  // Afrique de l'Est
  'Burundi': [-3.3731, 29.9189],
  'Comores': [-11.6455, 43.3333],
  'Djibouti': [11.8251, 42.5903],
  'Érythrée': [15.1794, 39.7823],
  'Éthiopie': [9.1450, 40.4897],
  'Kenya': [-0.0236, 37.9062],
  'Madagascar': [-18.7669, 46.8691],
  'Malawi': [-13.2543, 34.3015],
  'Maurice': [-20.3484, 57.5522],
  'Mozambique': [-18.6657, 35.5296],
  'Ouganda': [1.3733, 32.2903],
  'Rwanda': [-1.9403, 29.8739],
  'Seychelles': [-4.6796, 55.4920],
  'Somalie': [5.1521, 46.1996],
  'Soudan du Sud': [6.8770, 31.3070],
  'Tanzanie': [-6.3690, 34.8888],
  'Zambie': [-13.1339, 27.8493],
  'Zimbabwe': [-19.0154, 29.1549],

  // Afrique Centrale
  'Angola': [-11.2027, 17.8739],
  'Cameroun': [7.3697, 12.3547],
  'Centrafrique': [6.6111, 20.9394],
  'Congo': [-0.2280, 15.8277],
  'Gabon': [-0.8037, 11.6094],
  'Guinée équatoriale': [1.6508, 10.2679],
  'République démocratique du Congo': [-4.0383, 21.7587],
  'Sao Tomé-et-Príncipe': [0.1864, 6.6131],
  'Tchad': [15.4542, 18.7322],

  // Afrique Australe
  'Afrique du Sud': [-30.5595, 22.9375],
  'Botswana': [-22.3285, 24.6849],
  'Eswatini': [-26.5225, 31.4659],
  'Lesotho': [-29.6100, 28.2336],
  'Namibie': [-22.9576, 18.4904],

  // Amérique du Nord
  'Canada': [56.1304, -106.3468],
  'États-Unis': [37.0902, -95.7129],
  'Mexique': [23.6345, -102.5528],

  // Amérique Centrale
  'Belize': [17.1899, -88.4976],
  'Costa Rica': [9.7489, -83.7534],
  'Guatemala': [15.7835, -90.2308],
  'Honduras': [15.2000, -86.2419],
  'Nicaragua': [12.8654, -85.2072],
  'Panama': [8.5380, -80.7821],
  'Salvador': [13.7942, -88.8965],

  // Caraïbes
  'Antigua-et-Barbuda': [17.0608, -61.7964],
  'Bahamas': [25.0343, -77.3963],
  'Barbade': [13.1939, -59.5432],
  'Cuba': [21.5218, -77.7812],
  'Dominique': [15.4150, -61.3710],
  'Grenade': [12.1165, -61.6790],
  'Haïti': [18.9712, -72.2852],
  'Jamaïque': [18.1096, -77.2975],
  'Porto Rico': [18.2208, -66.5901],
  'République dominicaine': [18.7357, -70.1627],
  'Saint-Kitts-et-Nevis': [17.3578, -62.7830],
  'Saint-Vincent-et-les-Grenadines': [12.9843, -61.2872],
  'Sainte-Lucie': [13.9094, -60.9789],
  'Trinité-et-Tobago': [10.6918, -61.2225],

  // Amérique du Sud
  'Argentine': [-38.4161, -63.6167],
  'Bolivie': [-16.2902, -63.5887],
  'Brésil': [-14.2350, -51.9253],
  'Chili': [-35.6751, -71.5430],
  'Colombie': [4.5709, -74.2973],
  'Équateur': [-1.8312, -78.1834],
  'Guyana': [4.8604, -58.9302],
  'Paraguay': [-23.4425, -58.4438],
  'Pérou': [-9.1900, -75.0152],
  'Suriname': [3.9193, -56.0278],
  'Uruguay': [-32.5228, -55.7658],
  'Venezuela': [6.4238, -66.5897],

  // Asie de l'Ouest
  'Arabie saoudite': [23.8859, 45.0792],
  'Arménie': [40.0691, 45.0382],
  'Azerbaïdjan': [40.1431, 47.5769],
  'Bahreïn': [26.0667, 50.5577],
  'Chypre': [35.1264, 33.4299],
  'Émirats arabes unis': [23.4241, 53.8478],
  'Géorgie': [42.3154, 43.3569],
  'Irak': [33.2232, 43.6793],
  'Iran': [32.4279, 53.6880],
  'Israël': [31.0461, 34.8516],
  'Jordanie': [30.5852, 36.2384],
  'Koweït': [29.3117, 47.4818],
  'Liban': [33.8547, 35.8623],
  'Oman': [21.4735, 55.9754],
  'Palestine': [31.9522, 35.2332],
  'Qatar': [25.3548, 51.1839],
  'Syrie': [34.8021, 38.9968],
  'Turquie': [38.9637, 35.2433],
  'Yémen': [15.5527, 48.5164],

  // Asie Centrale
  'Kazakhstan': [48.0196, 66.9237],
  'Kirghizistan': [41.2044, 74.7661],
  'Ouzbékistan': [41.3775, 64.5853],
  'Tadjikistan': [38.8610, 71.2761],
  'Turkménistan': [38.9697, 59.5563],

  // Asie du Sud
  'Afghanistan': [33.9391, 67.7100],
  'Bangladesh': [23.6850, 90.3563],
  'Bhoutan': [27.5142, 90.4336],
  'Inde': [20.5937, 78.9629],
  'Maldives': [3.2028, 73.2207],
  'Népal': [28.3949, 84.1240],
  'Pakistan': [30.3753, 69.3451],
  'Sri Lanka': [7.8731, 80.7718],

  // Asie de l'Est
  'Chine': [35.8617, 104.1954],
  'Corée du Nord': [40.3399, 127.5101],
  'Corée du Sud': [35.9078, 127.7669],
  'Japon': [36.2048, 138.2529],
  'Mongolie': [46.8625, 103.8467],
  'Taïwan': [23.6978, 120.9605],

  // Asie du Sud-Est
  'Birmanie': [21.9162, 95.9560],
  'Brunei': [4.5353, 114.7277],
  'Cambodge': [12.5657, 104.9910],
  'Indonésie': [-0.7893, 113.9213],
  'Laos': [19.8563, 102.4955],
  'Malaisie': [4.2105, 101.9758],
  'Philippines': [12.8797, 121.7740],
  'Singapour': [1.3521, 103.8198],
  'Thaïlande': [15.8700, 100.9925],
  'Timor oriental': [-8.8742, 125.7275],
  'Viêt Nam': [14.0583, 108.2772],

  // Europe de l'Ouest
  'Allemagne': [51.1657, 10.4515],
  'Autriche': [47.5162, 14.5501],
  'Belgique': [50.5039, 4.4699],
  'France': [46.2276, 2.2137],
  'Liechtenstein': [47.1660, 9.5554],
  'Luxembourg': [49.8153, 6.1296],
  'Monaco': [43.7384, 7.4246],
  'Pays-Bas': [52.1326, 5.2913],
  'Suisse': [46.8182, 8.2275],

  // Europe de l'Est
  'Biélorussie': [53.7098, 27.9534],
  'Bulgarie': [42.7339, 25.4858],
  'Hongrie': [47.1625, 19.5033],
  'Moldavie': [47.4116, 28.3699],
  'Pologne': [51.9194, 19.1451],
  'Roumanie': [45.9432, 24.9668],
  'Russie': [61.5240, 105.3188],
  'Slovaquie': [48.6690, 19.6990],
  'Tchéquie': [49.8175, 15.4730],
  'Ukraine': [48.3794, 31.1656],

  // Europe du Nord
  'Danemark': [56.2639, 9.5018],
  'Estonie': [58.5953, 25.0136],
  'Finlande': [61.9241, 25.7482],
  'Islande': [64.9631, -19.0208],
  'Lettonie': [56.8796, 24.6032],
  'Lituanie': [55.1694, 23.8813],
  'Norvège': [60.4720, 8.4689],
  'Suède': [60.1282, 18.6435],

  // Europe du Sud
  'Albanie': [41.1533, 20.1683],
  'Andorre': [42.5063, 1.5218],
  'Bosnie-Herzégovine': [43.9159, 17.6791],
  'Croatie': [45.1000, 15.2000],
  'Espagne': [40.4637, -3.7492],
  'Grèce': [39.0742, 21.8243],
  'Italie': [41.8719, 12.5674],
  'Kosovo': [42.6026, 20.9030],
  'Macédoine du Nord': [41.5124, 21.7465],
  'Malte': [35.9375, 14.3754],
  'Monténégro': [42.7087, 19.3744],
  'Portugal': [39.3999, -8.2245],
  'Saint-Marin': [43.9424, 12.4578],
  'Serbie': [44.0165, 21.0059],
  'Slovénie': [46.1512, 14.9955],
  'Vatican': [41.9029, 12.4534],

  // Îles Britanniques
  'Irlande': [53.1424, -7.6921],
  'Royaume-Uni': [55.3781, -3.4360],

  // Australasie
  'Australie': [-25.2744, 133.7751],
  'Nouvelle-Zélande': [-40.9006, 174.8860],

  // Mélanésie
  'Fidji': [-17.7134, 178.0650],
  'Papouasie-Nouvelle-Guinée': [-6.3150, 143.9555],
  'Salomon': [-9.6457, 160.1562],
  'Vanuatu': [-15.3767, 166.9592],

  // Micronésie
  'Kiribati': [-3.3704, -168.7340],
  'Marshall': [7.1315, 171.1845],
  'Micronésie': [7.4256, 150.5508],
  'Nauru': [-0.5228, 166.9315],
  'Palaos': [7.5150, 134.5825],

  // Polynésie
  'Samoa': [-13.7590, -172.1046],
  'Tonga': [-21.1789, -175.1982],
  'Tuvalu': [-7.1095, 179.1940],
}

/**
 * Get coordinates for a country by its French name
 * @param countryName - French name of the country (must match geography.ts)
 * @returns [latitude, longitude] tuple or null if not found
 */
export function getCountryCoordinates(countryName: string): [number, number] | null {
  return COUNTRY_COORDINATES[countryName] ?? null
}

/**
 * Get all countries that have coordinates
 * @returns Array of country names
 */
export function getCountriesWithCoordinates(): string[] {
  return Object.keys(COUNTRY_COORDINATES)
}
