// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ozchegkhlrqpkghqrcaz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y2hlZ2tobHJxcGtnaHFyY2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTgxNDAsImV4cCI6MjA2NDA5NDE0MH0.PB_RxE-B6pb2zxUYDld4F75xCqAYSGyrfWMaocbzcGE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);