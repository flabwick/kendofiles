-- PostgreSQL schema for file manager

CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    parent_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    path VARCHAR NOT NULL UNIQUE,
    is_root BOOLEAN DEFAULT false,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    size BIGINT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_path ON folders USING BTREE(path);

CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    folder_id INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    extension VARCHAR,
    mime_type VARCHAR,
    size BIGINT,
    content BYTEA,
    content_path VARCHAR,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);
CREATE INDEX IF NOT EXISTS idx_files_extension ON files(extension);
