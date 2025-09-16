import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not found. Some features may not work.')
      // Return a mock client for build time
      return {
        storage: {
          from: () => ({
            list: () => Promise.resolve({ data: [], error: null }),
            upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            remove: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            getPublicUrl: () => ({ data: { publicUrl: '' } })
          })
        }
      }
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseClient
}

// For backward compatibility
export const supabase = getSupabaseClient()
