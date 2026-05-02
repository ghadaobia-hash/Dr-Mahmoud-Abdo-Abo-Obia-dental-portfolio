import { useState, useEffect, useCallback } from 'react';
import { supabase, resolveField } from '../lib/supabaseClient';

const TABLE = 'certificates';

export function useSupabaseCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch all certificates ─────────────────────────────────────────────
  const fetchCerts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) showToast('Failed to load certificates: ' + error.message, 'error');
    else setCertificates(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  // ── Add a certificate ──────────────────────────────────────────────────
  const addCert = async (formData) => {
    setSaving(true);
    try {
      const fileUrl = await resolveField(formData.fileField, 'certificates');

      const { data, error } = await supabase
        .from(TABLE)
        .insert([{
          title:     formData.title,
          issuer:    formData.issuer,
          date:      formData.date,
          file_url:  fileUrl,
          file_type: formData.fileField?.file?.type  || formData.fileField?.fileType  || null,
          file_name: formData.fileField?.file?.name  || formData.fileField?.fileName  || null,
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      setCertificates(prev => [data, ...prev]);
      showToast('Certificate saved!');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Update a certificate ───────────────────────────────────────────────
  const updateCert = async (id, formData) => {
    setSaving(true);
    try {
      const fileUrl = await resolveField(formData.fileField, 'certificates');

      const { data, error } = await supabase
        .from(TABLE)
        .update({
          title:     formData.title,
          issuer:    formData.issuer,
          date:      formData.date,
          file_url:  fileUrl,
          file_type: formData.fileField?.file?.type  || formData.fileField?.fileType  || null,
          file_name: formData.fileField?.file?.name  || formData.fileField?.fileName  || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      setCertificates(prev => prev.map(c => c.id === id ? data : c));
      showToast('Certificate updated!');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Delete a certificate ───────────────────────────────────────────────
  const removeCert = async (id) => {
    setSaving(true);
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw new Error(error.message);
      setCertificates(prev => prev.filter(c => c.id !== id));
      showToast('Certificate deleted.');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { certificates, loading, saving, toast, addCert, updateCert, removeCert };
}
