import React, { MouseEventHandler } from 'react'
import styles from 'sass/components/alert.module.scss'

export interface AlertHeaderProps {
  title?: string
  text: string
}

export default function Alert({
  children,
  header,
  ok,
  cancle,
}: {
  children?: React.ReactNode
  header: AlertHeaderProps
  ok?: MouseEventHandler
  cancle?: MouseEventHandler
}) {
  const { title, text } = header
  return (
    <>
      <h4 className={styles.title}>{title || '안내'}</h4>
      {text && <p className={styles.text}>{text}</p>}
      {children}
      <section className={styles.menu}>
        {ok && (
        <button type="button" onClick={ok}>
          확인
        </button>
        )}
        {cancle && (
        <button type="button" onClick={cancle}>
          취소
        </button>
        )}
      </section>
    </>
  )
}

Alert.defaultProps = {
  children: null,
  ok: null,
  cancle: null,
}
