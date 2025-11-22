// Shared constants
export const CATEGORIES = ["Technology", "Writing", "Business", "Lifestyle"];

export const BG_STYLE = {
  backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center', 
  backgroundAttachment: 'fixed'
};

// Shared API functions
export const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options);
    return { ok: res.ok, data: res.ok ? await res.json() : await res.text() };
  } catch (error) {
    return { ok: false, data: error };
  }
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const result = await apiCall('/api/upload', { method: 'POST', body: formData });
  return result.ok ? result.data.url : null;
};