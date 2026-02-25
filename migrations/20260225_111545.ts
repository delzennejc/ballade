import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`songs_countries\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`songs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_countries_order_idx\` ON \`songs_countries\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`songs_countries_parent_idx\` ON \`songs_countries\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`songs_lyrics_translations\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language_id\` integer NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`songs_lyrics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_lyrics_translations_order_idx\` ON \`songs_lyrics_translations\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`songs_lyrics_translations_parent_id_idx\` ON \`songs_lyrics_translations\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_lyrics_translations_language_idx\` ON \`songs_lyrics_translations\` (\`language_id\`);`)
  await db.run(sql`CREATE TABLE \`songs_lyrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language_id\` integer NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`songs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_lyrics_order_idx\` ON \`songs_lyrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`songs_lyrics_parent_id_idx\` ON \`songs_lyrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_lyrics_language_idx\` ON \`songs_lyrics\` (\`language_id\`);`)
  await db.run(sql`CREATE TABLE \`songs_scores\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pdf_public_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`songs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_scores_order_idx\` ON \`songs_scores\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`songs_scores_parent_id_idx\` ON \`songs_scores\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`songs_history_documents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language_id\` integer NOT NULL,
  	\`pdf_public_id\` text NOT NULL,
  	FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`songs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_history_documents_order_idx\` ON \`songs_history_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`songs_history_documents_parent_id_idx\` ON \`songs_history_documents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_history_documents_language_idx\` ON \`songs_history_documents\` (\`language_id\`);`)
  await db.run(sql`CREATE TABLE \`songs_audio_tracks_versions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`version_id\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`audio_public_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`songs_audio_tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_audio_tracks_versions_order_idx\` ON \`songs_audio_tracks_versions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`songs_audio_tracks_versions_parent_id_idx\` ON \`songs_audio_tracks_versions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`songs_audio_tracks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_type_id\` integer NOT NULL,
  	FOREIGN KEY (\`track_type_id\`) REFERENCES \`track_types\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`songs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_audio_tracks_order_idx\` ON \`songs_audio_tracks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`songs_audio_tracks_parent_id_idx\` ON \`songs_audio_tracks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_audio_tracks_track_type_idx\` ON \`songs_audio_tracks\` (\`track_type_id\`);`)
  await db.run(sql`CREATE TABLE \`songs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`thumbnail_public_id\` text,
  	\`difficulty_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`difficulty_id\`) REFERENCES \`difficulty_levels\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`songs_slug_idx\` ON \`songs\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`songs_difficulty_idx\` ON \`songs\` (\`difficulty_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_updated_at_idx\` ON \`songs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`songs_created_at_idx\` ON \`songs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`songs_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`languages_id\` integer,
  	\`genres_id\` integer,
  	\`audiences_id\` integer,
  	\`themes_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`songs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`languages_id\`) REFERENCES \`languages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`genres_id\`) REFERENCES \`genres\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`audiences_id\`) REFERENCES \`audiences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`themes_id\`) REFERENCES \`themes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`songs_rels_order_idx\` ON \`songs_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`songs_rels_parent_idx\` ON \`songs_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_rels_path_idx\` ON \`songs_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`songs_rels_languages_id_idx\` ON \`songs_rels\` (\`languages_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_rels_genres_id_idx\` ON \`songs_rels\` (\`genres_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_rels_audiences_id_idx\` ON \`songs_rels\` (\`audiences_id\`);`)
  await db.run(sql`CREATE INDEX \`songs_rels_themes_id_idx\` ON \`songs_rels\` (\`themes_id\`);`)
  await db.run(sql`CREATE TABLE \`languages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`name_en\` text,
  	\`code\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`languages_name_idx\` ON \`languages\` (\`name\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`languages_code_idx\` ON \`languages\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`languages_updated_at_idx\` ON \`languages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`languages_created_at_idx\` ON \`languages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`genres\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`name_en\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`genres_name_idx\` ON \`genres\` (\`name\`);`)
  await db.run(sql`CREATE INDEX \`genres_updated_at_idx\` ON \`genres\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`genres_created_at_idx\` ON \`genres\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`audiences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`name_en\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`audiences_name_idx\` ON \`audiences\` (\`name\`);`)
  await db.run(sql`CREATE INDEX \`audiences_updated_at_idx\` ON \`audiences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`audiences_created_at_idx\` ON \`audiences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`themes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`name_en\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`themes_name_idx\` ON \`themes\` (\`name\`);`)
  await db.run(sql`CREATE INDEX \`themes_updated_at_idx\` ON \`themes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`themes_created_at_idx\` ON \`themes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`track_types\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`name_en\` text,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`track_types_name_idx\` ON \`track_types\` (\`name\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`track_types_slug_idx\` ON \`track_types\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`track_types_updated_at_idx\` ON \`track_types\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`track_types_created_at_idx\` ON \`track_types\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`difficulty_levels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`name_en\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`difficulty_levels_name_idx\` ON \`difficulty_levels\` (\`name\`);`)
  await db.run(sql`CREATE INDEX \`difficulty_levels_updated_at_idx\` ON \`difficulty_levels\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`difficulty_levels_created_at_idx\` ON \`difficulty_levels\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`songs_id\` integer,
  	\`languages_id\` integer,
  	\`genres_id\` integer,
  	\`audiences_id\` integer,
  	\`themes_id\` integer,
  	\`track_types_id\` integer,
  	\`difficulty_levels_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`songs_id\`) REFERENCES \`songs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`languages_id\`) REFERENCES \`languages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`genres_id\`) REFERENCES \`genres\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`audiences_id\`) REFERENCES \`audiences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`themes_id\`) REFERENCES \`themes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`track_types_id\`) REFERENCES \`track_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`difficulty_levels_id\`) REFERENCES \`difficulty_levels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_songs_id_idx\` ON \`payload_locked_documents_rels\` (\`songs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_languages_id_idx\` ON \`payload_locked_documents_rels\` (\`languages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_genres_id_idx\` ON \`payload_locked_documents_rels\` (\`genres_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_audiences_id_idx\` ON \`payload_locked_documents_rels\` (\`audiences_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_themes_id_idx\` ON \`payload_locked_documents_rels\` (\`themes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_track_types_id_idx\` ON \`payload_locked_documents_rels\` (\`track_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_difficulty_levels_id_idx\` ON \`payload_locked_documents_rels\` (\`difficulty_levels_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`songs_countries\`;`)
  await db.run(sql`DROP TABLE \`songs_lyrics_translations\`;`)
  await db.run(sql`DROP TABLE \`songs_lyrics\`;`)
  await db.run(sql`DROP TABLE \`songs_scores\`;`)
  await db.run(sql`DROP TABLE \`songs_history_documents\`;`)
  await db.run(sql`DROP TABLE \`songs_audio_tracks_versions\`;`)
  await db.run(sql`DROP TABLE \`songs_audio_tracks\`;`)
  await db.run(sql`DROP TABLE \`songs\`;`)
  await db.run(sql`DROP TABLE \`songs_rels\`;`)
  await db.run(sql`DROP TABLE \`languages\`;`)
  await db.run(sql`DROP TABLE \`genres\`;`)
  await db.run(sql`DROP TABLE \`audiences\`;`)
  await db.run(sql`DROP TABLE \`themes\`;`)
  await db.run(sql`DROP TABLE \`track_types\`;`)
  await db.run(sql`DROP TABLE \`difficulty_levels\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
