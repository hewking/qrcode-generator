import { supabase } from '../supabase'
import type { QRHistory } from '../supabase'

export class HistoryService {
  static async createHistory(data: Omit<QRHistory, 'id' | 'created_at'>) {
    try {
      const { data: history, error } = await supabase
        .from('qr_history')
        .insert([{
          ...data,
          user_id: data.user_id
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      return history
    } catch (error) {
      console.error('Error creating history:', error)
      throw error
    }
  }

  static async getHistories(userId: string | null, page = 1, limit = 5) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('qr_history')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: histories, error, count } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return {
        histories: histories || [],
        total: count || 0,
        hasMore: count ? from + limit < count : false
      };
    } catch (error) {
      console.error('Error fetching histories:', error);
      throw error;
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