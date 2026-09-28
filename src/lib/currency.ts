/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Currency } from '../types';

// Approximate conversion rate: 1 USD ≈ 84 INR
export const INR_TO_USD_RATE = 0.012;
export const USD_TO_INR_RATE = 83.5;

/**
 * Formats a number to Indian Rupee currency format (e.g., ₹14,999 or ₹1,25,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats price according to selected currency
 */
export function formatPrice(amountInINR: number, currency: Currency = 'INR'): string {
  if (currency === 'USD') {
    const usd = Math.round(amountInINR * INR_TO_USD_RATE);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(usd);
  }
  return formatINR(amountInINR);
}
