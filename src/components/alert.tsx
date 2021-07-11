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
  ok?: () => void
  cancle?: MouseEventHandler
}) {
  const { title, text } = header
  return (
    <form className={styles.form} onSubmit={() => ok()}>
      <h4 className={styles.title}>{title || '안내'}</h4>
      {text && <p className={styles.text}>{text}</p>}
      {children}
      <div className={styles.menu}>
        {ok && (
        <input className={styles.button} type="submit" value="확인" />
        )}
        {cancle && (
        <button className={styles.button} type="button" onClick={cancle}>
          취소
        </button>
        )}
      </div>
    </form>
  )
}

Alert.defaultProps = {
  children: null,
  ok: null,
  cancle: null,
}
