
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xaiosmtcvxogctlbejvq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaW9zbXRjdnhvZ2N0bGJlanZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzk4MDQsImV4cCI6MjA2Mjk1NTgwNH0.2hXW31FrYtc4bmsRufMwrv1gjw37YnI8DcyjX-FbwbU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
