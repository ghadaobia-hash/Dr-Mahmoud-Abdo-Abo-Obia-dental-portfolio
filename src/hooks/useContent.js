import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Load and persist a content value from the site_settings table.
 * Falls back to `defaultValue` if nothing is stored yet.
 */
export function useContent(key, defaultValue) {
  const [data, setData] = useState(defaultValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row?.value) {
          try {
            setData(JSON.parse(row.value));
          } catch {
            setData(row.value);
          }
        }
      });
  }, [key]);

  const save = async (newData) => {
    setSaving(true);
    const value =
      typeof newData === 'string' ? newData : JSON.stringify(newData);
    await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    setData(newData);
    setSaving(false);
  };

  return { data, save, saving };
}
