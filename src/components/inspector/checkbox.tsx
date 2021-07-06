import Option from 'lib/entity/tool/options'
import { useEffect, useRef } from 'react'

export default function CheckBox({
  option,
}: {
  option: Option
}) {
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    ref.current.checked = option.value
  }, [])

  return (
    <input
      type="checkbox"
      ref={ref}
      onClick={(e) => {
        option.setValue(e.currentTarget.checked)
      }}
    />
  )
}
