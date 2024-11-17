import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type QRHistory = {
  id: string
  user_id: string | null
  content: string
  created_at: string
  title: string | null
  type: 'text' | 'url' | 'other'
} 