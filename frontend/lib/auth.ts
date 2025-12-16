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
    await api.verifyAuth();
    // Return fake admin data
    return {
      id: 1,
      username: 'admin',
      account_ids: [1],
      created_at: new Date().toISOString()
    };
  } catch {
    return null;
  }
}

// Login
export async function handleLogin(username: string, password: string): Promise<Admin> {
  await api.login(username, password);
  // Return fake admin data
  return {
    id: 1,
    username: 'admin',
    account_ids: [1],
    created_at: new Date().toISOString()
  };
}

// Logout
export async function handleLogout(): Promise<void> {
  await api.logout();
}

