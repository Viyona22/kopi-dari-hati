
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

      if (error) {
        console.error('Supabase error fetching settings:', error);
        // If it's a permission error, just use empty settings array
        if (error.code === '42501' || error.message.includes('row-level security')) {
          console.log('User does not have permission to access app_settings, using defaults');
          setSettings([]);
          return;
        }
        throw error;
      }

      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Don't show error toast for permission issues
      if (!(error as any)?.code === '42501') {
        toast.error('Gagal memuat pengaturan');
      }
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any, category: string) => {
    setUpdating(true);
    try {
      console.log('Updating setting:', { key, value, category });
      
      // First, try to update existing setting
      const { data: existingData, error: selectError } = await supabase
        .from('app_settings')
        .select('id')
        .eq('setting_key', key)
        .maybeSingle();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing setting:', selectError);
        throw selectError;
      }

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('app_settings')
          .update({
            setting_value: value,
            category: category,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', key)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('app_settings')
          .insert({
            setting_key: key,
            setting_value: value,
            category: category,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Supabase upsert error:', result.error);
        throw result.error;
      }

      console.log('Setting updated successfully:', result.data);

      // Update local state
      setSettings(prev => {
        const existing = prev.find(s => s.setting_key === key);
        if (existing) {
          return prev.map(s => 
            s.setting_key === key 
              ? { ...s, setting_value: value, category, updated_at: new Date().toISOString() }
              : s
          );
        } else {
          return [...prev, {
            id: result.data.id,
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

      console.log('Settings updated, dispatching events');
      toast.success('Pengaturan berhasil disimpan');
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Gagal menyimpan pengaturan: ' + (error as Error).message);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    const setting = settings.find(s => s.setting_key === key);
    const value = setting?.setting_value ?? defaultValue;
    console.log(`getSetting(${key}):`, value);
    return value;
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
