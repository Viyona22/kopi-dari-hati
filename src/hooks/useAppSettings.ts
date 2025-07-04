
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any, category: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          category: category,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      // Update local state
      setSettings(prev => {
        const existing = prev.find(s => s.setting_key === key);
        if (existing) {
          return prev.map(s => 
            s.setting_key === key 
              ? { ...s, setting_value: value, updated_at: new Date().toISOString() }
              : s
          );
        } else {
          return [...prev, {
            id: `temp-${Date.now()}`,
            setting_key: key,
            setting_value: value,
            category: category,
            updated_at: new Date().toISOString()
          }];
        }
      });

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('settings-updated', { 
        detail: { key, value, category } 
      }));

      toast.success('Pengaturan berhasil disimpan');
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Gagal menyimpan pengaturan');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value ?? defaultValue;
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  useEffect(() => {
    fetchSettings();

    // Listen for real-time updates
    const channel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings'
        },
        () => {
          // Refresh settings when changes occur
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    settings,
    loading,
    updating,
    updateSetting,
    getSetting,
    getSettingsByCategory,
    refetch: fetchSettings
  };
}
