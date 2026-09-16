-- SQL script to replace mock schools with real schools in Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/iweetmduezfpobczrjiz/sql

-- Delete all existing schools
DELETE FROM schools;

-- Insert real schools from Excel
INSERT INTO schools (name, slug, is_active, created_at) VALUES
('David', 'david', true, '2026-09-15T14:05:00.992Z'),
('JJPS', 'jjps', true, '2026-09-15T14:05:01.003Z'),
('KV', 'kv', true, '2026-09-15T14:05:01.003Z'),
('Nav Jeevan', 'nav-jeevan', true, '2026-09-15T14:05:01.003Z'),
('ND', 'nd', true, '2026-09-15T14:05:01.004Z'),
('ST Mary', 'st-mary', true, '2026-09-15T14:05:01.004Z'),
('Common', 'common', true, '2026-09-15T14:05:01.004Z'),
('Global Nav Jeevan School', 'global-nav-jeevan-school', true, '2026-09-15T14:05:01.004Z');
