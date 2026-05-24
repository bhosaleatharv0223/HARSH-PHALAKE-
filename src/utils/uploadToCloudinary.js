import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinary';

export async function uploadToCloudinary(fileOrBase64, fileName) {
  console.log('CLOUD NAME:', CLOUDINARY_CLOUD_NAME);
  console.log('PRESET:', CLOUDINARY_UPLOAD_PRESET);

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary config missing. Check .env file has VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
  }

  const formData = new FormData();
  
  if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
    const res = await fetch(fileOrBase64);
    const blob = await res.blob();
    formData.append('file', blob, fileName);
  } else {
    formData.append('file', fileOrBase64, fileName);
  }
  
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'harshphalke_bookings');
  
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  console.log('Uploading to:', url);
  
  const response = await fetch(url, { method: 'POST', body: formData });
  
  if (!response.ok) {
    const err = await response.json();
    console.error('Cloudinary error:', err);
    throw new Error('Upload failed: ' + (err.error?.message || response.status));
  }
  
  const data = await response.json();
  console.log('Upload success:', data.secure_url);
  return data.secure_url;
}