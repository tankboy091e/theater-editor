import React, {
  createContext, useContext,
} from 'react'
import Alert, { AlertHeaderProps } from 'components/alert'
import styles from 'sass/components/alert.module.scss'
import { useDialog } from '..'

interface AlertContextProps {
  createAlert: ({ ...props }: AlertHeaderProps) => Promise<boolean>
}

const AlertContext = createContext<AlertContextProps>(null)

export const useAlert = () => useContext(AlertContext)

export default function Inner({ children }: {
  children?: React.ReactNode
}) {
  const { buildDialog } = useDialog()

  const createAlert = (header : AlertHeaderProps): Promise<boolean> => buildDialog({
    className: styles.container,
  }).insert(<Alert header={header} />).open()

  const value = {
    createAlert,
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  )
}

Inner.defaultProps = {
  children: null,
}
