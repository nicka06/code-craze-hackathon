/**
 * Auth Helpers
 * Client-side authentication utilities
 */

import { Admin } from './types';
import * as api from './api';

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    await api.verifyAuth();
    return true;
  } catch {
    return false;
  }
}

// Get current admin user
export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
    const response = await api.verifyAuth();
    return response.admin;
  } catch {
    return null;
  }
}

// Login
export async function handleLogin(username: string, password: string): Promise<Admin> {
  const response = await api.login(username, password);
  return response.admin;
}

// Logout
export async function handleLogout(): Promise<void> {
  await api.logout();
}

