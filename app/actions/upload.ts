'use server';

import crypto from 'crypto';

export async function uploadToCloudinary(
  base64Data: string,
  folder: string = 'ules_spotlights'
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials missing in environment variables.');
  }

  const timestamp = Math.round(new Date().getTime() / 1000);


  const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Upload to Cloudinary failed');
  }

  let secureUrl = data.secure_url;

  if (secureUrl && secureUrl.includes('/image/upload/') && !secureUrl.includes('/f_auto')) {
    secureUrl = secureUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_1600,c_limit/');
  }

  return secureUrl;
}

export async function extractPublicIdFromCloudinaryUrl(url: string): Promise<string | null> {
  if (!url || !url.includes('res.cloudinary.com')) return null;

  try {
    const uploadIndex = url.indexOf('/image/upload/');
    if (uploadIndex === -1) return null;

    let path = url.substring(uploadIndex + '/image/upload/'.length);

    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    const segments = path.split('/');
    const publicIdSegments = segments.filter((seg) => {
      if (seg.includes(',') || /^[a-z]_[a-zA-Z0-9_-]+$/.test(seg)) return false;
      if (/^v\d+$/.test(seg)) return false;
      return true;
    });

    return publicIdSegments.join('/');
  } catch {
    return null;
  }
}

export async function deleteFromCloudinary(
  urlOrPublicId: string
): Promise<{ success: boolean; result?: string; error?: string }> {
  if (!urlOrPublicId) return { success: false, error: 'No asset identifier provided' };

  // If it's a local path (e.g. /logo/logo-transparent.png), ignore it safely
  if (!urlOrPublicId.includes('res.cloudinary.com') && urlOrPublicId.startsWith('/')) {
    return { success: true, result: 'skipped_local_asset' };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials missing; cannot delete asset.');
    return { success: false, error: 'Cloudinary credentials missing' };
  }

  const publicId = urlOrPublicId.includes('res.cloudinary.com')
    ? await extractPublicIdFromCloudinaryUrl(urlOrPublicId)
    : urlOrPublicId;

  if (!publicId) {
    return { success: false, error: 'Could not extract valid public_id' };
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || data.result !== 'ok') {
      return { success: false, error: data.error?.message || data.result || 'Failed to destroy asset' };
    }

    return { success: true, result: data.result };
  } catch (err: any) {
    console.error('Error deleting asset from Cloudinary:', err);
    return { success: false, error: err?.message || 'Network error during Cloudinary deletion' };
  }
}
