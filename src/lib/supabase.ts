import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing')
    console.log('Supabase Key:', supabaseAnonKey ? 'Found' : 'Missing')

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not found!')
      console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.')
      
      // Return a mock client that provides better error messages
      return {
        storage: {
          from: () => ({
            list: () => Promise.resolve({ 
              data: [], 
              error: { message: 'Supabase not configured - missing environment variables' } 
            }),
            upload: () => Promise.resolve({ 
              data: null, 
              error: { message: 'Supabase not configured - missing environment variables' } 
            }),
            remove: () => Promise.resolve({ 
              error: { message: 'Supabase not configured - missing environment variables' } 
            }),
            getPublicUrl: () => ({ data: { publicUrl: '' } })
          })
        }
      }
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client initialized successfully')
  }
  
  return supabaseClient
}

// For backward compatibility
export const supabase = getSupabaseClient()
