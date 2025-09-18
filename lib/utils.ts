import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent number formatting for client and server
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

// Format points with consistent formatting
export function formatPoints(points: number): string {
  return `${formatNumber(points)} pts`
}
