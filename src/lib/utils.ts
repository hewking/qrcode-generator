export const handleClipboardRead = async () => {
  try {
    const text = await navigator.clipboard.readText()
    return text
  } catch (err) {
    console.error('Failed to read clipboard:', err)
    return null
  }
} 