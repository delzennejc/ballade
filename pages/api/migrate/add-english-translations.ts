import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

// =============================================================================
// TRANSLATION MAPPINGS
// =============================================================================

const LANGUAGE_TRANSLATIONS: Record<string, string> = {
  'Albanais': 'Albanian',
  'Allemand': 'German',
  'Alsacien': 'Alsatian',
  'Anglais': 'English',
  'Arabe': 'Arabic',
  'Arapaho': 'Arapaho',
  'Arménien': 'Armenian',
  'Bambara': 'Bambara',
  'BCMS': 'BCMS',
  'Brésilien indigène': 'Brazilian Indigenous',
  'Bulgare': 'Bulgarian',
  'Cap-Verdien': 'Cape Verdean Creole',
  'Catalan': 'Catalan',
  'Chechen': 'Chechen',
  'Créole haïtien': 'Haitian Creole',
  'Espagnol': 'Spanish',
  'Farsi': 'Farsi',
  'Français': 'French',
  'Gaélique': 'Gaelic',
  'Gascon': 'Gascon',
  'Géorgien': 'Georgian',
  'Grec': 'Greek',
  'Hongrois': 'Hungarian',
  'Italien': 'Italian',
  'Judéo-araméen': 'Judeo-Aramaic',
  'Kinyarwanda': 'Kinyarwanda',
  'Kurde': 'Kurdish',
  'Ladino': 'Ladino',
  'Latin': 'Latin',
  'Letton': 'Latvian',
  'Lingala': 'Lingala',
  'Lituanien': 'Lithuanian',
  'Macédonien': 'Macedonian',
  'Maori': 'Maori',
  'Néerlandais': 'Dutch',
  'Plurilingue': 'Multilingual',
  'Polonais': 'Polish',
  'Portugais': 'Portuguese',
  'Romani': 'Romani',
  'Roumain': 'Romanian',
  'Russe': 'Russian',
  'Slovène': 'Slovenian',
  'Suédois': 'Swedish',
  'Swahili': 'Swahili',
  'Turc': 'Turkish',
  'Ukrainien': 'Ukrainian',
  'Wolof': 'Wolof',
  'Yiddish': 'Yiddish',
  'Zulu': 'Zulu',
}

const AUDIENCE_TRANSLATIONS: Record<string, string> = {
  'Enfants': 'Children',
  'Adolescents': 'Teenagers',
  'Adultes': 'Adults',
  'Tous publics': 'All Audiences',
  'Scolaire': 'School',
  'Famille': 'Family',
  'Ados': 'Teenagers',
  'Séniors': 'Seniors',
}

const TRACK_TYPE_TRANSLATIONS: Record<string, string> = {
  'Groupe': 'Full Band',
  'Violon': 'Violin',
  'Chant': 'Vocals',
  'Guitare': 'Guitar',
  'Percussion': 'Percussion',
  'Piano': 'Piano',
  'Accordéon': 'Accordion',
  'Flûte': 'Flute',
}

const GENRE_TRANSLATIONS: Record<string, string> = {
  'Traditionnel': 'Traditional',
  'Folk': 'Folk',
  'Classique': 'Classical',
  'Populaire': 'Popular',
  'Berceuse': 'Lullaby',
  'Comptine': 'Nursery Rhyme',
  'Chant de travail': 'Work Song',
  'Chant religieux': 'Religious Song',
  'Hymne': 'Hymn',
  'Ballade': 'Ballad',
  'Blues': 'Blues',
  'Boléro': 'Bolero',
  'Canon': 'Canon',
  'Chant de capoeira': 'Capoeira Song',
  'Musique celtique': 'Celtic Music',
  'Chanson': 'Song',
  'Chanson francophone': 'French Song',
  'Chanson pour enfants': "Children's Song",
  'Chant de Noël': 'Christmas Carol',
  'Chanson de Noël': 'Christmas Song',
  'Chant choral': 'Choral Song',
  'Coladeira': 'Coladeira',
  'Country': 'Country',
  'Cumbia': 'Cumbia',
  'Disco': 'Disco',
  'Chanson festive': 'Festive Song',
  'Musique de film': 'Film Music',
  'Flamenco': 'Flamenco',
  'Folk rock': 'Folk Rock',
  'Chanson tzigane': 'Gypsy Song',
  'Jazz': 'Jazz',
  'Klezmer': 'Klezmer',
  'Kolo': 'Kolo',
  'Chanson médiévale': 'Medieval Song',
  'Morna': 'Morna',
  'Comédie musicale': 'Musical',
  'Chanson napolitaine': 'Neapolitan Song',
  'Negro spiritual': 'Negro Spiritual',
  'Opéra': 'Opera',
  'Pastorale': 'Pastoral',
  'Pavane': 'Pavane',
  'Chant polyphonique': 'Polyphonic Song',
  'Pop': 'Pop',
  'Chanson engagée': 'Protest Song',
  'Reggae': 'Reggae',
  'Chanson de la Renaissance': 'Renaissance Song',
  'Rock': 'Rock',
  'Opéra rock': 'Rock Opera',
  'Romane Chave': 'Romane Chave',
  'Musique romantique': 'Romantic Music',
  'Rondeau': 'Rondeau',
  'Rumba flamenca': 'Flamenco Rumba',
  'Danse écossaise': 'Scottish Dance',
  'Séfarade': 'Sephardic',
  'Sépharade': 'Sephardic',
  'Sevdalinka': 'Sevdalinka',
  'Singspiegel': 'Singspiegel',
  'Starogradska': 'Starogradska',
  'Tango': 'Tango',
  'Danse traditionnelle': 'Traditional Dance',
  'Musique traditionnelle': 'Traditional Music',
  'Chanson traditionnelle': 'Traditional Song',
  'Tryndytchka': 'Tryndytchka',
  'Chanson enfantine': "Children's Song",
  'Chanson française': 'French Song',
  'Chant de la Renaissance': 'Renaissance Song',
  'Chant médiéval': 'Medieval Song',
  'Chant traditionnel': 'Traditional Song',
  'Danse de recrutement': 'Recruitment Dance',
  'Danse scottish': 'Scottish Dance',
  'Jazz manouche': 'Gypsy Jazz',
  'Kasatchok': 'Kazachok',
  'Musique classique': 'Classical Music',
  'Musique de capoeira': 'Capoeira Music',
  'Musique médiévale': 'Medieval Music',
  'Musique pour choeur': 'Choral Music',
  'Musique tsigane': 'Gypsy Music',
  'Rock folk': 'Folk Rock',
  'Sirba': 'Sirba',
  'Swing': 'Swing',
  'Tarentelle': 'Tarantella',
  'Valse': 'Waltz',
  'Verbunkos': 'Verbunkos',
  'Chant de résistance': 'Resistance Song',
}

const THEME_TRANSLATIONS: Record<string, string> = {
  'Amour': 'Love',
  'Nature': 'Nature',
  'Fête': 'Celebration',
  'Voyage': 'Travel',
  'Histoire': 'History',
  'Enfance': 'Childhood',
  'Travail': 'Work',
  'Liberté': 'Freedom',
  'Abandon': 'Abandonment',
  'Abris': 'Shelter',
  'Amitié': 'Friendship',
  'Animaux': 'Animals',
  'Anniversaire': 'Birthday',
  'Arbre': 'Tree',
  'Attachement': 'Attachment',
  'Automne': 'Autumn',
  'Beauté': 'Beauty',
  'Bonheur': 'Happiness',
  'Cadeaux': 'Gifts',
  'Campagne': 'Countryside',
  'Célébration': 'Celebration',
  'Chagrin': 'Grief',
  'Chanson': 'Song',
  'Cheval': 'Horse',
  'Ciel': 'Sky',
  'Cloches': 'Bells',
  'Compagnie': 'Company',
  'Confiance': 'Trust',
  'Convivialité': 'Conviviality',
  'Coordination': 'Coordination',
  'Corps': 'Body',
  'Couleur': 'Color',
  'Courage': 'Courage',
  'Culture': 'Culture',
  'Curiosité': 'Curiosity',
  'Cycle de la vie': 'Cycle of Life',
  'Danger': 'Danger',
  'Danse': 'Dance',
  'Destin': 'Destiny',
  'Deuil': 'Mourning',
  'Douceur': 'Gentleness',
  'Droits humains': 'Human Rights',
  'Eau': 'Water',
  'Encouragement': 'Encouragement',
  'Enfant': 'Child',
  'Ennemi': 'Enemy',
  'Entraide': 'Mutual Aid',
  'Espoir': 'Hope',
  'Expression corporelle': 'Body Expression',
  'Famille': 'Family',
  'Fatigue': 'Fatigue',
  'Festival': 'Festival',
  'Feu': 'Fire',
  'Fidélité': 'Loyalty',
  'Fleurs': 'Flowers',
  'Forêt': 'Forest',
  'Froid': 'Cold',
  'Fruit': 'Fruit',
  'Futur': 'Future',
  'Guerre': 'War',
  'Habitudes': 'Habits',
  'Hiver': 'Winter',
  'Innocence': 'Innocence',
  'Jardin': 'Garden',
  'Jeu': 'Game',
  'Jeunesse': 'Youth',
  'Joie': 'Joy',
  'Jouets': 'Toys',
  'Justice': 'Justice',
  'Lune': 'Moon',
  'Lutte': 'Struggle',
  'Magie de Noël': 'Christmas Magic',
  'Maison': 'Home',
  'Mariage': 'Marriage',
  'Matin': 'Morning',
  'Mer': 'Sea',
  'Monde': 'World',
  'Montagnes': 'Mountains',
  'Mort': 'Death',
  'Mouvement': 'Movement',
  'Musique': 'Music',
  'Mère': 'Mother',
  'Neige': 'Snow',
  'Noël': 'Christmas',
  'Nostalgie': 'Nostalgia',
  'Nourriture': 'Food',
  'Nuit': 'Night',
  'Oiseau': 'Bird',
  'Oiseaux': 'Birds',
  'Papillon': 'Butterfly',
  'Partage': 'Sharing',
  'Passion': 'Passion',
  'Pauvreté': 'Poverty',
  'Paysage': 'Landscape',
  'Persévérance': 'Perseverance',
  'Perte': 'Loss',
  'Peur': 'Fear',
  'Pluie': 'Rain',
  'Printemps': 'Spring',
  'Promesse': 'Promise',
  'Protection': 'Protection',
  'Père': 'Father',
  'Quotidien': 'Daily Life',
  'Regard': 'Gaze',
  'Relation amoureuse': 'Romantic Relationship',
  'Rencontre': 'Encounter',
  'Repos': 'Rest',
  'Résistance': 'Resistance',
  'Rêve': 'Dream',
  'Saison': 'Season',
  'Santé': 'Health',
  'Sentiment': 'Feeling',
  'Soir': 'Evening',
  'Soleil': 'Sun',
  'Solidarité': 'Solidarity',
  'Sommeil': 'Sleep',
  'Souffrance': 'Suffering',
  'Souvenir': 'Memory',
  'Survie': 'Survival',
  'Séduction': 'Seduction',
  'Temps': 'Time',
  'Terre': 'Earth',
  'Tradition': 'Tradition',
  'Train': 'Train',
  'Tranquillité': 'Tranquility',
  'Transport': 'Transportation',
  'Tristesse': 'Sadness',
  'Vent': 'Wind',
  'Vie': 'Life',
  'Village': 'Village',
  'Violence': 'Violence',
  'Vêtements': 'Clothing',
  'Yeux': 'Eyes',
  'École': 'School',
  'Émotion': 'Emotion',
  'Étoile': 'Star',
  'Éducation': 'Education',
}

// =============================================================================
// MIGRATION LOGIC
// =============================================================================

interface MigrationResult {
  updated: string[]
  skipped: string[]
  errors: { name: string; error: string }[]
  notFound: string[]
}

async function migrateCollection(
  payload: any,
  collectionSlug: string,
  translations: Record<string, string>
): Promise<MigrationResult> {
  const results: MigrationResult = {
    updated: [],
    skipped: [],
    errors: [],
    notFound: [],
  }

  // Get all documents from the collection
  const allDocs = await payload.find({
    collection: collectionSlug,
    limit: 1000, // Adjust if needed
    pagination: false,
  })

  for (const doc of allDocs.docs) {
    const frenchName = doc.name as string

    // Skip if already has English translation
    if (doc.nameEn) {
      results.skipped.push(frenchName)
      continue
    }

    // Find translation
    const englishName = translations[frenchName]

    if (!englishName) {
      results.notFound.push(frenchName)
      continue
    }

    try {
      await payload.update({
        collection: collectionSlug,
        id: doc.id,
        data: { nameEn: englishName },
      })
      results.updated.push(frenchName)
    } catch (error: any) {
      results.errors.push({ name: frenchName, error: error.message })
    }
  }

  return results
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = await getPayloadClient()

    const results = {
      languages: await migrateCollection(payload, 'languages', LANGUAGE_TRANSLATIONS),
      genres: await migrateCollection(payload, 'genres', GENRE_TRANSLATIONS),
      themes: await migrateCollection(payload, 'themes', THEME_TRANSLATIONS),
      audiences: await migrateCollection(payload, 'audiences', AUDIENCE_TRANSLATIONS),
      trackTypes: await migrateCollection(payload, 'track-types', TRACK_TYPE_TRANSLATIONS),
    }

    const summary = {
      languages: {
        updated: results.languages.updated.length,
        skipped: results.languages.skipped.length,
        notFound: results.languages.notFound.length,
        errors: results.languages.errors.length,
      },
      genres: {
        updated: results.genres.updated.length,
        skipped: results.genres.skipped.length,
        notFound: results.genres.notFound.length,
        errors: results.genres.errors.length,
      },
      themes: {
        updated: results.themes.updated.length,
        skipped: results.themes.skipped.length,
        notFound: results.themes.notFound.length,
        errors: results.themes.errors.length,
      },
      audiences: {
        updated: results.audiences.updated.length,
        skipped: results.audiences.skipped.length,
        notFound: results.audiences.notFound.length,
        errors: results.audiences.errors.length,
      },
      trackTypes: {
        updated: results.trackTypes.updated.length,
        skipped: results.trackTypes.skipped.length,
        notFound: results.trackTypes.notFound.length,
        errors: results.trackTypes.errors.length,
      },
    }

    // Collect all items that need translations but weren't found
    const missingTranslations = {
      languages: results.languages.notFound,
      genres: results.genres.notFound,
      themes: results.themes.notFound,
      audiences: results.audiences.notFound,
      trackTypes: results.trackTypes.notFound,
    }

    return res.status(200).json({
      message: 'English translations migration complete',
      summary,
      missingTranslations,
      details: results,
    })
  } catch (error: any) {
    console.error('Error migrating translations:', error)
    return res.status(500).json({
      error: 'Failed to migrate translations',
      details: error.message,
    })
  }
}
