const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const error = new Error(payload.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.details = payload.errors || [];
    throw error;
  }

  return payload.data ?? payload;
}

export const api = {
  listPosts: ({ search = '', tag = '' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tag) params.set('tag', tag);
    const query = params.toString();
    return request(`/posts${query ? `?${query}` : ''}`);
  },
  getPost: (id) => request(`/posts/${id}`),
  createPost: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id, data) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  generateDraft: (prompt) => request('/generate', { method: 'POST', body: JSON.stringify({ prompt }) }),
  health: () => request('/health'),
};
