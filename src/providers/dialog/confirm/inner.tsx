import React, {
  createContext, useContext,
} from 'react'
import Alert, { AlertHeaderProps } from 'components/alert'
import styles from 'sass/components/alert.module.scss'
import { useDialog } from '..'

interface ConfirmContextProps {
  createConfirm: ({ ...props }: AlertHeaderProps) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextProps>(null)

export const useConfirm = () => useContext(ConfirmContext)

export default function Inner({ children }: {
  children?: React.ReactNode
}) {
  const { buildDialog } = useDialog()

  const createConfirm = (header: AlertHeaderProps): Promise<boolean> => buildDialog({
    className: styles.container,
  })
    .insert(({ ok, cancle }) => (
      <Alert
        header={header}
        ok={ok}
        cancle={cancle}
      />
    ))
    .open()

  const value = {
    createConfirm,
  }

  return (
    <ConfirmContext.Provider value={value}>
      {children}
    </ConfirmContext.Provider>
  )
}

Inner.defaultProps = {
  children: null,
}
