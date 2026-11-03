import { supabase } from './supabaseClient';

/**
 * Upload an image file to Supabase Storage with local dataURL fallback.
 * 
 * If Supabase is online and the bucket exists, it returns the public CDN URL.
 * If Supabase connection fails (e.g. offline, mock mode, or missing bucket),
 * it seamlessly converts the file into a base64 DataURL so that user-uploaded photos
 * immediately display everywhere across all views without breaking!
 */
export async function uploadImageWithFallback(
  file: File,
  bucket = 'rotaract_images'
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    }
  } catch (err) {
    console.warn('Supabase storage upload failed, falling back to local DataURL reader:', err);
  }

  // Fallback: Read as Base64 Data URL so the UI always works reliably!
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file buffer as string'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

