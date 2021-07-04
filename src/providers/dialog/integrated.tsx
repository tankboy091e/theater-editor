import React from 'react'
import AlertProvider from './alert'
import ConfirmProvider from './confirm'
import PromptProvider from './prompt'

export default function IntegratedDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AlertProvider>
      <ConfirmProvider>
        <PromptProvider>{children}</PromptProvider>
      </ConfirmProvider>
    </AlertProvider>
  )
}
