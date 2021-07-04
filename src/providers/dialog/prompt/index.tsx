import React from 'react'
import DialogProvider from '..'
import Inner from './inner'

export default function PromptProvider({ children }: {
  children: React.ReactNode
}) {
  return (
    <DialogProvider>
      <Inner>
        {children}
      </Inner>
    </DialogProvider>
  )
}
