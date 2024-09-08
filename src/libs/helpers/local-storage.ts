import type { ICurrentUserResponse } from '@/modules/auth/types';

import { isClient, isProduction } from '@/configs';

export interface ITokenStorage {
  accessToken: string;
  refreshToken: string;
  user: ICurrentUserResponse;
}

const SIGNATURE = isProduction ? 'signature-web' : 'signature-web-dev';

export function getStoredAuth<T = unknown>(): T | null {
  if (!isClient) return null;

  const storedAuth = localStorage.getItem(SIGNATURE);
  if (!storedAuth) return null;

  return JSON.parse(storedAuth) as T;
}

export function getAccessToken(): string | null {
  const accessToken = getStoredAuth<ITokenStorage>()?.accessToken;

  return accessToken ?? null;
}

export function getRefreshToken(): string | null {
  const refreshToken = getStoredAuth<ITokenStorage>()?.refreshToken;

  return refreshToken ?? null;
}

export function setStoredAuth<T = unknown>(auth: T): void {
  if (!isClient) return;

  localStorage.setItem(SIGNATURE, JSON.stringify(auth));
}

export function clearStoredAuth(): void {
  if (!isClient) return;

  localStorage.removeItem(SIGNATURE);
}

// Set localStorage common
export function getLocalStored<T = unknown>(key: string): T | null {
  if (!isClient) return null;
  const stored = localStorage.getItem(key);

  return stored ? (JSON.parse(stored) as T) : null;
}

export function setLocalStored<T = unknown>(key: string, data: T): void {
  if (!isClient) return;

  localStorage.setItem(key, JSON.stringify(data));
}

export function clearLocalStored(key: string): void {
  if (!isClient) return;

  localStorage.removeItem(key);
}
