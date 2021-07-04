import { getCookie } from 'lib/util/cookie'
import { GetServerSidePropsContext } from 'next'
import { ACCESS_TOKEN } from 'providers/auth'
import { ParsedUrlQuery } from 'querystring'

export function getApiUrl(url: string): string {
  return `${process.env.API_URL}${url}`
}

type Method = 'GET' | 'POST' | 'UPDATE' | 'DELETE'

interface Protocol {
  url: string
  payload?: any
  options?: RequestInit
  method?: Method
}

async function fetcher({
  url,
  payload,
  options,
  method = 'GET',
  token,
}: Protocol & {
  token?: string
}) {
  const body = options?.body || JSON.stringify(payload)
  const headers: any = options?.headers || {}

  const init: RequestInit = {}

  if (method !== 'GET') {
    init.method = method
  }

  if (body) {
    init.body = body
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (Object.keys(headers).length !== 0) {
    init.headers = headers
  }

  return fetch(getApiUrl(url), {
    ...options,
    ...init,
  })
}

export default async function communicate(props: Protocol): Promise<Response> {
  const token = getCookie(ACCESS_TOKEN)
  return fetcher({
    ...props,
    token,
  })
}

export async function communicateWithContext({
  context,
  ...props
}: Protocol & {
  context: GetServerSidePropsContext<ParsedUrlQuery>
}) {
  const token = context.req.cookies[ACCESS_TOKEN]
  return fetcher({
    ...props,
    token,
  })
}
