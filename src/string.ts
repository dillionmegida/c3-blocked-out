export function removeSpaces(string: string) {
  return string.trim().replace(/\s+/gi, "-").toLowerCase()
}
