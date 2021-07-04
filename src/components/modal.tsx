import React, {
  createContext, MutableRefObject, SetStateAction, useContext, useEffect, useState,
} from 'react'
import styles from 'sass/components/modal.module.scss'
import { useModalProvider } from 'providers/modal'
import { cn } from 'lib/util'

type State = 'hidden' | 'ready' | 'open' | 'close' | 'finish'

interface TransitionProperties {
  opacity?: number
  transform?: string
}

interface TransitionData extends TransitionProperties {
  duration: number
}

interface Transition {
  default: TransitionProperties
  onActive?: TransitionData
  onInactive?: TransitionData
}

interface Props {
  className?: string,
  ref?: MutableRefObject<HTMLDivElement>
  children: React.ReactNode
  initializer?: React.ReactNode
  immediate? : boolean
  controller?: React.Dispatch<SetStateAction<State>>
  onClose? : () => void
  transition?: Transition
}

interface ModalContextProps {
  close: () => void
}

const ModalContext = createContext<ModalContextProps>(null)

export const useModal = () => useContext(ModalContext)

export default function Modal({
  className,
  ref,
  children,
  initializer,
  immediate,
  controller,
  onClose,
  transition,
}: Props) {
  const intializeState = immediate ? 'ready' : 'hidden'

  const [state, setState] = controller
    ? [intializeState, controller]
    : useState<State>(intializeState)

  const transitionList = {
    ready: transition?.default,
    open: transition?.onActive,
    close: transition?.onInactive,
  }

  const {
    appendToContainer,
    attachScrimOnClick,
    detachScrimOnClick,
    update,
  } = useModalProvider()

  const close = () => {
    setState('close')
  }

  const open = () => {
    setState('ready')
  }

  const runCycle = (currentState: string) => {
    switch (currentState) {
      case 'ready':
        setState('open')
        break
      case 'open':
        update(true, transition?.onActive?.duration)
        break
      case 'close':
        update(false, transition?.onInactive?.duration)
        setTimeout(
          () => setState('finish'),
          transition?.onInactive?.duration || 0,
        )
        break
      case 'finish':
        onClose?.call(null)
        setState('hidden')
        break
      default:
        break
    }
  }

  const getStyle = (curentState : string) => {
    if (curentState === 'hidden' || curentState === 'finish') {
      return null
    }

    const currentTransition = transitionList[curentState]

    if (!currentTransition) {
      return null
    }

    const { opacity, transform } = currentTransition

    return {
      opacity,
      transform,
      transitionProperty: 'transform, opacity',
      transitionDuration: `${currentTransition.duration || 0}ms`,
    }
  }

  useEffect(() => {
    runCycle(state)
  }, [state])

  useEffect(() => {
    attachScrimOnClick(close)
    return () => detachScrimOnClick(close)
  }, [])

  const value = {
    close,
  }

  return (
    <ModalContext.Provider value={value}>
      {initializer && (
        <button type="button" onClick={open}>
          {initializer}
        </button>
      )}
      {(state !== 'hidden' && state !== 'finish') && appendToContainer(
        <section
          ref={ref}
          className={cn(styles.container, className)}
          style={getStyle(state)}
        >
          {children}
        </section>,
      )}
    </ModalContext.Provider>
  )
}

Modal.defaultProps = {
  className: null,
  ref: null,
  initializer: null,
  immediate: false,
  controller: null,
  onClose: null,
  transition: null,
}
