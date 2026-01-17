import { Song } from '@/types/song';

export const songs: Song[] = [
  {
    id: '1',
    slug: 'a-la-claire-fontaine',
    title: 'A LA CLAIRE FONTAINE',
    thumbnail: '/image-chanson.png',
    metadata: {
      country: 'France',
      language: 'Français',
      genres: ['Traditionnel'],
      audience: ['Enfants', 'Ados', 'Adultes', 'Séniors'],
      difficulty: 'Facile',
      themes: ['Nature', 'Amour', 'Nostalgie'],
    },
    lyrics: [
      {
        language: 'Français',
        languageCode: 'fr',
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
      },
      {
        language: 'English',
        languageCode: 'en',
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
      },
    ],
    translations: [
      {
        language: 'English',
        languageCode: 'en',
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
        language: 'Español',
        languageCode: 'es',
        text: `En la fuente clara
Mientras paseaba
Encontré el agua tan bella
Que me bañé en ella

Te he amado por mucho tiempo
Nunca te olvidaré`,
      },
    ],
    sheetMusic: `X:1
T:A la claire fontaine
M:3/4
L:1/8
K:G
"G"D2 G2 A2|"C"B4 A2|"G"G2 E2 D2|"D7"E4 D2|
"G"D2 G2 A2|"C"B4 A2|"G"G2 "D7"F2 E2|"G"D6|
"G"B2 B2 c2|"C"d4 c2|"G"B2 A2 G2|"D7"A4 G2|
"G"B2 B2 c2|"C"d4 c2|"G"B2 "D7"A2 G2|"G"G6|`,
    history: `"À la claire fontaine" est une chanson traditionnelle française qui remonte au XVIIIe siècle. Elle est originaire de France mais a été popularisée en Nouvelle-France (Québec) où elle est devenue un symbole de l'identité culturelle francophone.

La chanson raconte l'histoire d'un amour perdu, exprimé à travers les images poétiques d'une fontaine claire et d'un rossignol chanteur. Le refrain "Il y a longtemps que je t'aime, jamais je ne t'oublierai" est devenu l'un des plus reconnaissables de la chanson traditionnelle française.

Cette chanson était particulièrement populaire parmi les voyageurs et les coureurs des bois qui parcouraient les rivières du Canada. Elle a été adoptée comme hymne non officiel par les Patriotes lors de la rébellion de 1837-1838 au Bas-Canada.

Aujourd'hui, elle reste l'une des chansons traditionnelles françaises les plus connues et est souvent enseignée aux enfants dans les écoles francophones du monde entier.`,
    audioTracks: [
      { track: 'groupe', versions: [{ id: 'groupe-fr', name: 'Français' }] },
      { track: 'violon', versions: [{ id: 'violon-fr', name: 'Français' }] },
      { track: 'chant', versions: [{ id: 'chant-fr', name: 'Français' }] },
      { track: 'guitare', versions: [{ id: 'guitare-fr', name: 'Français' }] },
    ],
  },
  {
    id: '2',
    slug: 'bella-ciao',
    title: 'BELLA CIAO',
    thumbnail: '/image-chanson.png',
    metadata: {
      country: 'Italie',
      language: 'Italien',
      genres: ['Chant de résistance', 'Folk'],
      audience: ['Ados', 'Adultes', 'Séniors'],
      difficulty: 'Intermédiaire',
      themes: ['Résistance', 'Liberté', 'Histoire'],
    },
    lyrics: [
      {
        language: 'Italien',
        languageCode: 'it',
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
      },
      {
        language: 'Français',
        languageCode: 'fr',
        text: `Un beau matin, je me suis réveillé
O bella ciao, bella ciao, bella ciao ciao ciao
Un beau matin, je me suis réveillé
Et j'ai trouvé l'envahisseur

O partisan, emmène-moi
O bella ciao, bella ciao, bella ciao ciao ciao
O partisan, emmène-moi
Car je sens que je vais mourir`,
      },
    ],
    translations: [
      {
        language: 'Français',
        languageCode: 'fr',
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
        language: 'English',
        languageCode: 'en',
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
    sheetMusic: `X:1
T:Bella Ciao
M:4/4
L:1/8
K:Am
"Am"A2 A2 B2 c2|"E7"B4 A4|"Am"A2 A2 B2 c2|"E7"B4 A4|
"Am"e4 e2 d2|"Dm"c4 d2 e2|"Am"e2 d2 c2 B2|"E7"A8|
"Am"A2 c2 e2 e2|"Dm"d4 c2 d2|"Am"e2 d2 c2 B2|"E7"A8|`,
    history: `"Bella Ciao" est un chant de résistance italien qui est devenu un hymne mondial de la liberté et de la résistance contre l'oppression.

Les origines exactes de la chanson sont débattues, mais elle est généralement associée aux partisans italiens qui ont combattu contre l'occupation nazi-fasciste pendant la Seconde Guerre mondiale (1943-1945). Cependant, la mélodie pourrait avoir des racines plus anciennes, possiblement dérivée de chants de travail des mondine (cueilleuses de riz) de la vallée du Pô.

La chanson raconte l'histoire d'un partisan qui dit adieu à sa bien-aimée avant de rejoindre la lutte contre l'oppresseur. Si il meurt, il demande à être enterré dans la montagne, sous une belle fleur, afin que tous ceux qui passeront puissent voir cette fleur et se souvenir du sacrifice des partisans pour la liberté.

"Bella Ciao" a connu un regain de popularité mondial après son utilisation dans la série télévisée espagnole "La Casa de Papel" (Money Heist), où elle symbolise la résistance contre l'autorité.`,
    audioTracks: [
      { track: 'groupe', versions: [{ id: 'groupe-it', name: 'Italien' }] },
      {
        track: 'violon',
        versions: [
          { id: 'violon-chorus', name: 'Chorus' },
          { id: 'violon-verse', name: 'Verse' },
          { id: 'violon-part1', name: 'Part 1' },
          { id: 'violon-part2', name: 'Part 2' },
        ]
      },
      {
        track: 'chant',
        versions: [
          { id: 'chant-de', name: 'Allemand' },
          { id: 'chant-en', name: 'Anglais' },
          { id: 'chant-ar', name: 'Arabe' },
          { id: 'chant-es', name: 'Espagnol' },
          { id: 'chant-fr', name: 'Français' },
          { id: 'chant-it', name: 'Italien' },
          { id: 'chant-tr', name: 'Turque' },
          { id: 'chant-uk', name: 'Ukrainien' },
        ]
      },
      { track: 'guitare', versions: [{ id: 'guitare-it', name: 'Italien' }] },
      { track: 'percussion', versions: [{ id: 'percussion-it', name: 'Italien' }] },
    ],
  },
  {
    id: '3',
    slug: 'ah-vous-dirai-je-maman',
    title: 'AH VOUS DIRAI-JE MAMAN',
    thumbnail: '/image-chanson.png',
    metadata: {
      country: 'France',
      language: 'Français',
      genres: ['Chanson enfantine', 'Comptine'],
      audience: ['Enfants', 'Ados', 'Adultes', 'Séniors'],
      difficulty: 'Facile',
      themes: ['Enfance', 'Famille', 'Éducation'],
    },
    lyrics: [
      {
        language: 'Français',
        languageCode: 'fr',
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
      },
    ],
    translations: [
      {
        language: 'English',
        languageCode: 'en',
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
    sheetMusic: `X:1
T:Ah vous dirai-je maman
M:2/4
L:1/8
K:C
"C"c c "G"g g|"C"a a "G"g2|"F"f f "C"e e|"G"d d "C"c2|
"G"g g "F"f f|"C"e e "G"d2|"G"g g "F"f f|"C"e e "G"d2|
"C"c c "G"g g|"C"a a "G"g2|"F"f f "C"e e|"G"d d "C"c2|`,
    history: `"Ah ! Vous dirai-je, Maman" est une chanson française dont les paroles datent du XVIIIe siècle. La mélodie a été rendue célèbre dans le monde entier grâce aux variations composées par Wolfgang Amadeus Mozart en 1781-82.

Les paroles originales, publiées en 1761, parlaient d'un enfant qui se plaint à sa mère des exigences de son père. Au fil du temps, de nombreuses versions alternatives ont été créées, certaines avec un contenu plus léger adapté aux enfants.

La mélodie est connue internationalement sous différents noms selon les pays. En anglais, elle est connue sous le titre "Twinkle, Twinkle, Little Star" (avec des paroles différentes écrites par Jane Taylor en 1806) et aussi comme "The Alphabet Song" utilisée pour apprendre l'alphabet aux enfants.

Mozart a composé ses célèbres "12 Variations sur Ah vous dirai-je, Maman" (K. 265) en 1781 ou 1782, démontrant les possibilités musicales infinies de cette simple mélodie.`,
    audioTracks: [
      { track: 'groupe', versions: [{ id: 'groupe-fr', name: 'Français' }] },
      { track: 'chant', versions: [{ id: 'chant-fr', name: 'Français' }] },
      { track: 'violon', versions: [{ id: 'violon-fr', name: 'Français' }] },
    ],
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug);
}

export function getAllSongSlugs(): string[] {
  return songs.map((song) => song.slug);
}
