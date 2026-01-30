import type { NextApiRequest, NextApiResponse } from 'next'
import { getPayloadClient } from '@/lib/payload'

// =============================================================================
// DATA WITH ENGLISH TRANSLATIONS
// =============================================================================

const LANGUAGES: { name: string; nameEn: string; code: string }[] = [
  { name: 'Albanais', nameEn: 'Albanian', code: 'sq' },
  { name: 'Allemand', nameEn: 'German', code: 'de' },
  { name: 'Alsacien', nameEn: 'Alsatian', code: 'gsw' },
  { name: 'Anglais', nameEn: 'English', code: 'en' },
  { name: 'Arabe', nameEn: 'Arabic', code: 'ar' },
  { name: 'Arapaho', nameEn: 'Arapaho', code: 'arp' },
  { name: 'Arménien', nameEn: 'Armenian', code: 'hy' },
  { name: 'Bambara', nameEn: 'Bambara', code: 'bm' },
  { name: 'BCMS', nameEn: 'BCMS', code: 'sh' },
  { name: 'Brésilien indigène', nameEn: 'Brazilian Indigenous', code: 'pt-BR-ind' },
  { name: 'Bulgare', nameEn: 'Bulgarian', code: 'bg' },
  { name: 'Cap-Verdien', nameEn: 'Cape Verdean Creole', code: 'kea' },
  { name: 'Catalan', nameEn: 'Catalan', code: 'ca' },
  { name: 'Chechen', nameEn: 'Chechen', code: 'ce' },
  { name: 'Créole haïtien', nameEn: 'Haitian Creole', code: 'ht' },
  { name: 'Espagnol', nameEn: 'Spanish', code: 'es' },
  { name: 'Farsi', nameEn: 'Farsi', code: 'fa' },
  { name: 'Français', nameEn: 'French', code: 'fr' },
  { name: 'Gaélique', nameEn: 'Gaelic', code: 'gd' },
  { name: 'Gascon', nameEn: 'Gascon', code: 'oc-gascon' },
  { name: 'Géorgien', nameEn: 'Georgian', code: 'ka' },
  { name: 'Grec', nameEn: 'Greek', code: 'el' },
  { name: 'Hongrois', nameEn: 'Hungarian', code: 'hu' },
  { name: 'Italien', nameEn: 'Italian', code: 'it' },
  { name: 'Judéo-araméen', nameEn: 'Judeo-Aramaic', code: 'jrb' },
  { name: 'Kinyarwanda', nameEn: 'Kinyarwanda', code: 'rw' },
  { name: 'Kurde', nameEn: 'Kurdish', code: 'ku' },
  { name: 'Ladino', nameEn: 'Ladino', code: 'lad' },
  { name: 'Latin', nameEn: 'Latin', code: 'la' },
  { name: 'Letton', nameEn: 'Latvian', code: 'lv' },
  { name: 'Lingala', nameEn: 'Lingala', code: 'ln' },
  { name: 'Lituanien', nameEn: 'Lithuanian', code: 'lt' },
  { name: 'Macédonien', nameEn: 'Macedonian', code: 'mk' },
  { name: 'Maori', nameEn: 'Maori', code: 'mi' },
  { name: 'Néerlandais', nameEn: 'Dutch', code: 'nl' },
  { name: 'Plurilingue', nameEn: 'Multilingual', code: 'mul' },
  { name: 'Polonais', nameEn: 'Polish', code: 'pl' },
  { name: 'Portugais', nameEn: 'Portuguese', code: 'pt' },
  { name: 'Romani', nameEn: 'Romani', code: 'rom' },
  { name: 'Roumain', nameEn: 'Romanian', code: 'ro' },
  { name: 'Russe', nameEn: 'Russian', code: 'ru' },
  { name: 'Slovène', nameEn: 'Slovenian', code: 'sl' },
  { name: 'Suédois', nameEn: 'Swedish', code: 'sv' },
  { name: 'Swahili', nameEn: 'Swahili', code: 'sw' },
  { name: 'Turc', nameEn: 'Turkish', code: 'tr' },
  { name: 'Ukrainien', nameEn: 'Ukrainian', code: 'uk' },
  { name: 'Wolof', nameEn: 'Wolof', code: 'wo' },
  { name: 'Yiddish', nameEn: 'Yiddish', code: 'yi' },
  { name: 'Zulu', nameEn: 'Zulu', code: 'zu' },
]

const GENRES: { name: string; nameEn: string }[] = [
  { name: 'Traditionnel', nameEn: 'Traditional' },
  { name: 'Folk', nameEn: 'Folk' },
  { name: 'Classique', nameEn: 'Classical' },
  { name: 'Populaire', nameEn: 'Popular' },
  { name: 'Berceuse', nameEn: 'Lullaby' },
  { name: 'Comptine', nameEn: 'Nursery Rhyme' },
  { name: 'Chant de travail', nameEn: 'Work Song' },
  { name: 'Chant religieux', nameEn: 'Religious Song' },
  { name: 'Hymne', nameEn: 'Hymn' },
  { name: 'Ballade', nameEn: 'Ballad' },
  { name: 'Blues', nameEn: 'Blues' },
  { name: 'Boléro', nameEn: 'Bolero' },
  { name: 'Canon', nameEn: 'Canon' },
  { name: 'Chant de capoeira', nameEn: 'Capoeira Song' },
  { name: 'Musique celtique', nameEn: 'Celtic Music' },
  { name: 'Chanson', nameEn: 'Song' },
  { name: 'Chanson francophone', nameEn: 'French Song' },
  { name: 'Chanson pour enfants', nameEn: "Children's Song" },
  { name: 'Chant de Noël', nameEn: 'Christmas Carol' },
  { name: 'Chanson de Noël', nameEn: 'Christmas Song' },
  { name: 'Chant choral', nameEn: 'Choral Song' },
  { name: 'Coladeira', nameEn: 'Coladeira' },
  { name: 'Country', nameEn: 'Country' },
  { name: 'Cumbia', nameEn: 'Cumbia' },
  { name: 'Disco', nameEn: 'Disco' },
  { name: 'Chanson festive', nameEn: 'Festive Song' },
  { name: 'Musique de film', nameEn: 'Film Music' },
  { name: 'Flamenco', nameEn: 'Flamenco' },
  { name: 'Folk rock', nameEn: 'Folk Rock' },
  { name: 'Chanson tzigane', nameEn: 'Gypsy Song' },
  { name: 'Jazz', nameEn: 'Jazz' },
  { name: 'Klezmer', nameEn: 'Klezmer' },
  { name: 'Kolo', nameEn: 'Kolo' },
  { name: 'Chanson médiévale', nameEn: 'Medieval Song' },
  { name: 'Morna', nameEn: 'Morna' },
  { name: 'Comédie musicale', nameEn: 'Musical' },
  { name: 'Chanson napolitaine', nameEn: 'Neapolitan Song' },
  { name: 'Negro spiritual', nameEn: 'Negro Spiritual' },
  { name: 'Opéra', nameEn: 'Opera' },
  { name: 'Pastorale', nameEn: 'Pastoral' },
  { name: 'Pavane', nameEn: 'Pavane' },
  { name: 'Chant polyphonique', nameEn: 'Polyphonic Song' },
  { name: 'Pop', nameEn: 'Pop' },
  { name: 'Chanson engagée', nameEn: 'Protest Song' },
  { name: 'Reggae', nameEn: 'Reggae' },
  { name: 'Chanson de la Renaissance', nameEn: 'Renaissance Song' },
  { name: 'Rock', nameEn: 'Rock' },
  { name: 'Opéra rock', nameEn: 'Rock Opera' },
  { name: 'Romane Chave', nameEn: 'Romane Chave' },
  { name: 'Musique romantique', nameEn: 'Romantic Music' },
  { name: 'Rondeau', nameEn: 'Rondeau' },
  { name: 'Rumba flamenca', nameEn: 'Flamenco Rumba' },
  { name: 'Danse écossaise', nameEn: 'Scottish Dance' },
  { name: 'Séfarade', nameEn: 'Sephardic' },
  { name: 'Sépharade', nameEn: 'Sephardic' },
  { name: 'Sevdalinka', nameEn: 'Sevdalinka' },
  { name: 'Singspiegel', nameEn: 'Singspiegel' },
  { name: 'Starogradska', nameEn: 'Starogradska' },
  { name: 'Tango', nameEn: 'Tango' },
  { name: 'Danse traditionnelle', nameEn: 'Traditional Dance' },
  { name: 'Musique traditionnelle', nameEn: 'Traditional Music' },
  { name: 'Chanson traditionnelle', nameEn: 'Traditional Song' },
  { name: 'Tryndytchka', nameEn: 'Tryndytchka' },
  { name: 'Chanson enfantine', nameEn: "Children's Song" },
  { name: 'Chanson française', nameEn: 'French Song' },
  { name: 'Chant de la Renaissance', nameEn: 'Renaissance Song' },
  { name: 'Chant médiéval', nameEn: 'Medieval Song' },
  { name: 'Chant traditionnel', nameEn: 'Traditional Song' },
  { name: 'Danse de recrutement', nameEn: 'Recruitment Dance' },
  { name: 'Danse scottish', nameEn: 'Scottish Dance' },
  { name: 'Jazz manouche', nameEn: 'Gypsy Jazz' },
  { name: 'Kasatchok', nameEn: 'Kazachok' },
  { name: 'Musique classique', nameEn: 'Classical Music' },
  { name: 'Musique de capoeira', nameEn: 'Capoeira Music' },
  { name: 'Musique médiévale', nameEn: 'Medieval Music' },
  { name: 'Musique pour choeur', nameEn: 'Choral Music' },
  { name: 'Musique tsigane', nameEn: 'Gypsy Music' },
  { name: 'Rock folk', nameEn: 'Folk Rock' },
  { name: 'Sirba', nameEn: 'Sirba' },
  { name: 'Swing', nameEn: 'Swing' },
  { name: 'Tarentelle', nameEn: 'Tarantella' },
  { name: 'Valse', nameEn: 'Waltz' },
  { name: 'Verbunkos', nameEn: 'Verbunkos' },
  { name: 'Chant de résistance', nameEn: 'Resistance Song' },
]

const AUDIENCES: { name: string; nameEn: string }[] = [
  { name: 'Enfants', nameEn: 'Children' },
  { name: 'Adolescents', nameEn: 'Teenagers' },
  { name: 'Adultes', nameEn: 'Adults' },
  { name: 'Tous publics', nameEn: 'All Audiences' },
  { name: 'Scolaire', nameEn: 'School' },
  { name: 'Famille', nameEn: 'Family' },
]

const THEMES: { name: string; nameEn: string }[] = [
  { name: 'Amour', nameEn: 'Love' },
  { name: 'Nature', nameEn: 'Nature' },
  { name: 'Fête', nameEn: 'Celebration' },
  { name: 'Voyage', nameEn: 'Travel' },
  { name: 'Histoire', nameEn: 'History' },
  { name: 'Enfance', nameEn: 'Childhood' },
  { name: 'Travail', nameEn: 'Work' },
  { name: 'Liberté', nameEn: 'Freedom' },
  { name: 'Abandon', nameEn: 'Abandonment' },
  { name: 'Abris', nameEn: 'Shelter' },
  { name: 'Amitié', nameEn: 'Friendship' },
  { name: 'Animaux', nameEn: 'Animals' },
  { name: 'Anniversaire', nameEn: 'Birthday' },
  { name: 'Arbre', nameEn: 'Tree' },
  { name: 'Attachement', nameEn: 'Attachment' },
  { name: 'Automne', nameEn: 'Autumn' },
  { name: 'Beauté', nameEn: 'Beauty' },
  { name: 'Bonheur', nameEn: 'Happiness' },
  { name: 'Cadeaux', nameEn: 'Gifts' },
  { name: 'Campagne', nameEn: 'Countryside' },
  { name: 'Célébration', nameEn: 'Celebration' },
  { name: 'Chagrin', nameEn: 'Grief' },
  { name: 'Chanson', nameEn: 'Song' },
  { name: 'Cheval', nameEn: 'Horse' },
  { name: 'Ciel', nameEn: 'Sky' },
  { name: 'Cloches', nameEn: 'Bells' },
  { name: 'Compagnie', nameEn: 'Company' },
  { name: 'Confiance', nameEn: 'Trust' },
  { name: 'Convivialité', nameEn: 'Conviviality' },
  { name: 'Coordination', nameEn: 'Coordination' },
  { name: 'Corps', nameEn: 'Body' },
  { name: 'Couleur', nameEn: 'Color' },
  { name: 'Courage', nameEn: 'Courage' },
  { name: 'Culture', nameEn: 'Culture' },
  { name: 'Curiosité', nameEn: 'Curiosity' },
  { name: 'Cycle de la vie', nameEn: 'Cycle of Life' },
  { name: 'Danger', nameEn: 'Danger' },
  { name: 'Danse', nameEn: 'Dance' },
  { name: 'Destin', nameEn: 'Destiny' },
  { name: 'Deuil', nameEn: 'Mourning' },
  { name: 'Douceur', nameEn: 'Gentleness' },
  { name: 'Droits humains', nameEn: 'Human Rights' },
  { name: 'Eau', nameEn: 'Water' },
  { name: 'Encouragement', nameEn: 'Encouragement' },
  { name: 'Enfant', nameEn: 'Child' },
  { name: 'Ennemi', nameEn: 'Enemy' },
  { name: 'Entraide', nameEn: 'Mutual Aid' },
  { name: 'Espoir', nameEn: 'Hope' },
  { name: 'Expression corporelle', nameEn: 'Body Expression' },
  { name: 'Famille', nameEn: 'Family' },
  { name: 'Fatigue', nameEn: 'Fatigue' },
  { name: 'Festival', nameEn: 'Festival' },
  { name: 'Feu', nameEn: 'Fire' },
  { name: 'Fidélité', nameEn: 'Loyalty' },
  { name: 'Fleurs', nameEn: 'Flowers' },
  { name: 'Forêt', nameEn: 'Forest' },
  { name: 'Froid', nameEn: 'Cold' },
  { name: 'Fruit', nameEn: 'Fruit' },
  { name: 'Futur', nameEn: 'Future' },
  { name: 'Guerre', nameEn: 'War' },
  { name: 'Habitudes', nameEn: 'Habits' },
  { name: 'Hiver', nameEn: 'Winter' },
  { name: 'Innocence', nameEn: 'Innocence' },
  { name: 'Jardin', nameEn: 'Garden' },
  { name: 'Jeu', nameEn: 'Game' },
  { name: 'Jeunesse', nameEn: 'Youth' },
  { name: 'Joie', nameEn: 'Joy' },
  { name: 'Jouets', nameEn: 'Toys' },
  { name: 'Justice', nameEn: 'Justice' },
  { name: 'Lune', nameEn: 'Moon' },
  { name: 'Lutte', nameEn: 'Struggle' },
  { name: 'Magie de Noël', nameEn: 'Christmas Magic' },
  { name: 'Maison', nameEn: 'Home' },
  { name: 'Mariage', nameEn: 'Marriage' },
  { name: 'Matin', nameEn: 'Morning' },
  { name: 'Mer', nameEn: 'Sea' },
  { name: 'Monde', nameEn: 'World' },
  { name: 'Montagnes', nameEn: 'Mountains' },
  { name: 'Mort', nameEn: 'Death' },
  { name: 'Mouvement', nameEn: 'Movement' },
  { name: 'Musique', nameEn: 'Music' },
  { name: 'Mère', nameEn: 'Mother' },
  { name: 'Neige', nameEn: 'Snow' },
  { name: 'Noël', nameEn: 'Christmas' },
  { name: 'Nostalgie', nameEn: 'Nostalgia' },
  { name: 'Nourriture', nameEn: 'Food' },
  { name: 'Nuit', nameEn: 'Night' },
  { name: 'Oiseau', nameEn: 'Bird' },
  { name: 'Oiseaux', nameEn: 'Birds' },
  { name: 'Papillon', nameEn: 'Butterfly' },
  { name: 'Partage', nameEn: 'Sharing' },
  { name: 'Passion', nameEn: 'Passion' },
  { name: 'Pauvreté', nameEn: 'Poverty' },
  { name: 'Paysage', nameEn: 'Landscape' },
  { name: 'Persévérance', nameEn: 'Perseverance' },
  { name: 'Perte', nameEn: 'Loss' },
  { name: 'Peur', nameEn: 'Fear' },
  { name: 'Pluie', nameEn: 'Rain' },
  { name: 'Printemps', nameEn: 'Spring' },
  { name: 'Promesse', nameEn: 'Promise' },
  { name: 'Protection', nameEn: 'Protection' },
  { name: 'Père', nameEn: 'Father' },
  { name: 'Quotidien', nameEn: 'Daily Life' },
  { name: 'Regard', nameEn: 'Gaze' },
  { name: 'Relation amoureuse', nameEn: 'Romantic Relationship' },
  { name: 'Rencontre', nameEn: 'Encounter' },
  { name: 'Repos', nameEn: 'Rest' },
  { name: 'Résistance', nameEn: 'Resistance' },
  { name: 'Rêve', nameEn: 'Dream' },
  { name: 'Saison', nameEn: 'Season' },
  { name: 'Santé', nameEn: 'Health' },
  { name: 'Sentiment', nameEn: 'Feeling' },
  { name: 'Soir', nameEn: 'Evening' },
  { name: 'Soleil', nameEn: 'Sun' },
  { name: 'Solidarité', nameEn: 'Solidarity' },
  { name: 'Sommeil', nameEn: 'Sleep' },
  { name: 'Souffrance', nameEn: 'Suffering' },
  { name: 'Souvenir', nameEn: 'Memory' },
  { name: 'Survie', nameEn: 'Survival' },
  { name: 'Séduction', nameEn: 'Seduction' },
  { name: 'Temps', nameEn: 'Time' },
  { name: 'Terre', nameEn: 'Earth' },
  { name: 'Tradition', nameEn: 'Tradition' },
  { name: 'Train', nameEn: 'Train' },
  { name: 'Tranquillité', nameEn: 'Tranquility' },
  { name: 'Transport', nameEn: 'Transportation' },
  { name: 'Tristesse', nameEn: 'Sadness' },
  { name: 'Vent', nameEn: 'Wind' },
  { name: 'Vie', nameEn: 'Life' },
  { name: 'Village', nameEn: 'Village' },
  { name: 'Violence', nameEn: 'Violence' },
  { name: 'Vêtements', nameEn: 'Clothing' },
  { name: 'Yeux', nameEn: 'Eyes' },
  { name: 'École', nameEn: 'School' },
  { name: 'Émotion', nameEn: 'Emotion' },
  { name: 'Étoile', nameEn: 'Star' },
  { name: 'Éducation', nameEn: 'Education' },
]

const TRACK_TYPES: { name: string; nameEn: string; slug: string }[] = [
  { name: 'Groupe', nameEn: 'Full Band', slug: 'groupe' },
  { name: 'Violon', nameEn: 'Violin', slug: 'violon' },
  { name: 'Chant', nameEn: 'Vocals', slug: 'chant' },
  { name: 'Guitare', nameEn: 'Guitar', slug: 'guitare' },
  { name: 'Percussion', nameEn: 'Percussion', slug: 'percussion' },
]

// =============================================================================
// SEEDING FUNCTIONS
// =============================================================================

interface SeedResult {
  created: string[]
  skipped: string[]
  errors: { name: string; error: string }[]
}

async function seedCollectionWithTranslation(
  payload: any,
  collectionSlug: string,
  items: { name: string; nameEn: string }[]
): Promise<SeedResult> {
  const results: SeedResult = {
    created: [],
    skipped: [],
    errors: [],
  }

  for (const item of items) {
    const existing = await payload.find({
      collection: collectionSlug,
      where: { name: { equals: item.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      results.skipped.push(item.name)
      continue
    }

    try {
      await payload.create({
        collection: collectionSlug,
        data: { name: item.name, nameEn: item.nameEn },
      })
      results.created.push(item.name)
    } catch (error: any) {
      results.errors.push({ name: item.name, error: error.message })
    }
  }

  return results
}

async function seedLanguages(payload: any): Promise<SeedResult> {
  const results: SeedResult = {
    created: [],
    skipped: [],
    errors: [],
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
        data: { name: lang.name, nameEn: lang.nameEn, code: lang.code },
      })
      results.created.push(lang.name)
    } catch (error: any) {
      results.errors.push({ name: lang.name, error: error.message })
    }
  }

  return results
}

async function seedTrackTypes(payload: any): Promise<SeedResult> {
  const results: SeedResult = {
    created: [],
    skipped: [],
    errors: [],
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
        data: { name: trackType.name, nameEn: trackType.nameEn, slug: trackType.slug },
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
      genres: await seedCollectionWithTranslation(payload, 'genres', GENRES),
      audiences: await seedCollectionWithTranslation(payload, 'audiences', AUDIENCES),
      themes: await seedCollectionWithTranslation(payload, 'themes', THEMES),
      trackTypes: await seedTrackTypes(payload),
    }

    const summary = {
      languages: {
        created: results.languages.created.length,
        skipped: results.languages.skipped.length,
        errors: results.languages.errors.length,
      },
      genres: {
        created: results.genres.created.length,
        skipped: results.genres.skipped.length,
        errors: results.genres.errors.length,
      },
      audiences: {
        created: results.audiences.created.length,
        skipped: results.audiences.skipped.length,
        errors: results.audiences.errors.length,
      },
      themes: {
        created: results.themes.created.length,
        skipped: results.themes.skipped.length,
        errors: results.themes.errors.length,
      },
      trackTypes: {
        created: results.trackTypes.created.length,
        skipped: results.trackTypes.skipped.length,
        errors: results.trackTypes.errors.length,
      },
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
