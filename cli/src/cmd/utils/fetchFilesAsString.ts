import { BASE_URL } from "./constant"

export async function fetchFilesAsString(path: string) {
  const res = await fetch(`${BASE_URL}/assets${path}`)
  const content = await res.text()
  return content
}