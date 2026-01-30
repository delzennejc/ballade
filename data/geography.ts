// Geographic regions and countries - Bilingual (French/English)
// Organized by continent and sub-region

export type AppLanguage = 'fr' | 'en'

export interface BilingualName {
  fr: string
  en: string
}

export interface Region {
  name: BilingualName
  countries: BilingualName[]
}

export interface Continent {
  name: BilingualName
  regions: Region[]
}

export const GEOGRAPHY: Continent[] = [
  {
    name: { fr: 'Afrique', en: 'Africa' },
    regions: [
      {
        name: { fr: 'Afrique du Nord', en: 'North Africa' },
        countries: [
          { fr: 'Algérie', en: 'Algeria' },
          { fr: 'Égypte', en: 'Egypt' },
          { fr: 'Libye', en: 'Libya' },
          { fr: 'Maroc', en: 'Morocco' },
          { fr: 'Soudan', en: 'Sudan' },
          { fr: 'Tunisie', en: 'Tunisia' },
          { fr: 'Sahara occidental', en: 'Western Sahara' },
        ],
      },
      {
        name: { fr: "Afrique de l'Ouest", en: 'West Africa' },
        countries: [
          { fr: 'Bénin', en: 'Benin' },
          { fr: 'Burkina Faso', en: 'Burkina Faso' },
          { fr: 'Cap-Vert', en: 'Cape Verde' },
          { fr: "Côte d'Ivoire", en: 'Ivory Coast' },
          { fr: 'Gambie', en: 'Gambia' },
          { fr: 'Ghana', en: 'Ghana' },
          { fr: 'Guinée', en: 'Guinea' },
          { fr: 'Guinée-Bissau', en: 'Guinea-Bissau' },
          { fr: 'Liberia', en: 'Liberia' },
          { fr: 'Mali', en: 'Mali' },
          { fr: 'Mauritanie', en: 'Mauritania' },
          { fr: 'Niger', en: 'Niger' },
          { fr: 'Nigeria', en: 'Nigeria' },
          { fr: 'Sénégal', en: 'Senegal' },
          { fr: 'Sierra Leone', en: 'Sierra Leone' },
          { fr: 'Togo', en: 'Togo' },
        ],
      },
      {
        name: { fr: "Afrique de l'Est", en: 'East Africa' },
        countries: [
          { fr: 'Burundi', en: 'Burundi' },
          { fr: 'Comores', en: 'Comoros' },
          { fr: 'Djibouti', en: 'Djibouti' },
          { fr: 'Érythrée', en: 'Eritrea' },
          { fr: 'Éthiopie', en: 'Ethiopia' },
          { fr: 'Kenya', en: 'Kenya' },
          { fr: 'Madagascar', en: 'Madagascar' },
          { fr: 'Malawi', en: 'Malawi' },
          { fr: 'Maurice', en: 'Mauritius' },
          { fr: 'Mozambique', en: 'Mozambique' },
          { fr: 'Ouganda', en: 'Uganda' },
          { fr: 'Rwanda', en: 'Rwanda' },
          { fr: 'Seychelles', en: 'Seychelles' },
          { fr: 'Somalie', en: 'Somalia' },
          { fr: 'Soudan du Sud', en: 'South Sudan' },
          { fr: 'Tanzanie', en: 'Tanzania' },
          { fr: 'Zambie', en: 'Zambia' },
          { fr: 'Zimbabwe', en: 'Zimbabwe' },
        ],
      },
      {
        name: { fr: 'Afrique Centrale', en: 'Central Africa' },
        countries: [
          { fr: 'Angola', en: 'Angola' },
          { fr: 'Cameroun', en: 'Cameroon' },
          { fr: 'Centrafrique', en: 'Central African Republic' },
          { fr: 'Congo', en: 'Congo' },
          { fr: 'Gabon', en: 'Gabon' },
          { fr: 'Guinée équatoriale', en: 'Equatorial Guinea' },
          { fr: 'République démocratique du Congo', en: 'Democratic Republic of the Congo' },
          { fr: 'Sao Tomé-et-Príncipe', en: 'Sao Tome and Principe' },
          { fr: 'Tchad', en: 'Chad' },
        ],
      },
      {
        name: { fr: 'Afrique Australe', en: 'Southern Africa' },
        countries: [
          { fr: 'Afrique du Sud', en: 'South Africa' },
          { fr: 'Botswana', en: 'Botswana' },
          { fr: 'Eswatini', en: 'Eswatini' },
          { fr: 'Lesotho', en: 'Lesotho' },
          { fr: 'Namibie', en: 'Namibia' },
        ],
      },
    ],
  },
  {
    name: { fr: 'Amérique', en: 'Americas' },
    regions: [
      {
        name: { fr: 'Amérique du Nord', en: 'North America' },
        countries: [
          { fr: 'Canada', en: 'Canada' },
          { fr: 'États-Unis', en: 'United States' },
          { fr: 'Mexique', en: 'Mexico' },
        ],
      },
      {
        name: { fr: 'Amérique Centrale', en: 'Central America' },
        countries: [
          { fr: 'Belize', en: 'Belize' },
          { fr: 'Costa Rica', en: 'Costa Rica' },
          { fr: 'Guatemala', en: 'Guatemala' },
          { fr: 'Honduras', en: 'Honduras' },
          { fr: 'Nicaragua', en: 'Nicaragua' },
          { fr: 'Panama', en: 'Panama' },
          { fr: 'Salvador', en: 'El Salvador' },
        ],
      },
      {
        name: { fr: 'Caraïbes', en: 'Caribbean' },
        countries: [
          { fr: 'Antigua-et-Barbuda', en: 'Antigua and Barbuda' },
          { fr: 'Bahamas', en: 'Bahamas' },
          { fr: 'Barbade', en: 'Barbados' },
          { fr: 'Cuba', en: 'Cuba' },
          { fr: 'Dominique', en: 'Dominica' },
          { fr: 'Grenade', en: 'Grenada' },
          { fr: 'Haïti', en: 'Haiti' },
          { fr: 'Jamaïque', en: 'Jamaica' },
          { fr: 'Porto Rico', en: 'Puerto Rico' },
          { fr: 'République dominicaine', en: 'Dominican Republic' },
          { fr: 'Saint-Kitts-et-Nevis', en: 'Saint Kitts and Nevis' },
          { fr: 'Saint-Vincent-et-les-Grenadines', en: 'Saint Vincent and the Grenadines' },
          { fr: 'Sainte-Lucie', en: 'Saint Lucia' },
          { fr: 'Trinité-et-Tobago', en: 'Trinidad and Tobago' },
        ],
      },
      {
        name: { fr: 'Amérique du Sud', en: 'South America' },
        countries: [
          { fr: 'Argentine', en: 'Argentina' },
          { fr: 'Bolivie', en: 'Bolivia' },
          { fr: 'Brésil', en: 'Brazil' },
          { fr: 'Chili', en: 'Chile' },
          { fr: 'Colombie', en: 'Colombia' },
          { fr: 'Équateur', en: 'Ecuador' },
          { fr: 'Guyana', en: 'Guyana' },
          { fr: 'Paraguay', en: 'Paraguay' },
          { fr: 'Pérou', en: 'Peru' },
          { fr: 'Suriname', en: 'Suriname' },
          { fr: 'Uruguay', en: 'Uruguay' },
          { fr: 'Venezuela', en: 'Venezuela' },
        ],
      },
    ],
  },
  {
    name: { fr: 'Asie', en: 'Asia' },
    regions: [
      {
        name: { fr: "Asie de l'Ouest", en: 'Western Asia' },
        countries: [
          { fr: 'Arabie saoudite', en: 'Saudi Arabia' },
          { fr: 'Arménie', en: 'Armenia' },
          { fr: 'Azerbaïdjan', en: 'Azerbaijan' },
          { fr: 'Bahreïn', en: 'Bahrain' },
          { fr: 'Chypre', en: 'Cyprus' },
          { fr: 'Émirats arabes unis', en: 'United Arab Emirates' },
          { fr: 'Géorgie', en: 'Georgia' },
          { fr: 'Irak', en: 'Iraq' },
          { fr: 'Iran', en: 'Iran' },
          { fr: 'Israël', en: 'Israel' },
          { fr: 'Jordanie', en: 'Jordan' },
          { fr: 'Koweït', en: 'Kuwait' },
          { fr: 'Liban', en: 'Lebanon' },
          { fr: 'Oman', en: 'Oman' },
          { fr: 'Palestine', en: 'Palestine' },
          { fr: 'Qatar', en: 'Qatar' },
          { fr: 'Syrie', en: 'Syria' },
          { fr: 'Turquie', en: 'Turkey' },
          { fr: 'Yémen', en: 'Yemen' },
        ],
      },
      {
        name: { fr: 'Asie Centrale', en: 'Central Asia' },
        countries: [
          { fr: 'Kazakhstan', en: 'Kazakhstan' },
          { fr: 'Kirghizistan', en: 'Kyrgyzstan' },
          { fr: 'Ouzbékistan', en: 'Uzbekistan' },
          { fr: 'Tadjikistan', en: 'Tajikistan' },
          { fr: 'Turkménistan', en: 'Turkmenistan' },
        ],
      },
      {
        name: { fr: 'Asie du Sud', en: 'South Asia' },
        countries: [
          { fr: 'Afghanistan', en: 'Afghanistan' },
          { fr: 'Bangladesh', en: 'Bangladesh' },
          { fr: 'Bhoutan', en: 'Bhutan' },
          { fr: 'Inde', en: 'India' },
          { fr: 'Maldives', en: 'Maldives' },
          { fr: 'Népal', en: 'Nepal' },
          { fr: 'Pakistan', en: 'Pakistan' },
          { fr: 'Sri Lanka', en: 'Sri Lanka' },
        ],
      },
      {
        name: { fr: "Asie de l'Est", en: 'East Asia' },
        countries: [
          { fr: 'Chine', en: 'China' },
          { fr: 'Corée du Nord', en: 'North Korea' },
          { fr: 'Corée du Sud', en: 'South Korea' },
          { fr: 'Japon', en: 'Japan' },
          { fr: 'Mongolie', en: 'Mongolia' },
          { fr: 'Taïwan', en: 'Taiwan' },
        ],
      },
      {
        name: { fr: 'Asie du Sud-Est', en: 'Southeast Asia' },
        countries: [
          { fr: 'Birmanie', en: 'Myanmar' },
          { fr: 'Brunei', en: 'Brunei' },
          { fr: 'Cambodge', en: 'Cambodia' },
          { fr: 'Indonésie', en: 'Indonesia' },
          { fr: 'Laos', en: 'Laos' },
          { fr: 'Malaisie', en: 'Malaysia' },
          { fr: 'Philippines', en: 'Philippines' },
          { fr: 'Singapour', en: 'Singapore' },
          { fr: 'Thaïlande', en: 'Thailand' },
          { fr: 'Timor oriental', en: 'East Timor' },
          { fr: 'Viêt Nam', en: 'Vietnam' },
        ],
      },
    ],
  },
  {
    name: { fr: 'Europe', en: 'Europe' },
    regions: [
      {
        name: { fr: "Europe de l'Ouest", en: 'Western Europe' },
        countries: [
          { fr: 'Allemagne', en: 'Germany' },
          { fr: 'Autriche', en: 'Austria' },
          { fr: 'Belgique', en: 'Belgium' },
          { fr: 'France', en: 'France' },
          { fr: 'Liechtenstein', en: 'Liechtenstein' },
          { fr: 'Luxembourg', en: 'Luxembourg' },
          { fr: 'Monaco', en: 'Monaco' },
          { fr: 'Pays-Bas', en: 'Netherlands' },
          { fr: 'Suisse', en: 'Switzerland' },
        ],
      },
      {
        name: { fr: "Europe de l'Est", en: 'Eastern Europe' },
        countries: [
          { fr: 'Biélorussie', en: 'Belarus' },
          { fr: 'Bulgarie', en: 'Bulgaria' },
          { fr: 'Hongrie', en: 'Hungary' },
          { fr: 'Moldavie', en: 'Moldova' },
          { fr: 'Pologne', en: 'Poland' },
          { fr: 'Roumanie', en: 'Romania' },
          { fr: 'Russie', en: 'Russia' },
          { fr: 'Slovaquie', en: 'Slovakia' },
          { fr: 'Tchéquie', en: 'Czech Republic' },
          { fr: 'Ukraine', en: 'Ukraine' },
        ],
      },
      {
        name: { fr: 'Europe du Nord', en: 'Northern Europe' },
        countries: [
          { fr: 'Danemark', en: 'Denmark' },
          { fr: 'Estonie', en: 'Estonia' },
          { fr: 'Finlande', en: 'Finland' },
          { fr: 'Islande', en: 'Iceland' },
          { fr: 'Lettonie', en: 'Latvia' },
          { fr: 'Lituanie', en: 'Lithuania' },
          { fr: 'Norvège', en: 'Norway' },
          { fr: 'Suède', en: 'Sweden' },
        ],
      },
      {
        name: { fr: 'Europe du Sud', en: 'Southern Europe' },
        countries: [
          { fr: 'Albanie', en: 'Albania' },
          { fr: 'Andorre', en: 'Andorra' },
          { fr: 'Bosnie-Herzégovine', en: 'Bosnia and Herzegovina' },
          { fr: 'Croatie', en: 'Croatia' },
          { fr: 'Espagne', en: 'Spain' },
          { fr: 'Grèce', en: 'Greece' },
          { fr: 'Italie', en: 'Italy' },
          { fr: 'Kosovo', en: 'Kosovo' },
          { fr: 'Macédoine du Nord', en: 'North Macedonia' },
          { fr: 'Malte', en: 'Malta' },
          { fr: 'Monténégro', en: 'Montenegro' },
          { fr: 'Portugal', en: 'Portugal' },
          { fr: 'Saint-Marin', en: 'San Marino' },
          { fr: 'Serbie', en: 'Serbia' },
          { fr: 'Slovénie', en: 'Slovenia' },
          { fr: 'Vatican', en: 'Vatican City' },
        ],
      },
      {
        name: { fr: 'Îles Britanniques', en: 'British Isles' },
        countries: [
          { fr: 'Irlande', en: 'Ireland' },
          { fr: 'Royaume-Uni', en: 'United Kingdom' },
        ],
      },
    ],
  },
  {
    name: { fr: 'Océanie', en: 'Oceania' },
    regions: [
      {
        name: { fr: 'Australasie', en: 'Australasia' },
        countries: [
          { fr: 'Australie', en: 'Australia' },
          { fr: 'Nouvelle-Zélande', en: 'New Zealand' },
        ],
      },
      {
        name: { fr: 'Mélanésie', en: 'Melanesia' },
        countries: [
          { fr: 'Fidji', en: 'Fiji' },
          { fr: 'Papouasie-Nouvelle-Guinée', en: 'Papua New Guinea' },
          { fr: 'Salomon', en: 'Solomon Islands' },
          { fr: 'Vanuatu', en: 'Vanuatu' },
        ],
      },
      {
        name: { fr: 'Micronésie', en: 'Micronesia' },
        countries: [
          { fr: 'Kiribati', en: 'Kiribati' },
          { fr: 'Marshall', en: 'Marshall Islands' },
          { fr: 'Micronésie', en: 'Micronesia' },
          { fr: 'Nauru', en: 'Nauru' },
          { fr: 'Palaos', en: 'Palau' },
        ],
      },
      {
        name: { fr: 'Polynésie', en: 'Polynesia' },
        countries: [
          { fr: 'Samoa', en: 'Samoa' },
          { fr: 'Tonga', en: 'Tonga' },
          { fr: 'Tuvalu', en: 'Tuvalu' },
        ],
      },
    ],
  },
]

// =============================================================================
// Helper functions
// =============================================================================

// Get all regions as a flat array
export function getAllRegions(lang: AppLanguage = 'fr'): string[] {
  return GEOGRAPHY.flatMap((continent) =>
    continent.regions.map((region) => region.name[lang])
  )
}

// Get all countries as a flat array
export function getAllCountries(lang: AppLanguage = 'fr'): string[] {
  return GEOGRAPHY.flatMap((continent) =>
    continent.regions.flatMap((region) =>
      region.countries.map((country) => country[lang])
    )
  ).sort((a, b) => a.localeCompare(b, lang === 'fr' ? 'fr' : 'en'))
}

// Get all countries as bilingual objects
export function getAllCountriesBilingual(): BilingualName[] {
  return GEOGRAPHY.flatMap((continent) =>
    continent.regions.flatMap((region) => region.countries)
  ).sort((a, b) => a.fr.localeCompare(b.fr, 'fr'))
}

// Get countries for a specific region (by French or English name)
export function getCountriesByRegion(regionName: string, lang: AppLanguage = 'fr'): string[] {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      if (region.name.fr === regionName || region.name.en === regionName) {
        return region.countries.map((country) => country[lang])
      }
    }
  }
  return []
}

// Get region for a specific country (accepts French or English name)
export function getRegionByCountry(countryName: string, lang: AppLanguage = 'fr'): string | null {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      const found = region.countries.find(
        (country) => country.fr === countryName || country.en === countryName
      )
      if (found) {
        return region.name[lang]
      }
    }
  }
  return null
}

// Get continent for a specific country (accepts French or English name)
export function getContinentByCountry(countryName: string, lang: AppLanguage = 'fr'): string | null {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      const found = region.countries.find(
        (country) => country.fr === countryName || country.en === countryName
      )
      if (found) {
        return continent.name[lang]
      }
    }
  }
  return null
}

// Get all countries for a continent (by French or English name)
export function getCountriesByContinent(continentName: string, lang: AppLanguage = 'fr'): string[] {
  const continent = GEOGRAPHY.find(
    (c) => c.name.fr === continentName || c.name.en === continentName
  )
  if (!continent) return []
  return continent.regions
    .flatMap((region) => region.countries.map((country) => country[lang]))
    .sort((a, b) => a.localeCompare(b, lang === 'fr' ? 'fr' : 'en'))
}

// Build a flat list grouped by region for filter display
export interface RegionWithCountries {
  region: string
  countries: string[]
}

export function getRegionsWithCountries(lang: AppLanguage = 'fr'): RegionWithCountries[] {
  return GEOGRAPHY.flatMap((continent) =>
    continent.regions.map((region) => ({
      region: region.name[lang],
      countries: [...region.countries.map((c) => c[lang])].sort((a, b) =>
        a.localeCompare(b, lang === 'fr' ? 'fr' : 'en')
      ),
    }))
  )
}

// Translate a country name from one language to another
export function translateCountry(
  countryName: string,
  fromLang: AppLanguage,
  toLang: AppLanguage
): string {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      const found = region.countries.find((country) => country[fromLang] === countryName)
      if (found) {
        return found[toLang]
      }
    }
  }
  return countryName // Return original if not found
}

// Translate a region name from one language to another
export function translateRegion(
  regionName: string,
  fromLang: AppLanguage,
  toLang: AppLanguage
): string {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      if (region.name[fromLang] === regionName) {
        return region.name[toLang]
      }
    }
  }
  return regionName // Return original if not found
}

// Get country by French name (for backward compatibility with existing data)
export function getCountryByFrenchName(frenchName: string): BilingualName | null {
  for (const continent of GEOGRAPHY) {
    for (const region of continent.regions) {
      const found = region.countries.find((country) => country.fr === frenchName)
      if (found) {
        return found
      }
    }
  }
  return null
}
