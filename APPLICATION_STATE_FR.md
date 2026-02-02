# Ballade - Documentation de l'État de l'Application

> État actuel de l'application en février 2026

## Aperçu

**Ballade** est une application web Next.js servant de catalogue de chansons traditionnelles pour l'éducation musicale et l'exploration culturelle. La plateforme permet aux utilisateurs de parcourir, rechercher et interagir avec des chansons contenant des paroles, des traductions, des partitions musicales, des documents historiques et des pistes audio en plusieurs langues.

**Caractéristiques principales :**
- Support multilingue (Français/Anglais)
- Contenu multimédia riche par chanson
- Design responsive mobile
- Gestion de contenu via Payload CMS

---

## Stack Technique

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Payload CMS 3.73, PostgreSQL (Neon serverless), Drizzle ORM |
| **Stockage de fichiers** | Cloudinary (images, PDFs, audio) |
| **Gestion d'état** | Zustand |
| **Cartes** | Leaflet + react-leaflet |
| **Visualisation PDF** | react-pdf |
| **Traitement audio** | SoundTouch (fallback pour préservation du pitch) |
| **Codes QR** | qrcode.react |

---

## Fonctionnalités Principales

### A. Catalogue et Navigation des Chansons

**Liste des Chansons**
- Vue liste dans la barre latérale affichant les titres des chansons
- Recherche par titre
- Tri alphabétique

**Modal de Filtrage Avancé**
- Région géographique (pays mappés vers des régions comme "Europe de l'Ouest", "Afrique du Nord")
- Style musical (genres)
- Langue originale
- Thème
- Public cible
- Niveau de difficulté (Facile, Intermédiaire, Difficile)

**Interface de Filtrage**
- Badges dynamiques affichant les filtres actifs
- Option "Effacer tous les filtres"
- Sections de filtres dépliables par catégorie
- Catégories codées par couleur pour une distinction visuelle

---

### B. Page de Détail d'une Chanson

**Système de Contenu Multi-Onglets**
| Onglet | Contenu |
|--------|---------|
| Paroles | Paroles originales avec affichage par strophes |
| Partitions | Partitions musicales en PDF |
| Traductions | Traductions des paroles |
| Histoire | Documents de contexte historique (PDF) |
| Audio | Lecteur audio avec sélection de piste |

**Mode Vue Focalisée**
- Permet de partager des sections de contenu spécifiques (ex: uniquement les paroles ou les partitions)
- Le paramètre URL `?view=[type]` ouvre cette section de manière isolée
- Utilisé pour le partage ciblé du contenu d'une chanson
- Pas en plein écran, mais vue isolée au sein de la page

**Affichage des Métadonnées**
- Pays d'origine
- Genres
- Thèmes
- Niveau de difficulté

**Fonctionnalité de Partage**
- Copier le lien dans le presse-papiers
- Génération de code QR
- Options de partage par section

---

### C. Lecteur Audio

**Gestion des Pistes**
- Plusieurs types de pistes par chanson (ex: violon, voix, groupe complet)
- Sélection de version au sein des pistes (variantes couplet/refrain, différentes langues)
- Menu déroulant pour changer de piste et de version

**Contrôles de Lecture**
- Lecture/Pause
- Barre de progression avec fonctionnalité de recherche
- Affichage du temps (actuel / total)

**Contrôle de Vitesse (Ralentissement Uniquement)**
- 1x (vitesse normale)
- 0.75x
- 0.5x
- Cycle à travers les vitesses au clic du bouton

**Préservation du Pitch**
- Utilise la propriété native du navigateur `preservesPitch` (principal)
- Processeur SoundTouch en fallback pour les navigateurs non supportés

**Fonctionnalités Additionnelles**
- Bouton de boucle
- Contrôle du volume (bureau uniquement)
- Raccourcis clavier : touches fléchées pour avancer/reculer de ±10 secondes
- API Media Session pour les contrôles sur écran de verrouillage mobile

---

### D. Gestion de Contenu (Payload CMS)

**Panneau d'Administration**
- Accessible à `/admin`
- Authentification utilisateur via Payload

**Collection des Chansons**
- Champs de base : titre, slug (auto-généré depuis le titre), difficulté
- Image miniature (Cloudinary)
- Relations vers les tables de référence (pays, langues, genres, publics, thèmes)

**Tableaux de Contenu Imbriqués**
- `lyrics[]` : Langue + strophes[] + traductions[]
- `scores[]` : Fichiers PDF pour les partitions
- `historyDocuments[]` : PDFs historiques par langue
- `audioTracks[]` : Type de piste + versions[] (chaque version a un nom et un fichier audio)

**Intégration Cloudinary**
- Champs d'upload personnalisés pour images, PDFs et audio
- Structure de dossiers organisée : `/songs/{slug}/audio/{track-type}/`
- Nettoyage automatique des assets supprimés lors de la mise à jour/suppression d'une chanson

**Collections de Référence**
| Collection | Champs |
|------------|--------|
| Languages | name, nameEn, code |
| Genres | name |
| Audiences | name |
| Themes | name |
| TrackTypes | name, nameEn, slug |

---

### E. Découverte Géographique (Modal Carte)

- Carte interactive Leaflet
- Barre latérale des pays pour parcourir les chansons par localisation
- Animation "fly-to" lors de la sélection d'un pays
- S'intègre avec le filtrage des chansons par pays

---

### F. Internationalisation (i18n)

**Langues Supportées**
- Français (principal)
- Anglais

**Implémentation**
- `LanguageContext` pour les traductions de l'interface
- Fonction de traduction `t()` pour les chaînes de l'interface
- Traductions des valeurs de référence (genres, langues, thèmes, etc.)
- Images de la page d'accueil localisées selon la langue sélectionnée

**Traduction du Contenu**
- Les paroles supportent plusieurs versions linguistiques
- Traductions imbriquées dans la structure des paroles
- Noms des régions traduits pour l'affichage des filtres

---

### G. Design Responsive Mobile

**Adaptations de Mise en Page**
- Approche CSS mobile-first
- Barre de navigation en bas sur mobile (remplace la barre latérale)
- Barre latérale masquée sur les appareils mobiles
- Mises en page à une colonne sur petits écrans

**Optimisation Tactile**
- Lecteur audio optimisé pour l'interaction tactile
- Zones de tap plus grandes sur mobile
- Navigation adaptée au swipe

**Points de Rupture Responsive**
- Mobile : styles par défaut
- Tablette/Bureau : points de rupture `md:` et `lg:`

---

### H. Partage et Réseaux Sociaux

**Modal de Partage**
- Fonctionnalité de copie du lien dans le presse-papiers
- Génération de code QR pour un partage mobile facile
- Partage par section (partager uniquement les paroles, partitions, histoire ou audio)

**Intégration Sociale**
- Liens sociaux dans le pied de page
- Les URLs de partage préservent l'état de la vue focalisée

---

### I. Conformité RGPD

**Bannière de Consentement aux Cookies**
- Affichée lors de la première visite
- Options Accepter/Refuser
- Stockage persistant du consentement dans le localStorage
- Bannière masquée après le choix

---

## Pages et Routes

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec barre de recherche et contenu de bienvenue |
| `/songs` | Catalogue complet des chansons avec filtrage avancé |
| `/song/[slug]` | Page de détail dynamique d'une chanson |
| `/song/[slug]?view=[type]` | Vue focalisée pour les sections de contenu partagées |
| `/mentions-legales` | Page des mentions légales |
| `/admin` | Panneau d'administration Payload CMS |

---

## Points d'API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/public/songs` | GET | Liste toutes les chansons avec filtrage optionnel par pays, langue, genre, public, thème, difficulté |
| `/api/public/songs/[slug]` | GET | Récupère une chanson par slug avec toutes les relations peuplées |
| `/api/public/songs/[slug]/audio/[trackType]/[versionId]` | GET | Stream du fichier audio depuis Cloudinary |
| `/api/lookup/[type]` | GET | Récupère les valeurs de référence (langues, genres, publics, thèmes, types de pistes) |
| `/api/cloudinary/sign-upload` | POST | Génère les credentials d'upload signés pour Cloudinary |
| `/api/proxy/pdf` | GET | Endpoint proxy PDF |

---

## Modèle de Données

### Schéma de la Collection des Chansons

```
Song {
  id: string
  title: string
  slug: string (auto-généré, modifiable)
  difficulty: "Facile" | "Intermédiaire" | "Difficile"
  thumbnail: string (public_id Cloudinary)

  // Relations
  countries: Country[]
  languages: Language[]
  genres: Genre[]
  audiences: Audience[]
  themes: Theme[]

  // Tableaux de Contenu
  lyrics: [
    {
      language: Language
      stanzas: [{ content: string }]
      translations: [
        {
          language: Language
          stanzas: [{ content: string }]
        }
      ]
    }
  ]

  scores: [
    { file: string (public_id Cloudinary) }
  ]

  historyDocuments: [
    {
      language: Language
      file: string (public_id Cloudinary)
    }
  ]

  audioTracks: [
    {
      trackType: TrackType
      versions: [
        {
          id: string
          name: string
          file: string (public_id Cloudinary)
        }
      ]
    }
  ]
}
```

### Collections de Référence

| Collection | Champs |
|------------|--------|
| **Languages** | name (Français), nameEn (Anglais), code (ISO) |
| **Genres** | name |
| **Audiences** | name |
| **Themes** | name |
| **TrackTypes** | name, nameEn, slug |
| **Users** | email, name (authentification CMS) |

---

## Gestion d'État (Stores Zustand)

| Store | Fonction |
|-------|----------|
| `useSongsDataStore` | Récupération et mise en cache des données des chansons, état de la chanson courante |
| `useSongStore` | État UI de la chanson courante (onglet sélectionné, piste audio, version) |
| `useFilterStore` | Sélections de filtres actifs |
| `useLookupStore` | Données de référence en cache avec fonctions de traduction |
| `useFocusedViewStore` | État du mode vue focalisée |
| `useSidebarStore` | Visibilité de la barre latérale et état de recherche |

---

## Structure du Projet

```
/ballade
├── pages/                 # Next.js Pages Router
│   ├── index.tsx         # Page d'accueil
│   ├── songs.tsx         # Catalogue des chansons
│   ├── song/[slug].tsx   # Détail d'une chanson
│   ├── mentions-legales.tsx
│   └── api/              # Routes API
├── app/                   # Intégration Payload CMS App Router
├── components/
│   ├── song/             # Composants liés aux chansons
│   ├── payload/          # Champs personnalisés Payload CMS
│   ├── ui/               # Composants UI réutilisables
│   ├── MapModal/         # Composants de carte
│   └── ...               # Composants de layout
├── collections/          # Collections Payload CMS
├── store/                # Stores Zustand
├── contexts/             # Contextes React (Language)
├── hooks/                # Hooks personnalisés (useAudioPlayer)
├── lib/                  # Utilitaires (Cloudinary, client Payload)
├── data/                 # Données statiques (géographie, traductions)
├── types/                # Types TypeScript
├── styles/               # Styles globaux
├── public/               # Assets statiques
└── db/                   # Schéma Drizzle
```

---

## Chronologie de Développement

| Période | Jalons |
|---------|--------|
| **17-18 Jan** | Configuration initiale du projet, page d'accueil, UI de la page chanson, modal de filtrage, support PDF |
| **28-29 Jan** | Intégration Payload CMS (US-001 à US-016), routes API, migration de base de données, seeding des références |
| **29-30 Jan** | Filtrage avancé avec badges dynamiques, modal carte, i18n (Français/Anglais), modal de partage, persistance de la barre latérale |
| **31 Jan** | Design responsive mobile, fallback SoundTouch pour préservation du pitch, bannière de consentement cookies |
| **1er Fév** | Polish UI, layout desktop du modal de filtrage, corrections zoom carte, contrôles clavier seek, corrections build TypeScript, nettoyage du projet |

---

## Configuration de l'Environnement

| Variable | Fonction |
|----------|----------|
| `DATABASE_URL` | Connexion PostgreSQL (Neon) |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Configuration Cloudinary publique |
| `PAYLOAD_SECRET` | Chiffrement du panneau d'administration |
