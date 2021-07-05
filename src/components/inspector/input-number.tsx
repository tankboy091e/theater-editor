import { useEffect, useRef } from 'react'
import styles from 'sass/components/inspector.module.scss'
import Tool from 'services/tool'

export default function InputNumber({
  tool,
  head,
  value,
}: {
  tool: Tool
  head: string
  value: number
}) {
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    ref.current.value = value.toString()
  }, [])

  return (
    <input
      type="number"
      ref={ref}
      className={styles.inputNumber}
      onChange={(e) => {
        tool.setOption(head, parseInt(e.target.value, 10))
      }}
    />
  )
}
