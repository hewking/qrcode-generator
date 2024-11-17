import { supabase } from '../supabase'
import type { QRHistory } from '../supabase'

export class HistoryService {
  static async createHistory(data: Omit<QRHistory, 'id' | 'created_at'>) {
    try {
      const { data: history, error } = await supabase
        .from('qr_history')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return history
    } catch (error) {
      console.error('Error creating history:', error)
      throw error
    }
  }

  static async getHistories(userId: string | null) {
    try {
      const { data: histories, error } = await supabase
        .from('qr_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return histories
    } catch (error) {
      console.error('Error fetching histories:', error)
      throw error
    }
  }

  static async updateHistory(id: string, data: Partial<QRHistory>) {
    try {
      const { data: history, error } = await supabase
        .from('qr_history')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return history
    } catch (error) {
      console.error('Error updating history:', error)
      throw error
    }
  }

  static async deleteHistory(id: string) {
    try {
      const { error } = await supabase
        .from('qr_history')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting history:', error)
      throw error
    }
  }
} 