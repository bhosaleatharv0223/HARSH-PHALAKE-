import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinary';

export async function uploadToCloudinary(fileOrBase64, fileName) {
  const formData = new FormData();
  
  if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
    // base64 string (bill image) — convert to blob first
    const res = await fetch(fileOrBase64);
    const blob = await res.blob();
    formData.append('file', blob, fileName);
  } else {
    // actual File object (payment screenshot)
    formData.append('file', fileOrBase64, fileName);
  }
  
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'harshphalke_bookings');
  formData.append('public_id', fileName.replace(/\.[^/.]+$/, ''));
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  if (!response.ok) {
    throw new Error('Upload failed: ' + response.statusText);
  }
  
  const data = await response.json();
  return data.secure_url; // this is the public image URL
}