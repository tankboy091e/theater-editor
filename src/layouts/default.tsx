import React from 'react'
import styles from 'sass/layouts/default.module.scss'

export default function Layout({
  children,
  header,
  bottom: footer,
}: {
  children: React.ReactNode
  header?: React.ReactNode
  bottom?: React.ReactNode
}) {
  return (
    <>
      <div className={styles.appContainer}>
        {header && <header className={styles.header}>{header}</header>}
        <main className={styles.main}>{children}</main>
      </div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </>
  )
}
