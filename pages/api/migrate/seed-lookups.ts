import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

// Data from FilterModal.tsx with ISO 639 codes + additional languages from CSV
const LANGUAGES: { name: string; code: string }[] = [
  { name: 'Albanais', code: 'sq' },
  { name: 'Allemand', code: 'de' },
  { name: 'Alsacien', code: 'gsw' },
  { name: 'Anglais', code: 'en' },
  { name: 'Arabe', code: 'ar' },
  { name: 'Arapaho', code: 'arp' },
  { name: 'Arménien', code: 'hy' },
  { name: 'Bambara', code: 'bm' },
  { name: 'BCMS', code: 'sh' }, // Serbo-Croatian
  { name: 'Brésilien indigène', code: 'pt-BR-ind' },
  { name: 'Bulgare', code: 'bg' },
  { name: 'Cap-Verdien', code: 'kea' }, // Cape Verdean Creole
  { name: 'Catalan', code: 'ca' },
  { name: 'Chechen', code: 'ce' },
  { name: 'Créole haïtien', code: 'ht' }, // Haitian Creole
  { name: 'Espagnol', code: 'es' },
  { name: 'Farsi', code: 'fa' },
  { name: 'Français', code: 'fr' },
  { name: 'Gaélique', code: 'gd' },
  { name: 'Gascon', code: 'oc-gascon' },
  { name: 'Géorgien', code: 'ka' },
  { name: 'Grec', code: 'el' },
  { name: 'Hongrois', code: 'hu' },
  { name: 'Italien', code: 'it' },
  { name: 'Judéo-araméen', code: 'jrb' }, // Judaeo-Aramaic
  { name: 'Kinyarwanda', code: 'rw' },
  { name: 'Kurde', code: 'ku' },
  { name: 'Ladino', code: 'lad' },
  { name: 'Latin', code: 'la' },
  { name: 'Letton', code: 'lv' },
  { name: 'Lingala', code: 'ln' },
  { name: 'Lituanien', code: 'lt' },
  { name: 'Macédonien', code: 'mk' },
  { name: 'Maori', code: 'mi' },
  { name: 'Néerlandais', code: 'nl' },
  { name: 'Plurilingue', code: 'mul' }, // Multiple languages
  { name: 'Polonais', code: 'pl' },
  { name: 'Portugais', code: 'pt' },
  { name: 'Romani', code: 'rom' },
  { name: 'Roumain', code: 'ro' },
  { name: 'Russe', code: 'ru' },
  { name: 'Slovène', code: 'sl' },
  { name: 'Suédois', code: 'sv' },
  { name: 'Swahili', code: 'sw' },
  { name: 'Turc', code: 'tr' },
  { name: 'Ukrainien', code: 'uk' },
  { name: 'Wolof', code: 'wo' },
  { name: 'Yiddish', code: 'yi' },
  { name: 'Zulu', code: 'zu' },
]

const GENRES = [
  // Genres en français
  'Traditionnel',
  'Folk',
  'Classique',
  'Populaire',
  'Berceuse',
  'Comptine',
  'Chant de travail',
  'Chant religieux',
  'Hymne',
  'Ballade',
  'Blues',
  'Boléro',
  'Canon',
  'Chant de capoeira',
  'Musique celtique',
  'Chanson',
  'Chanson francophone',
  'Chanson pour enfants',
  'Chant de Noël',
  'Chanson de Noël',
  'Chant choral',
  'Coladeira',
  'Country',
  'Cumbia',
  'Disco',
  'Chanson festive',
  'Musique de film',
  'Flamenco',
  'Folk rock',
  'Chanson tzigane',
  'Jazz',
  'Klezmer',
  'Kolo',
  'Chanson médiévale',
  'Morna',
  'Comédie musicale',
  'Chanson napolitaine',
  'Negro spiritual',
  'Opéra',
  'Pastorale',
  'Pavane',
  'Chant polyphonique',
  'Pop',
  'Chanson engagée',
  'Reggae',
  'Chanson de la Renaissance',
  'Rock',
  'Opéra rock',
  'Romane Chave',
  'Musique romantique',
  'Rondeau',
  'Rumba flamenca',
  'Danse écossaise',
  'Séfarade',
  'Sépharade',
  'Sevdalinka',
  'Singspiegel',
  'Starogradska',
  'Tango',
  'Danse traditionnelle',
  'Musique traditionnelle',
  'Chanson traditionnelle',
  'Tryndytchka',
  // Genres additionnels du CSV (Style musical)
  'Chanson enfantine',
  'Chanson française',
  'Chant de la Renaissance',
  'Chant médiéval',
  'Chant traditionnel',
  'Danse de recrutement',
  'Danse scottish',
  'Jazz manouche',
  'Kasatchok',
  'Musique classique',
  'Musique de capoeira',
  'Musique médiévale',
  'Musique pour choeur',
  'Musique tsigane',
  'Rock folk',
  'Sirba',
  'Swing',
  'Tarentelle',
  'Valse',
  'Verbunkos',
]

const AUDIENCES = [
  'Enfants',
  'Adolescents',
  'Adultes',
  'Tous publics',
  'Scolaire',
  'Famille',
]

const THEMES = [
  // Thèmes principaux
  'Amour',
  'Nature',
  'Fête',
  'Voyage',
  'Histoire',
  'Enfance',
  'Travail',
  'Liberté',
  // Thèmes additionnels du CSV
  'Abandon',
  'Abris',
  'Amitié',
  'Animaux',
  'Anniversaire',
  'Arbre',
  'Attachement',
  'Automne',
  'Beauté',
  'Bonheur',
  'Cadeaux',
  'Campagne',
  'Célébration',
  'Chagrin',
  'Chanson',
  'Cheval',
  'Ciel',
  'Cloches',
  'Compagnie',
  'Confiance',
  'Convivialité',
  'Coordination',
  'Corps',
  'Couleur',
  'Courage',
  'Culture',
  'Curiosité',
  'Cycle de la vie',
  'Danger',
  'Danse',
  'Destin',
  'Deuil',
  'Douceur',
  'Droits humains',
  'Eau',
  'Encouragement',
  'Enfant',
  'Ennemi',
  'Entraide',
  'Espoir',
  'Expression corporelle',
  'Famille',
  'Fatigue',
  'Festival',
  'Feu',
  'Fidélité',
  'Fleurs',
  'Forêt',
  'Froid',
  'Fruit',
  'Futur',
  'Guerre',
  'Habitudes',
  'Hiver',
  'Innocence',
  'Jardin',
  'Jeu',
  'Jeunesse',
  'Joie',
  'Jouets',
  'Justice',
  'Lune',
  'Lutte',
  'Magie de Noël',
  'Maison',
  'Mariage',
  'Matin',
  'Mer',
  'Monde',
  'Montagnes',
  'Mort',
  'Mouvement',
  'Musique',
  'Mère',
  'Neige',
  'Noël',
  'Nostalgie',
  'Nourriture',
  'Nuit',
  'Oiseau',
  'Oiseaux',
  'Papillon',
  'Partage',
  'Passion',
  'Pauvreté',
  'Paysage',
  'Persévérance',
  'Perte',
  'Peur',
  'Pluie',
  'Printemps',
  'Promesse',
  'Protection',
  'Père',
  'Quotidien',
  'Regard',
  'Relation amoureuse',
  'Rencontre',
  'Repos',
  'Résistance',
  'Rêve',
  'Saison',
  'Santé',
  'Sentiment',
  'Soir',
  'Soleil',
  'Solidarité',
  'Sommeil',
  'Souffrance',
  'Souvenir',
  'Survie',
  'Séduction',
  'Temps',
  'Terre',
  'Tradition',
  'Train',
  'Tranquillité',
  'Transport',
  'Tristesse',
  'Vent',
  'Vie',
  'Village',
  'Violence',
  'Vêtements',
  'Yeux',
  'École',
  'Émotion',
  'Étoile',
]

const TRACK_TYPES = [
  { name: 'Groupe', slug: 'groupe' },
  { name: 'Violon', slug: 'violon' },
  { name: 'Chant', slug: 'chant' },
  { name: 'Guitare', slug: 'guitare' },
  { name: 'Percussion', slug: 'percussion' },
]

async function seedCollection(
  payload: any,
  collectionSlug: string,
  items: string[]
): Promise<{ created: string[]; skipped: string[]; errors: { name: string; error: string }[] }> {
  const results = {
    created: [] as string[],
    skipped: [] as string[],
    errors: [] as { name: string; error: string }[],
  }

  for (const name of items) {
    const existing = await payload.find({
      collection: collectionSlug,
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      results.skipped.push(name)
      continue
    }

    try {
      await payload.create({
        collection: collectionSlug,
        data: { name },
      })
      results.created.push(name)
    } catch (error: any) {
      results.errors.push({ name, error: error.message })
    }
  }

  return results
}

async function seedLanguages(
  payload: any
): Promise<{ created: string[]; skipped: string[]; errors: { name: string; error: string }[] }> {
  const results = {
    created: [] as string[],
    skipped: [] as string[],
    errors: [] as { name: string; error: string }[],
  }

  for (const lang of LANGUAGES) {
    const existing = await payload.find({
      collection: 'languages',
      where: { name: { equals: lang.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      results.skipped.push(lang.name)
      continue
    }

    try {
      await payload.create({
        collection: 'languages',
        data: { name: lang.name, code: lang.code },
      })
      results.created.push(lang.name)
    } catch (error: any) {
      results.errors.push({ name: lang.name, error: error.message })
    }
  }

  return results
}

async function seedTrackTypes(
  payload: any
): Promise<{ created: string[]; skipped: string[]; errors: { name: string; error: string }[] }> {
  const results = {
    created: [] as string[],
    skipped: [] as string[],
    errors: [] as { name: string; error: string }[],
  }

  for (const trackType of TRACK_TYPES) {
    const existing = await payload.find({
      collection: 'track-types',
      where: { slug: { equals: trackType.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      results.skipped.push(trackType.name)
      continue
    }

    try {
      await payload.create({
        collection: 'track-types',
        data: { name: trackType.name, slug: trackType.slug },
      })
      results.created.push(trackType.name)
    } catch (error: any) {
      results.errors.push({ name: trackType.name, error: error.message })
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
      languages: await seedLanguages(payload),
      genres: await seedCollection(payload, 'genres', GENRES),
      audiences: await seedCollection(payload, 'audiences', AUDIENCES),
      themes: await seedCollection(payload, 'themes', THEMES),
      trackTypes: await seedTrackTypes(payload),
    }

    const summary = {
      languages: { created: results.languages.created.length, skipped: results.languages.skipped.length, errors: results.languages.errors.length },
      genres: { created: results.genres.created.length, skipped: results.genres.skipped.length, errors: results.genres.errors.length },
      audiences: { created: results.audiences.created.length, skipped: results.audiences.skipped.length, errors: results.audiences.errors.length },
      themes: { created: results.themes.created.length, skipped: results.themes.skipped.length, errors: results.themes.errors.length },
      trackTypes: { created: results.trackTypes.created.length, skipped: results.trackTypes.skipped.length, errors: results.trackTypes.errors.length },
    }

    return res.status(200).json({
      message: 'Lookup tables seeding complete',
      summary,
      details: results,
    })
  } catch (error: any) {
    console.error('Error seeding lookups:', error)
    return res.status(500).json({
      error: 'Failed to seed lookups',
      details: error.message,
    })
  }
}
