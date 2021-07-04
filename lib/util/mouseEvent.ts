export default function getPosition(
  e: MouseEvent | TouchEvent,
): { x: number; y: number } {
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
