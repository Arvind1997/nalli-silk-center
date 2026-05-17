import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if we're in the browser to prevent SSR errors with undefined vars
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    return null;
  }

  try {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yoursupabaseurl.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
    )
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
}
