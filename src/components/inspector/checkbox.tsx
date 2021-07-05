import { useEffect, useRef } from 'react'
import Tool from 'services/tool'

export default function CheckBox({
  tool,
  head,
  value,
}: {
  tool: Tool
  head: string
  value: boolean
}) {
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    ref.current.checked = value
  }, [])

  return (
    <input
      type="checkbox"
      ref={ref}
      onClick={(e) => {
        tool.setOption(head, e.currentTarget.checked)
      }}
    />
  )
}
