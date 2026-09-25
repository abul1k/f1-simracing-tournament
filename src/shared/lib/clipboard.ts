/**
 * The pre-Clipboard-API way of copying: select text in an off-screen
 * textarea and run the copy command. Works in older browsers and on pages
 * served without HTTPS, where `navigator.clipboard` is missing.
 */
const legacyCopy = (text: string): boolean => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.opacity = '0'

  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 * Copies text to the clipboard.
 * @returns Whether the copy went through.
 */
export const copyText = async (text: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or document not focused — try the old way.
    }
  }

  return legacyCopy(text)
}
