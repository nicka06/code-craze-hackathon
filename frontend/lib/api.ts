/**
 * API Client
 * Functions to interact with backend API
 */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Include cookies
    headers: {
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth APIs
export async function login(username: string, password: string) {
  // Hardcoded credentials check
  if (username === 'admin' && password === 'admin123') {
    // Fake successful login
    localStorage.setItem('isAuthenticated', 'true');
    return { success: true, message: 'Login successful' };
  } else {
    throw new Error('Invalid username or password');
  }
}

export async function logout() {
  localStorage.removeItem('isAuthenticated');
  return { success: true };
}

export async function verifyAuth() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (isAuthenticated) {
    return { success: true };
  } else {
    throw new Error('Not authenticated');
  }
}

// Submission APIs
export async function submitPost(formData: FormData) {
  // Real submission - saves to DB, uploads files, sends emails
  return apiCall('/api/submissions', {
    method: 'POST',
    body: formData, // multipart/form-data
  });
}

export async function getSubmission(id: number) {
  return apiCall(`/api/submissions/${id}`);
}

// Admin APIs (REAL - calls backend)
export async function getPosts(status?: string) {
  const query = status ? `?status=${status}` : '';
  return apiCall(`/api/admin/posts${query}`);
}

export async function getPostStats() {
  return apiCall('/api/admin/posts/stats');
}

export async function getPost(id: number) {
  return apiCall(`/api/admin/posts/${id}`);
}

export async function approvePost(id: number) {
  return apiCall(`/api/admin/posts/${id}/approve`, {
    method: 'PATCH',
  });
}

export async function declinePost(id: number, declined_message: string) {
  return apiCall(`/api/admin/posts/${id}/decline`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ declined_message }),
  });
}

export async function publishPost(id: number) {
  return apiCall(`/api/admin/posts/${id}/publish`, {
    method: 'POST',
  });
}

// Access Request API
export async function submitAccessRequest(email: string, message: string) {
  return apiCall('/api/access-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, message }),
  });
}

