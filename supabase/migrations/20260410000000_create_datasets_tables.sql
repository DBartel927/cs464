-- Initial Migration: Create tables for datasets and dataset items

-- Dataset table to describe an individual dataset
CREATE TABLE IF NOT EXISTS datasets (
    id BIGSERIAL PRIMARY KEY,
    dataset_slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dataset items table to store individual ordered items within a dataset
CREATE TABLE IF NOT EXISTS dataset_items (
    id BIGSERIAL PRIMARY KEY,
    dataset_id BIGINT NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common query patterns    
CREATE INDEX IF NOT EXISTS idx_dataset_items_dataset_id ON dataset_items(dataset_id);
CREATE INDEX IF NOT EXISTS idx_datasets_slug ON datasets(dataset_slug);

-- Prevent duplicate-ordered items in the same dataset
CREATE UNIQUE INDEX IF NOT EXISTS idx_dataset_items_unique_per_dataset
    ON dataset_items(dataset_id, item_name, item_order);