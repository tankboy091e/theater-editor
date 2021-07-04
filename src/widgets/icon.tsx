import { cn } from 'lib/util'
import { MouseEventHandler } from 'react'
import styles from 'sass/widgets/icon.module.scss'

export default function Icon({
  className,
  src,
  size,
  onClick,
}: {
  className?: string
  src: string
  size? : number
  onClick?: MouseEventHandler
}) {
  return (
    <input
      className={cn(styles.container, className)}
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/icons/${src})`,
      }}
    />
  )
}

Icon.defaultProps = {
  className: null,
  size: 16,
  onClick: null,
}
