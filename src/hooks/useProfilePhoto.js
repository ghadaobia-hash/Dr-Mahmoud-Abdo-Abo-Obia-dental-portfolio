import { useState, useEffect } from 'react';
import { supabase, uploadFile } from '../lib/supabaseClient';

const TABLE       = 'site_settings';
const PHOTO_KEY   = 'profile_photo_url';

export function useProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load profile photo URL on mount ───────────────────────────────────
  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLE)
        .select('value')
        .eq('key', PHOTO_KEY)
        .maybeSingle();

      if (!error && data?.value) setPhotoUrl(data.value);
      setLoading(false);
    };
    fetchPhoto();
  }, []);

  // ── Upload new photo → save URL to site_settings ──────────────────────
  const uploadPhoto = async (file) => {
    setSaving(true);
    try {
      const url = await uploadFile('profile', file);

      const { error } = await supabase
        .from(TABLE)
        .upsert({ key: PHOTO_KEY, value: url }, { onConflict: 'key' });

      if (error) throw new Error(error.message);
      setPhotoUrl(url);
      showToast('Profile photo updated!');
    } catch (err) {
      showToast('Upload failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Remove photo from site_settings ───────────────────────────────────
  const removePhoto = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('key', PHOTO_KEY);

      if (error) throw new Error(error.message);
      setPhotoUrl(null);
      showToast('Profile photo removed.');
    } catch (err) {
      showToast('Failed to remove photo: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return { photoUrl, loading, saving, toast, uploadPhoto, removePhoto };
}
