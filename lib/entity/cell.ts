import { Vector2 } from 'lib/util/mathf'

export default class Cell {
  public readonly position: Vector2
  private readonly color: string

  constructor(x: number, y: number, color: string) {
    this.position = {
      x,
      y,
    }
    this.color = color
  }

  public draw(context: CanvasRenderingContext2D, size: number) {
    const { x, y } = this.position
    context.strokeStyle = this.color
    context.strokeRect(x, y, size, size)
  }
}
