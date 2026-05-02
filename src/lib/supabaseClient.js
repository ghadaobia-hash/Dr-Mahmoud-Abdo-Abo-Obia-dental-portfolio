import { createClient } from '@supabase/supabase-js';

// ─── Supabase credentials from .env ──────────────────────────────────────────
// Make sure your .env file contains:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️  Supabase env vars missing. Check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Storage helpers ──────────────────────────────────────────────────────────

/**
 * Upload a File to a Supabase Storage bucket.
 * Returns the public URL.
 * @param {'cases' | 'certificates' | 'profile'} bucket
 * @param {File} file
 * @returns {Promise<string>} public URL
 */
export async function uploadFile(bucket, file) {
  const ext         = file.name.split('.').pop();
  const uniqueName  = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(uniqueName, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Resolve a form image field to a final URL string.
 *   - { file: File, preview: string }  → uploads to storage, returns URL
 *   - { file: null, preview: string }  → existing URL, returns as-is
 *   - null / undefined                 → returns null
 * @param {{ file: File|null, preview: string }|null} field
 * @param {'cases' | 'certificates' | 'profile'} bucket
 * @returns {Promise<string|null>}
 */
export async function resolveField(field, bucket) {
  if (!field) return null;
  if (field.file) return await uploadFile(bucket, field.file);
  return field.preview || null;
}
