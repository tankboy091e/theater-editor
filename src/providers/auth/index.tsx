import communicate from 'lib/api'
import { deleteCookie, getCookie, setCookie } from 'lib/util/cookie'
import { useRouter } from 'next/dist/client/router'
import React, {
  createContext, useContext, useEffect, useState,
} from 'react'

export const ACCESS_TOKEN = 'accessToken'
export const REFRESH_TOKEN = 'refreshToken'

interface User {
  accessToken: string
}

interface AuthProps {
  user: User
  authenticate: (provider: string, token: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthProps>(null)

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const [user, setUser] = useState<User>(null)

  const tokenExpiration = 1000 * 60 * 30
  const refreshTokenExpiration = 1000 * 60 * 60 * 24 * 7
  const silentRefreshInterval = 1000 * 60 * 29

  const authenticate = async (provider: string, token: string) : Promise<void> => {
    const payload: any = {
      resource: provider,
      token,
    }
    const res = await communicate({
      url: '/...',
      payload,
      method: 'POST',
    })
    if (res.ok) {
      await onResponse(res)
      router.push('/')
      return
    }
    onFail()
  }

  const isValidToken = (token : string) : boolean => token !== null && typeof token !== 'undefined' && token !== 'undefined'

  const silentRefresh = async () : Promise<void> => {
    const refreshToken = getCookie(REFRESH_TOKEN)
    if (!isValidToken(refreshToken)) {
      if (user) {
        signOut()
      }
      return
    }
    const payload: any = {
      refreshToken,
    }
    const res = await communicate({
      url: '/...',
      payload,
      method: 'POST',
    })
    if (res.ok) {
      onResponse(res)
      return
    }
    onFail()
  }

  const onResponse = async (res: Response) : Promise<void> => {
    const data = await res.json()
    const { accessToken, refreshToken } = data
    setCookie(ACCESS_TOKEN, accessToken, tokenExpiration)
    if (refreshToken) {
      setCookie(REFRESH_TOKEN, refreshToken, refreshTokenExpiration)
    }
    setUser({
      accessToken,
    })
    setTimeout(silentRefresh, silentRefreshInterval)
  }

  const onFail = () : void => {
    router.push('/login/error')
  }

  const signOut = async () : Promise<void> => {
    deleteCookie(ACCESS_TOKEN)
    deleteCookie(REFRESH_TOKEN)
    setUser(null)
    router.reload()
  }

  useEffect(() => {
    silentRefresh()
  }, [])

  const value = {
    user,
    authenticate,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
