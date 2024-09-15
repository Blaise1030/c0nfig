import { BASE_URL } from "./constant";

export async function fetchConfig() {
  const res = await fetch(`${BASE_URL}/assets/config.json`)
  const config = await res.json()
  return config;
}

// async function fetchFilesAsString(path: string) {
//   const res = await fetch(`${BASE_URL}/assets${path}`)
//   const content = await res.text()
//   return content
// }