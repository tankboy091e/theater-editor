import NumberOption from 'lib/entity/tool/options/number'
import { useEffect, useRef } from 'react'
import styles from 'sass/components/inspector/option.module.scss'

export default function InputNumber({
  option,
}: {
  option: NumberOption
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
