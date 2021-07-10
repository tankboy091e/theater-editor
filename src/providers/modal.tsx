import { createPortal } from 'react-dom'
import { cn } from 'lib/util'
import React, {
  createContext, useContext, useEffect, useRef, useState,
} from 'react'
import styles from 'sass/providers/modal.module.scss'
import { useRouter } from 'next/router'

type Listener = (this: HTMLDivElement, ev: MouseEvent) => any

interface ModalProviderContextProps {
    active: boolean
    appendToContainer : (component: React.ReactNode) => React.ReactPortal
    attachScrimOnClick : (func : Listener) => void
    detachScrimOnClick : (func : Listener) => void
    update: (state: boolean, delay?: number) => void
}

const ModalProviderContext = createContext<ModalProviderContextProps>(null)

export const useModalProvider = () => useContext(ModalProviderContext)

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement>()
  const scrimRef = useRef<HTMLDivElement>()
  const transitionDelayRef = useRef<number>(0)
  const zIndexHandlerRef = useRef(null)
  const [active, setActive] = useState(false)

  const defaultTransitionDelay = 300

  const appendToContainer = (component: React.ReactNode): React.ReactPortal => createPortal(
    component,
    containerRef.current,
  )

  const attachScrimOnClick = (func: Listener) => {
    scrimRef.current.addEventListener('click', func)
  }

  const detachScrimOnClick = (func: Listener) => {
    scrimRef.current?.removeEventListener('click', func)
  }

  const update = (state : boolean, delay?: number) => {
    transitionDelayRef.current = delay
    if (state) {
      setActive(true)
      return
    }
    checkClose()
  }

  const checkClose = () => {
    if (containerRef.current.childElementCount <= 2) {
      setActive(false)
    }
  }

  const fixBody = () => {
    document.body.style.cssText = `position:fixed; top:${-1 * window.scrollY}px; left: 0; right: 0; margin: 0 auto;`
  }

  const resetBody = () => {
    const scrollY = document.body.style.top
    document.body.style.cssText = 'position: relative; top:"";'
    window.scrollTo(0, -1 * parseInt(scrollY || '0', 10))
  }

  const getDelay = () => transitionDelayRef.current || defaultTransitionDelay

  const onStage = () => {
    const delay = getDelay()
    scrimRef.current.style.transition = `opacity ${delay}ms`
    clearTimeout(zIndexHandlerRef.current)
    containerRef.current.style.zIndex = '98'
  }

  const offStage = () => {
    const delay = getDelay()
    scrimRef.current.style.transition = `opacity ${delay}ms`
    zIndexHandlerRef.current = setTimeout(() => {
      containerRef.current.style.zIndex = '-1'
    }, delay)
  }

  useEffect(() => {
    if (active) {
      onStage()
      fixBody()
    } else {
      offStage()
      resetBody()
    }
  }, [active])

  useEffect(() => {
    checkClose()
  }, [router])

  const value = {
    active,
    appendToContainer,
    attachScrimOnClick,
    detachScrimOnClick,
    update,
  }

  return (
    <ModalProviderContext.Provider value={value}>
      {children}
      <div className={styles.container} ref={containerRef}>
        <div
          className={cn(styles.scrim, active && styles.active)}
          ref={scrimRef}
        />
      </div>
    </ModalProviderContext.Provider>
  )
}
