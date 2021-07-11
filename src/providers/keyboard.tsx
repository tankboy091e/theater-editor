import {
  ReactNode, useContext, createContext, useEffect, useRef,
} from 'react'
import { useModalProvider } from './modal'

export type OnKeyboard = (keys : string | string[], func: () => void) => void

interface Data {
  currentKeys : { [key: string] : boolean }
  callbacks : { [key: string] : () => void }
}

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
  const data : Data = {
    currentKeys: {},
    callbacks: {},
  }

  const { active } = useModalProvider()

  const activeRef = useRef<boolean>(active)

  const onKeyDown = (e: KeyboardEvent) : void => {
    data.currentKeys[e.key.toLowerCase()] = true
    update()
  }

  const onKeyUp = (e: KeyboardEvent) : void => {
    delete data.currentKeys[e.key.toLowerCase()]
  }

  const update = () : void => {
    if (activeRef.current === true) {
      return
    }
    const current = Object.keys(data.currentKeys).join('-')
    for (const [key, element] of Object.entries(data.callbacks)) {
      if (key === current) {
        element.call(null)
        return
      }
    }
  }

  const on = (keys : string | string[], func: () => void) => {
    const key = Array.isArray(keys) ? keys.join('-') : keys
    data.callbacks[key.toLowerCase()] = func
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
