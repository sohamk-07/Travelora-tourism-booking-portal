/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  recoveryPin: string;
  createdAt: string;
  role: 'SUPER_ADMIN';
  slotNumber: 1;
}

const ADMIN_SLOT_STORAGE_KEY = 'travelora_admin_account_slot';
const ADMIN_SESSION_STORAGE_KEY = 'travelora_active_admin_session';

/**
 * Returns the single registered admin account, or null if no admin account has been created yet.
 */
export function getAdminAccount(): AdminAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_SLOT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to read admin slot:', e);
    return null;
  }
}

/**
 * Checks whether the single admin account slot is available for registration.
 * Exactly 1 slot is allowed. If claimed, returns false.
 */
export function isAdminSlotAvailable(): boolean {
  return getAdminAccount() === null;
}

/**
 * Registers the single authorized admin account.
 * Throws an error if the single slot is already claimed.
 */
export function registerSingleAdminAccount(data: {
  fullName: string;
  email: string;
  password: string;
  recoveryPin: string;
}): { success: boolean; error?: string; account?: AdminAccount } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window environment not available' };
  }

  // Strict enforcement: only 1 admin account slot ever allowed
  if (!isAdminSlotAvailable()) {
    return {
      success: false,
      error: 'Registration is permanently locked. The single authorized administrative slot (1/1) has already been claimed.'
    };
  }

  if (!data.fullName.trim()) {
    return { success: false, error: 'Full name is required' };
  }

  if (!data.email.trim() || !data.email.includes('@')) {
    return { success: false, error: 'A valid email address is required' };
  }

  if (!data.password || data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }

  if (!data.recoveryPin || data.recoveryPin.length < 4) {
    return { success: false, error: 'A 4-digit security recovery PIN is required' };
  }

  const newAdmin: AdminAccount = {
    id: 'admin-' + Math.random().toString(36).substring(2, 9),
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash: btoa(data.password), // Obfuscated client-side representation
    recoveryPin: data.recoveryPin.trim(),
    createdAt: new Date().toISOString(),
    role: 'SUPER_ADMIN',
    slotNumber: 1
  };

  try {
    localStorage.setItem(ADMIN_SLOT_STORAGE_KEY, JSON.stringify(newAdmin));
    // Automatically log in newly created admin
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(newAdmin));
    return { success: true, account: newAdmin };
  } catch (e) {
    return { success: false, error: 'Failed to save admin credentials to local storage' };
  }
}

/**
 * Authenticates the admin using email and password.
 */
export function loginAdmin(
  email: string,
  password: string
): { success: boolean; error?: string; account?: AdminAccount } {
  const existing = getAdminAccount();
  if (!existing) {
    return {
      success: false,
      error: 'No admin account has been initialized yet. Please claim the single available slot first.'
    };
  }

  if (existing.email.toLowerCase() !== email.trim().toLowerCase()) {
    return { success: false, error: 'Invalid admin email address.' };
  }

  if (existing.passwordHash !== btoa(password)) {
    return { success: false, error: 'Incorrect admin password.' };
  }

  try {
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(existing));
    return { success: true, account: existing };
  } catch (e) {
    return { success: false, error: 'Failed to establish admin session' };
  }
}

/**
 * Recovers or resets the admin password using the 4-digit security PIN.
 */
export function resetAdminPasswordWithPin(
  email: string,
  recoveryPin: string,
  newPassword: string
): { success: boolean; error?: string } {
  const existing = getAdminAccount();
  if (!existing) {
    return { success: false, error: 'No admin account found' };
  }

  if (existing.email.toLowerCase() !== email.trim().toLowerCase()) {
    return { success: false, error: 'Email does not match registered admin account' };
  }

  if (existing.recoveryPin !== recoveryPin.trim()) {
    return { success: false, error: 'Invalid security recovery PIN' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' };
  }

  existing.passwordHash = btoa(newPassword);
  try {
    localStorage.setItem(ADMIN_SLOT_STORAGE_KEY, JSON.stringify(existing));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Failed to update credentials' };
  }
}

/**
 * Retrieves the currently active admin session.
 */
export function getActiveAdminSession(): AdminAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Signs out the currently active admin.
 */
export function logoutAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch (e) {
    console.error('Error logging out admin:', e);
  }
}
