import { Vector2 } from './mathf'

export default function getPosition(
  e: MouseEvent | TouchEvent,
): Vector2 {
  if ('touches' in e) {
    const touch = e.touches[0]
    return {
      x: touch.clientX,
      y: touch.clientY,
    }
  }
  return {
    x: e.clientX,
    y: e.clientY,
  }
}
