import ColorOption from 'lib/entity/tool/options/color'
import { useEffect, useRef } from 'react'
import styles from 'sass/components/inspector/option.module.scss'

export default function InputColor({
  option,
}: {
  option: ColorOption
}) {
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    ref.current.value = option.value
  }, [])

  return (
    <input
      type="color"
      ref={ref}
      className={styles.inputColor}
      onChange={(e) => option.setValue(e.target.value)}
    />
  )
}
