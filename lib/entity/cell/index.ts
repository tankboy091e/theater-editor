import { Vector2 } from 'lib/util/mathf'

export default abstract class Cell {
  public readonly position: Vector2

  constructor(x: number, y: number) {
    this.position = { x, y }
  }

  public draw(context: CanvasRenderingContext2D, size: number) {
    const { x, y } = this.position
    context.strokeStyle = this.strokeStyle
    context.strokeRect(x, y, size, size)
  }

  protected abstract get strokeStyle() : string;
}
