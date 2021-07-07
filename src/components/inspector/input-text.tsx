import TextOption from 'lib/entity/tool/options/text'
import { useEffect, useRef } from 'react'
import styles from 'sass/components/inspector/option.module.scss'

export default function InputText({
  option,
}: {
  option: TextOption
}) {
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    ref.current.value = option.value
  }, [])

  return (
    <input
      type="text"
      ref={ref}
      className={styles.inputNumber}
      onChange={(e) => option.setValue(e.target.value)}
    />
  )
}
