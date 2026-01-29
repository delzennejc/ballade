import { Song } from "@/types/song"

export const songs: Song[] = [
  {
    id: "1",
    slug: "a-la-claire-fontaine",
    title: "A LA CLAIRE FONTAINE",
    thumbnail: "/image-chanson.png",
    metadata: {
      countries: ["France"],
      languages: ["Français"],
      genres: ["Traditionnel"],
      audience: ["Enfants", "Ados", "Adultes", "Séniors"],
      difficulty: "Facile",
      themes: ["Nature", "Amour", "Nostalgie"],
    },
    lyrics: [
      {
        language: "Français",
        languageCode: "fr",
        text: `À la claire fontaine
M'en allant promener
J'ai trouvé l'eau si belle
Que je m'y suis baigné

Il y a longtemps que je t'aime
Jamais je ne t'oublierai

Sous les feuilles d'un chêne
Je me suis fait sécher
Sur la plus haute branche
Un rossignol chantait

Il y a longtemps que je t'aime
Jamais je ne t'oublierai

Chante, rossignol, chante
Toi qui as le cœur gai
Tu as le cœur à rire
Moi je l'ai à pleurer

Il y a longtemps que je t'aime
Jamais je ne t'oublierai`,
        translations: [
          {
            language: "English",
            languageCode: "en",
            text: `At the clear fountain
While I was walking
I found the water so beautiful
That I bathed in it

I have loved you for a long time
I will never forget you

Under the leaves of an oak
I dried myself
On the highest branch
A nightingale was singing

I have loved you for a long time
I will never forget you

Sing, nightingale, sing
You who have a cheerful heart
You have a heart for laughter
I have one for crying

I have loved you for a long time
I will never forget you`,
          },
          {
            language: "Español",
            languageCode: "es",
            text: `En la fuente clara
Mientras paseaba
Encontré el agua tan bella
Que me bañé en ella

Te he amado por mucho tiempo
Nunca te olvidaré`,
          },
        ],
      },
      {
        language: "English",
        languageCode: "en",
        text: `At the clear fountain
While I was walking
I found the water so beautiful
That I bathed in it

I have loved you for a long time
I will never forget you

Under the leaves of an oak
I dried myself
On the highest branch
A nightingale was singing

I have loved you for a long time
I will never forget you`,
        translations: [],
      },
    ],
    musicSheet: [
      {
        language: "Français",
        languageCode: "fr",
        pdf: "/score.pdf",
      },
    ],
    history: [
      {
        language: "Français",
        languageCode: "fr",
        pdf: "/history-fr.pdf",
      },
    ],
    audioTracks: [
      { track: "groupe", trackName: "Audio groupe", versions: [{ id: "groupe-fr", name: "Français" }] },
      { track: "violon", trackName: "Audio violon", versions: [{ id: "violon-fr", name: "Français" }] },
      { track: "chant", trackName: "Audio chant", versions: [{ id: "chant-fr", name: "Français" }] },
      { track: "guitare", trackName: "Audio guitare", versions: [{ id: "guitare-fr", name: "Français" }] },
    ],
  },
  {
    id: "2",
    slug: "bella-ciao",
    title: "BELLA CIAO",
    thumbnail: "/image-chanson.png",
    metadata: {
      countries: ["Italie"],
      languages: ["Italien"],
      genres: ["Chant de résistance", "Folk"],
      audience: ["Ados", "Adultes", "Séniors"],
      difficulty: "Intermédiaire",
      themes: ["Résistance", "Liberté", "Histoire"],
    },
    lyrics: [
      {
        language: "Italien",
        languageCode: "it",
        text: `Una mattina mi son svegliato
O bella ciao, bella ciao, bella ciao ciao ciao
Una mattina mi son svegliato
E ho trovato l'invasor

O partigiano portami via
O bella ciao, bella ciao, bella ciao ciao ciao
O partigiano portami via
Che mi sento di morir

E se io muoio da partigiano
O bella ciao, bella ciao, bella ciao ciao ciao
E se io muoio da partigiano
Tu mi devi seppellir

Seppellire lassù in montagna
O bella ciao, bella ciao, bella ciao ciao ciao
Seppellire lassù in montagna
Sotto l'ombra di un bel fior`,
        translations: [
          {
            language: "Français",
            languageCode: "fr",
            text: `Un beau matin, je me suis réveillé
O bella ciao, bella ciao, bella ciao ciao ciao
Un beau matin, je me suis réveillé
Et j'ai trouvé l'envahisseur

O partisan, emmène-moi
O bella ciao, bella ciao, bella ciao ciao ciao
O partisan, emmène-moi
Car je sens que je vais mourir

Et si je meurs en partisan
O bella ciao, bella ciao, bella ciao ciao ciao
Et si je meurs en partisan
Tu devras m'enterrer

Enterre-moi là-haut dans la montagne
O bella ciao, bella ciao, bella ciao ciao ciao
Enterre-moi là-haut dans la montagne
Sous l'ombre d'une belle fleur`,
          },
          {
            language: "English",
            languageCode: "en",
            text: `One morning I woke up
O bella ciao, bella ciao, bella ciao ciao ciao
One morning I woke up
And I found the invader

O partisan, take me away
O bella ciao, bella ciao, bella ciao ciao ciao
O partisan, take me away
Because I feel I'm going to die`,
          },
        ],
      },
      {
        language: "Français",
        languageCode: "fr",
        text: `Un beau matin, je me suis réveillé
O bella ciao, bella ciao, bella ciao ciao ciao
Un beau matin, je me suis réveillé
Et j'ai trouvé l'envahisseur

O partisan, emmène-moi
O bella ciao, bella ciao, bella ciao ciao ciao
O partisan, emmène-moi
Car je sens que je vais mourir`,
        translations: [],
      },
    ],
    musicSheet: [
      {
        language: "Français",
        languageCode: "fr",
        pdf: "/score.pdf",
      },
    ],
    history: [
      {
        language: "Français",
        languageCode: "fr",
        pdf: "/history-fr.pdf",
      },
    ],
    audioTracks: [
      { track: "groupe", trackName: "Audio groupe", versions: [{ id: "groupe-it", name: "Italien" }] },
      {
        track: "violon",
        trackName: "Audio violon",
        versions: [
          { id: "violon-chorus", name: "Chorus" },
          { id: "violon-verse", name: "Verse" },
          { id: "violon-part1", name: "Part 1" },
          { id: "violon-part2", name: "Part 2" },
        ],
      },
      {
        track: "chant",
        trackName: "Audio chant",
        versions: [
          { id: "chant-de", name: "Allemand" },
          { id: "chant-en", name: "Anglais" },
          { id: "chant-ar", name: "Arabe" },
          { id: "chant-es", name: "Espagnol" },
          { id: "chant-fr", name: "Français" },
          { id: "chant-it", name: "Italien" },
          { id: "chant-tr", name: "Turque" },
          { id: "chant-uk", name: "Ukrainien" },
        ],
      },
      { track: "guitare", trackName: "Audio guitare", versions: [{ id: "guitare-it", name: "Italien" }] },
      {
        track: "percussion",
        trackName: "Audio percussions",
        versions: [{ id: "percussion-it", name: "Italien" }],
      },
    ],
  },
  {
    id: "3",
    slug: "ah-vous-dirai-je-maman",
    title: "AH VOUS DIRAI-JE MAMAN",
    thumbnail: "/image-chanson.png",
    metadata: {
      countries: ["France"],
      languages: ["Français"],
      genres: ["Chanson enfantine", "Comptine"],
      audience: ["Enfants", "Ados", "Adultes", "Séniors"],
      difficulty: "Facile",
      themes: ["Enfance", "Famille", "Éducation"],
    },
    lyrics: [
      {
        language: "Français",
        languageCode: "fr",
        text: `Ah ! Vous dirai-je, maman,
Ce qui cause mon tourment ?
Papa veut que je raisonne
Comme une grande personne ;
Moi, je dis que les bonbons
Valent mieux que la raison.

Ah ! Vous dirai-je, maman,
Ce qui cause mon tourment ?
Papa veut que je demande
De la soupe et de la viande ;
Moi, je dis que les bonbons
Valent mieux que les mignons.`,
        translations: [
          {
            language: "English",
            languageCode: "en",
            text: `Ah! Let me tell you, mother,
What causes my torment?
Father wants me to reason
Like a grown-up person;
I say that sweets
Are better than reason.

Ah! Let me tell you, mother,
What causes my torment?
Father wants me to ask for
Soup and meat;
I say that sweets
Are better than the little ones.`,
          },
        ],
      },
    ],
    musicSheet: [
      {
        language: "Français",
        languageCode: "fr",
        pdf: "/score.pdf",
      },
    ],
    history: [
      {
        language: "Français",
        languageCode: "fr",
        pdf: "/history-fr.pdf",
      },
    ],
    audioTracks: [
      { track: "groupe", trackName: "Audio groupe", versions: [{ id: "groupe-fr", name: "Français" }] },
      { track: "chant", trackName: "Audio chant", versions: [{ id: "chant-fr", name: "Français" }] },
      { track: "violon", trackName: "Audio violon", versions: [{ id: "violon-fr", name: "Français" }] },
    ],
  },
]

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug)
}

export function getAllSongSlugs(): string[] {
  return songs.map((song) => song.slug)
}
