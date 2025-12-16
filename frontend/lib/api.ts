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
  // Fake submission - just return success after a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { 
    success: true, 
    message: 'Submission received! We\'ll review it soon.',
    id: Math.floor(Math.random() * 10000)
  };
}

export async function getSubmission(id: number) {
  return apiCall(`/api/submissions/${id}`);
}

// Admin APIs
export async function getPosts(status?: string) {
  // Fake data - return empty array for now
  await new Promise(resolve => setTimeout(resolve, 500));
  return { 
    success: true, 
    data: [],
    total: 0
  };
}

export async function getPostStats() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { 
    pending: 0,
    approved: 0,
    declined: 0,
    posted: 0
  };
}

export async function getPost(id: number) {
  await new Promise(resolve => setTimeout(resolve, 500));
  throw new Error('Post not found');
}

export async function approvePost(id: number) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Post approved' };
}

export async function declinePost(id: number, declined_message: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Post declined' };
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

