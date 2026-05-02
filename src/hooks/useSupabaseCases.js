import { useState, useEffect, useCallback } from 'react';
import { supabase, resolveField } from '../lib/supabaseClient';

export function useSupabaseCases(tableName = 'clinical_cases') {
  const [cases, setCases]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch all cases ────────────────────────────────────────────────────
  const fetchCases = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) showToast('Failed to load cases: ' + error.message, 'error');
    else setCases(data || []);
    setLoading(false);
  }, [tableName]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  // ── Add a case ─────────────────────────────────────────────────────────
  const addCase = async (formData) => {
    setSaving(true);
    try {
      const [beforeUrl, afterUrl, ...extraUrls] = await Promise.all([
        resolveField(formData.before, 'cases'),
        resolveField(formData.after,  'cases'),
        ...(formData.extras || []).map(e => resolveField(e, 'cases')),
      ]);

      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          title:       formData.title,
          category:    formData.category,
          description: formData.desc,
          date:        formData.date,
          before_url:  beforeUrl,
          after_url:   afterUrl,
          extras:      extraUrls.filter(Boolean),
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      setCases(prev => [data, ...prev]);
      showToast('Case saved successfully!');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Update a case ──────────────────────────────────────────────────────
  const updateCase = async (id, formData) => {
    setSaving(true);
    try {
      const [beforeUrl, afterUrl, ...extraUrls] = await Promise.all([
        resolveField(formData.before, 'cases'),
        resolveField(formData.after,  'cases'),
        ...(formData.extras || []).map(e => resolveField(e, 'cases')),
      ]);

      const { data, error } = await supabase
        .from(tableName)
        .update({
          title:       formData.title,
          category:    formData.category,
          description: formData.desc,
          date:        formData.date,
          before_url:  beforeUrl,
          after_url:   afterUrl,
          extras:      extraUrls.filter(Boolean),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      setCases(prev => prev.map(c => c.id === id ? data : c));
      showToast('Case updated successfully!');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Delete a case ──────────────────────────────────────────────────────
  const removeCase = async (id) => {
    setSaving(true);
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw new Error(error.message);
      setCases(prev => prev.filter(c => c.id !== id));
      showToast('Case deleted.');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { cases, loading, saving, toast, addCase, updateCase, removeCase };
}
