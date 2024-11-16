import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleClipboardRead = async () => {
  try {
    const text = await navigator.clipboard.readText()
    return text
  } catch (err) {
    console.error('Failed to read clipboard:', err)
    return null
  }
} 