import React, { createContext, useContext, useRef } from 'react'
import Alert, { AlertHeaderProps } from 'components/alert'
import styles from 'sass/components/alert.module.scss'
import { useDialog } from '..'

interface PromptMessageProps extends AlertHeaderProps {
  type?: InputType
}

interface PromptContextProps {
  createPrompt: ({ ...props }: PromptMessageProps) => Promise<string>
}

const PromptContext = createContext<PromptContextProps>(null)
export const usePrompt = () => useContext(PromptContext)

type InputType = 'text' | 'password'

export type CreatePrompt = (props: PromptMessageProps) => Promise<string>

export default function Inner({ children }: { children?: React.ReactNode }) {
  const { buildDialog } = useDialog()

  const inputRef = useRef<string>()

  const initializeInputRef = () => {
    inputRef.current = null
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputRef.current = e.target.value
  }

  const createPrompt : CreatePrompt = async ({
    type = 'text',
    ...header
  }) => {
    const res = await buildDialog({
      className: styles.container,
    })
      .insert(({ ok, cancle }) => (
        <Alert
          header={header}
          ok={ok}
          cancle={cancle}
        >
          <input
            type={type}
            autoComplete="off"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={onInputChange}
          />
        </Alert>
      ))
      .open()

    const result = inputRef.current

    initializeInputRef()

    if (!res || !result) {
      return null
    }

    return result
  }

  const value = {
    createPrompt,
  }

  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  )
}

Inner.defaultProps = {
  children: null,
}
