import React from 'react'
import styles from 'sass/layouts/default.module.scss'

export default function Layout({
  children,
  header,
  footer,
}: {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <>
      <div className={styles.appContainer}>
        {header && <header className={styles.header}>{header}</header>}
        <main className={styles.main}>{children}</main>
      </div>
      {footer && footer}
    </>
  )
}
