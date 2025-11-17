import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Machine = {
  id: string
  user_id: string
  name: string
  type: 'vertical' | 'horizontal' | 'turning' | 'machining_center'
  manufacturer?: string
  model?: string
  max_rpm?: number
  max_power?: number
  work_area_x?: number
  work_area_y?: number
  work_area_z?: number
  notes?: string
  created_at: string
  updated_at: string
}

export type Tool = {
  id: string
  user_id: string
  name: string
  type: 'drill' | 'end_mill' | 'face_mill' | 'insert' | 'hss' | 'carbide'
  material?: string
  diameter?: number
  length?: number
  flutes?: number
  coating?: string
  manufacturer?: string
  part_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Analysis = {
  id: string
  user_id: string
  title: string
  drawing_url?: string
  drawing_type?: 'image' | 'pdf' | 'cad'
  material?: string
  process_type?: 'milling' | 'turning' | 'complete'
  status: 'processing' | 'completed' | 'failed'
  features?: any
  machining_plan?: any
  created_at: string
  updated_at: string
}

export type CuttingParameter = {
  id: string
  user_id: string
  material: string
  tool_type: string
  rpm?: number
  feed_rate?: number
  depth_of_cut?: number
  ap?: number
  ae?: number
  notes?: string
  created_at: string
  updated_at: string
}
