import SelectOption from 'lib/entity/tool/options/select'
import { useEffect, useRef } from 'react'
import styles from 'sass/components/inspector/option.module.scss'

export default function Select({ option }: { option: SelectOption }) {
  const ref = useRef<HTMLSelectElement>()

  useEffect(() => {
    ref.current.value = option.value.toString()
  }, [])

  return (
    <select
      ref={ref}
      className={styles.select}
      onChange={(e) => {
        option.setValue(e.target.value)
      }}
    >
      {option.values.map((value) => (
        <option value={value}>{value}</option>
      ))}
    </select>
  )
}
