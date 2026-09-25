/** Saves a blob to the viewer's device under the given file name. */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Revoked on the next tick — some browsers still read the URL after the
  // click handler returns.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
