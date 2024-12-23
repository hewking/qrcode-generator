import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type QRHistory = {
  id: string
  user_id: string
  content: string
  created_at: string
  title: string | null
  type: 'text' | 'url' | 'other'
  is_favorite?: boolean
  view_count?: number
  last_viewed_at?: string | null
  deleted_at?: string | null
} 