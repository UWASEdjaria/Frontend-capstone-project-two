// Shared constants
export const CATEGORIES = ["Technology", "Writing", "Business", "Lifestyle"];

export const BG_STYLE = {
  backgroundImage: `url("${process.env.NEXT_PUBLIC_BG_IMAGE || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center', 
  backgroundAttachment: 'fixed'
};

// Shared API functions
interface ApiResponse<T = unknown> {
  ok: boolean;
  data: T;
}

export const apiCall = async <T = unknown>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, options);
    return { ok: res.ok, data: res.ok ? await res.json() : await res.text() };
  } catch (error) {
    return { ok: false, data: error as T };
  }
};

interface UploadResponse {
  url: string;
}

export const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  const result = await apiCall<UploadResponse>('/api/upload', { method: 'POST', body: formData });
  return result.ok ? result.data.url : null;
};