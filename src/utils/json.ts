export function isJsonString(str: string) {
  const regex = /,(?!\s*?[{["'\w])/g

  const json = str.trim().replace(regex, "")

  try {
    return JSON.parse(json)
  } catch (e) {
    return false
  }
}
