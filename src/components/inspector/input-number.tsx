import Option from 'lib/entity/tool/options'
import { useEffect, useRef } from 'react'
import styles from 'sass/components/inspector.module.scss'

export default function InputNumber({
  option,
}: {
  option: Option
}) {
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    ref.current.value = option.value.toString()
  }, [])

  return (
    <input
      type="number"
      ref={ref}
      className={styles.inputNumber}
      onChange={(e) => {
        option.setValue(parseInt(e.target.value, 10))
      }}
    />
  )
}
