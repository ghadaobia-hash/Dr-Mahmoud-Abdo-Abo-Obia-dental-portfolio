import { useState, useEffect, useCallback } from 'react';
import { supabase, resolveField } from '../lib/supabaseClient';

// Supabase table name
const TABLE = 'clinical_cases';

export function useSupabaseCases() {
  const [cases, setCases]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null); // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch all cases ────────────────────────────────────────────────────
  const fetchCases = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) showToast('Failed to load cases: ' + error.message, 'error');
    else setCases(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  // ── Add a case ─────────────────────────────────────────────────────────
  const addCase = async (formData) => {
    setSaving(true);
    try {
      // Upload all images in parallel
      const [beforeUrl, afterUrl, ...extraUrls] = await Promise.all([
        resolveField(formData.before, 'cases'),
        resolveField(formData.after,  'cases'),
        ...(formData.extras || []).map(e => resolveField(e, 'cases')),
      ]);

      const { data, error } = await supabase
        .from(TABLE)
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
      return true;
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
        .from(TABLE)
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
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
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
