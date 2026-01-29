// Geographic regions and countries in French
// Organized by continent and sub-region

export interface Region {
  name: string
  countries: string[]
}

export interface Continent {
  name: string
  regions: Region[]
}

export const GEOGRAPHY: Continent[] = [
  {
    name: 'Afrique',
    regions: [
      {
        name: 'Afrique du Nord',
        countries: [
          'Algérie',
          'Égypte',
          'Libye',
          'Maroc',
          'Soudan',
          'Tunisie',
          'Sahara occidental',
        ],
      },
      {
        name: "Afrique de l'Ouest",
        countries: [
          'Bénin',
          'Burkina Faso',
          'Cap-Vert',
          'Côte d\'Ivoire',
          'Gambie',
          'Ghana',
          'Guinée',
          'Guinée-Bissau',
          'Liberia',
          'Mali',
          'Mauritanie',
          'Niger',
          'Nigeria',
          'Sénégal',
          'Sierra Leone',
          'Togo',
        ],
      },
      {
        name: "Afrique de l'Est",
        countries: [
          'Burundi',
          'Comores',
          'Djibouti',
          'Érythrée',
          'Éthiopie',
          'Kenya',
          'Madagascar',
          'Malawi',
          'Maurice',
          'Mozambique',
          'Ouganda',
          'Rwanda',
          'Seychelles',
          'Somalie',
          'Soudan du Sud',
          'Tanzanie',
          'Zambie',
          'Zimbabwe',
        ],
      },
      {
        name: 'Afrique Centrale',
        countries: [
          'Angola',
          'Cameroun',
          'Centrafrique',
          'Congo',
          'Gabon',
          'Guinée équatoriale',
          'République démocratique du Congo',
          'Sao Tomé-et-Príncipe',
          'Tchad',
        ],
      },
      {
        name: 'Afrique Australe',
        countries: [
          'Afrique du Sud',
          'Botswana',
          'Eswatini',
          'Lesotho',
          'Namibie',
        ],
      },
    ],
  },
  {
    name: 'Amérique',
    regions: [
      {
        name: 'Amérique du Nord',
        countries: [
          'Canada',
          'États-Unis',
          'Mexique',
        ],
      },
      {
        name: 'Amérique Centrale',
        countries: [
          'Belize',
          'Costa Rica',
          'Guatemala',
          'Honduras',
          'Nicaragua',
          'Panama',
          'Salvador',
        ],
      },
      {
        name: 'Caraïbes',
        countries: [
          'Antigua-et-Barbuda',
          'Bahamas',
          'Barbade',
          'Cuba',
          'Dominique',
          'Grenade',
          'Haïti',
          'Jamaïque',
          'Porto Rico',
          'République dominicaine',
          'Saint-Kitts-et-Nevis',
          'Saint-Vincent-et-les-Grenadines',
          'Sainte-Lucie',
          'Trinité-et-Tobago',
        ],
      },
      {
        name: 'Amérique du Sud',
        countries: [
          'Argentine',
          'Bolivie',
          'Brésil',
          'Chili',
          'Colombie',
          'Équateur',
          'Guyana',
          'Paraguay',
          'Pérou',
          'Suriname',
          'Uruguay',
          'Venezuela',
        ],
      },
    ],
  },
  {
    name: 'Asie',
    regions: [
      {
        name: "Asie de l'Ouest",
        countries: [
          'Arabie saoudite',
          'Arménie',
          'Azerbaïdjan',
          'Bahreïn',
          'Chypre',
          'Émirats arabes unis',
          'Géorgie',
          'Irak',
          'Iran',
          'Israël',
          'Jordanie',
          'Koweït',
          'Liban',
          'Oman',
          'Palestine',
          'Qatar',
          'Syrie',
          'Turquie',
          'Yémen',
        ],
      },
      {
        name: 'Asie Centrale',
        countries: [
          'Kazakhstan',
          'Kirghizistan',
          'Ouzbékistan',
          'Tadjikistan',
          'Turkménistan',
        ],
      },
      {
        name: 'Asie du Sud',
        countries: [
          'Afghanistan',
          'Bangladesh',
          'Bhoutan',
          'Inde',
          'Maldives',
          'Népal',
          'Pakistan',
          'Sri Lanka',
        ],
      },
      {
        name: "Asie de l'Est",
        countries: [
          'Chine',
          'Corée du Nord',
          'Corée du Sud',
          'Japon',
          'Mongolie',
          'Taïwan',
        ],
      },
      {
        name: 'Asie du Sud-Est',
        countries: [
          'Birmanie',
          'Brunei',
          'Cambodge',
          'Indonésie',
          'Laos',
          'Malaisie',
          'Philippines',
          'Singapour',
          'Thaïlande',
          'Timor oriental',
          'Viêt Nam',
        ],
      },
    ],
  },
  {
    name: 'Europe',
    regions: [
      {
        name: "Europe de l'Ouest",
        countries: [
          'Allemagne',
          'Autriche',
          'Belgique',
          'France',
          'Liechtenstein',
          'Luxembourg',
          'Monaco',
          'Pays-Bas',
          'Suisse',
        ],
      },
      {
        name: "Europe de l'Est",
        countries: [
          'Biélorussie',
          'Bulgarie',
          'Hongrie',
          'Moldavie',
          'Pologne',
          'Roumanie',
          'Russie',
          'Slovaquie',
          'Tchéquie',
          'Ukraine',
        ],
      },
      {
        name: 'Europe du Nord',
        countries: [
          'Danemark',
          'Estonie',
          'Finlande',
          'Islande',
          'Lettonie',
          'Lituanie',
          'Norvège',
          'Suède',
        ],
      },
      {
        name: 'Europe du Sud',
        countries: [
          'Albanie',
          'Andorre',
          'Bosnie-Herzégovine',
          'Croatie',
          'Espagne',
          'Grèce',
          'Italie',
          'Kosovo',
          'Macédoine du Nord',
          'Malte',
          'Monténégro',
          'Portugal',
          'Saint-Marin',
          'Serbie',
          'Slovénie',
          'Vatican',
        ],
      },
      {
        name: 'Îles Britanniques',
        countries: [
          'Irlande',
          'Royaume-Uni',
        ],
      },
    ],
  },
  {
    name: 'Océanie',
    regions: [
      {
        name: 'Australasie',
        countries: [
          'Australie',
          'Nouvelle-Zélande',
        ],
      },
      {
        name: 'Mélanésie',
        countries: [
          'Fidji',
          'Papouasie-Nouvelle-Guinée',
          'Salomon',
          'Vanuatu',
        ],
      },
      {
        name: 'Micronésie',
        countries: [
          'Kiribati',
          'Marshall',
          'Micronésie',
          'Nauru',
          'Palaos',
        ],
      },
      {
        name: 'Polynésie',
        countries: [
          'Samoa',
          'Tonga',
          'Tuvalu',
        ],
      },
    ],
  },
]

// Helper functions

// Get all regions as a flat array
export function getAllRegions(): string[] {
  return GEOGRAPHY.flatMap((continent) =>
    continent.regions.map((region) => region.name)
  )
}

// Get all countries as a flat array
export function getAllCountries(): string[] {
  return GEOGRAPHY.flatMap((continent) =>
    continent.regions.flatMap((region) => region.countries)
  ).sort((a, b) => a.localeCompare(b, 'fr'))
}

// Get countries for a specific region
export function getCountriesByRegion(regionName: string): string[] {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      if (region.name === regionName) {
        return region.countries
      }
    }
  }
  return []
}

// Get region for a specific country
export function getRegionByCountry(countryName: string): string | null {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      if (region.countries.includes(countryName)) {
        return region.name
      }
    }
  }
  return null
}

// Get continent for a specific country
export function getContinentByCountry(countryName: string): string | null {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      if (region.countries.includes(countryName)) {
        return continent.name
      }
    }
  }
  return null
}

// Get all countries for a continent
export function getCountriesByContinent(continentName: string): string[] {
  const continent = GEOGRAPHY.find((c) => c.name === continentName)
  if (!continent) return []
  return continent.regions.flatMap((region) => region.countries).sort((a, b) => a.localeCompare(b, 'fr'))
}

// Build a flat list grouped by region for filter display
export interface RegionWithCountries {
  region: string
  countries: string[]
}

export function getRegionsWithCountries(): RegionWithCountries[] {
  return GEOGRAPHY.flatMap((continent) =>
    continent.regions.map((region) => ({
      region: region.name,
      countries: [...region.countries].sort((a, b) => a.localeCompare(b, 'fr')),
    }))
  )
}
