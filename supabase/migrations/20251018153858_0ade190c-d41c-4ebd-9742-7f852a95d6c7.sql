-- Create table for storing user sustainability assessments
CREATE TABLE public.sustainability_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  energy_usage NUMERIC NOT NULL,
  water_usage NUMERIC NOT NULL,
  waste_generation NUMERIC NOT NULL,
  transportation TEXT NOT NULL,
  diet_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  eco_score NUMERIC NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sustainability_assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own assessments
CREATE POLICY "Users can view own assessments"
  ON public.sustainability_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own assessments
CREATE POLICY "Users can insert own assessments"
  ON public.sustainability_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own assessments
CREATE POLICY "Users can delete own assessments"
  ON public.sustainability_assessments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_assessments_user_created 
  ON public.sustainability_assessments(user_id, created_at DESC);