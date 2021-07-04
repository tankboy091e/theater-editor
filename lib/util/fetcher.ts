export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init)
  if (!res.ok) {
    throw new Error('An error occured')
  }
  return res.json()
}
