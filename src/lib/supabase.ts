import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itwodcidylkozuewdzpa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0d29kY2lkeWxrb3p1ZXdkenBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODIxNjksImV4cCI6MjEwMzE1ODE2OX0.HsNnZ5Fs_86nXCW3e-1rwEfe88dIz-5v7GCKNt7QEeA';

export const supabase = createClient(supabaseUrl, supabaseKey);
