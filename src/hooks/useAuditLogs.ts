
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/components/auth/AuthProvider'

export interface AuditLog {
  id: string
  table_name: string
  operation: string
  old_data?: any
  new_data?: any
  user_id?: string
  timestamp: string
}

export function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const { userProfile } = useAuthContext()

  const loadAuditLogs = async () => {
    try {
      // Only admins can view audit logs
      if (userProfile?.role !== 'admin') {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100) // Limit to recent 100 logs

      if (error) throw error
      
      setAuditLogs(data || [])
    } catch (error) {
      console.error('Error loading audit logs:', error)
      setAuditLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userProfile) {
      loadAuditLogs()
    }
  }, [userProfile])

  return {
    auditLogs,
    loading,
    refreshAuditLogs: loadAuditLogs
  }
}
