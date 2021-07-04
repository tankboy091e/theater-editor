export function clamp(x: number, min: number, max: number) {
  if (x < min) {
    return min
  }
  if (x > max) {
    return max
  }
  return x
}

export interface Vector2 {
  x: number,
  y: number,
}
