
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xokqnkvjpiygfxtmwmuu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva3Fua3ZqcGl5Z2Z4dG13bXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTY1OTYsImV4cCI6MjA2NDIzMjU5Nn0.yeW3mfg3Q30nYGR4SzClz5C57d7-1fBMgM7cslBxPOk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
