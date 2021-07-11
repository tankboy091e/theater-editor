import {
  ReactNode, useContext, createContext, useEffect, useRef,
} from 'react'
import { useModalProvider } from './modal'

export type OnKeyboard = (keys : string | string[], func: () => void) => void

interface KeyboardContextProps {
  on: OnKeyboard
}

const KeyboardContext = createContext<KeyboardContextProps>(null)

export const useKeyboard = () => useContext(KeyboardContext)

export default function KeyboardProvider({
  children,
} : {
  children: ReactNode
}) {
  const { active } = useModalProvider()

  const currentKeyRef = useRef<{ [key: string] : boolean }>({})
  const callbacksRef = useRef<{ [key: string] :() => void }>({})

  const activeRef = useRef<boolean>(active)

  const onKeyDown = (e: KeyboardEvent) : void => {
    currentKeyRef.current[e.key.toLowerCase()] = true
    update()
  }

  const onKeyUp = (e: KeyboardEvent) : void => {
    delete currentKeyRef.current[e.key.toLowerCase()]
  }

  const update = () : void => {
    if (activeRef.current === true) {
      return
    }

    const current = Object.keys(currentKeyRef.current).join('-')
    for (const [key, element] of Object.entries(callbacksRef.current)) {
      if (key === current) {
        element.call(null)
        return
      }
    }
  }

  const on = (keys : string | string[], func: () => void) => {
    const key = Array.isArray(keys) ? keys.join('-') : keys
    callbacksRef.current[key.toLowerCase()] = func
  }

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  }, [])

  const value = {
    on,
  }

  return <KeyboardContext.Provider value={value}>{children}</KeyboardContext.Provider>
}
