/*
  # User Feedback and Preferences System

  ## Overview
  This migration creates a comprehensive feedback system that collects user ratings
  on AI-generated project ideas and instructions, analyzes patterns, and stores
  preference data to improve future AI prompts.

  ## Tables Created

  ### 1. project_feedback
  Stores individual thumbs up/down ratings on project ideas
  - `id` (uuid, primary key): Unique feedback entry ID
  - `project_title` (text): Title of the rated project
  - `rating` (text): Either 'up' or 'down'
  - `waste_description` (text): Original waste description that generated this project
  - `materials` (text[]): Array of materials involved
  - `skill_level` (text): Beginner, Intermediate, or Expert
  - `estimated_time` (text): Time estimate for the project
  - `estimated_cost` (text): Cost estimate for the project
  - `created_at` (timestamptz): When the feedback was given

  ### 2. instruction_feedback
  Stores ratings on step-by-step instructions
  - `id` (uuid, primary key): Unique feedback entry ID
  - `project_title` (text): Title of the project being rated
  - `rating` (text): Either 'up' or 'down'
  - `created_at` (timestamptz): When the feedback was given

  ### 3. user_preferences
  Aggregated preference data derived from feedback patterns
  - `id` (uuid, primary key): Unique preference record ID
  - `preference_type` (text): Type of preference (e.g., 'skill_level', 'time_commitment')
  - `preference_value` (text): The preferred value
  - `positive_count` (integer): Number of positive ratings for this preference
  - `total_count` (integer): Total number of times this preference appeared
  - `confidence_score` (numeric): Calculated confidence (positive_count / total_count)
  - `last_updated` (timestamptz): Last time this preference was updated

  ## Security
  - RLS enabled on all tables
  - Public access for reading/writing feedback (anonymous users can provide feedback)
  - This allows the app to collect feedback without requiring authentication

  ## Indexes
  - Index on created_at for efficient time-based queries
  - Index on preference_type for quick preference lookups
  - Index on rating for aggregation queries
*/

-- Create project_feedback table
CREATE TABLE IF NOT EXISTS project_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_title text NOT NULL,
  rating text NOT NULL CHECK (rating IN ('up', 'down')),
  waste_description text NOT NULL,
  materials text[] DEFAULT '{}',
  skill_level text CHECK (skill_level IN ('Beginner', 'Intermediate', 'Expert')),
  estimated_time text,
  estimated_cost text,
  created_at timestamptz DEFAULT now()
);

-- Create instruction_feedback table
CREATE TABLE IF NOT EXISTS instruction_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_title text NOT NULL,
  rating text NOT NULL CHECK (rating IN ('up', 'down')),
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preference_type text NOT NULL,
  preference_value text NOT NULL,
  positive_count integer DEFAULT 0,
  total_count integer DEFAULT 0,
  confidence_score numeric DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(preference_type, preference_value)
);

-- Enable RLS on all tables
ALTER TABLE project_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruction_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for project_feedback (allow public read/write for feedback collection)
CREATE POLICY "Allow public read on project_feedback"
  ON project_feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on project_feedback"
  ON project_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policies for instruction_feedback
CREATE POLICY "Allow public read on instruction_feedback"
  ON instruction_feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on instruction_feedback"
  ON instruction_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policies for user_preferences
CREATE POLICY "Allow public read on user_preferences"
  ON user_preferences
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on user_preferences"
  ON user_preferences
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update on user_preferences"
  ON user_preferences
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_feedback_created_at ON project_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_feedback_rating ON project_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_project_feedback_skill_level ON project_feedback(skill_level);
CREATE INDEX IF NOT EXISTS idx_instruction_feedback_created_at ON instruction_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_type ON user_preferences(preference_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_confidence ON user_preferences(confidence_score DESC);
