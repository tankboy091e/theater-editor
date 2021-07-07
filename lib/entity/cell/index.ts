import { Vector2 } from 'lib/util/mathf'

export interface DefaultProps {
  x: number
  y: number
  direction?: Direction
}

export type Direction = 'horizontal' | 'vertical'

export default abstract class Cell {
  public readonly position: Vector2
  protected _direction: Direction

  constructor({ x, y, direction }: DefaultProps) {
    this.position = { x, y }
    this._direction = direction
  }

  public get direction() {
    return this._direction
  }

  public get props() {
    const { x, y } = this.position
    const direction = this._direction
    return { x, y, direction }
  }

  protected abstract get strokeStyle() : string;

  public draw(context: CanvasRenderingContext2D, size: number) {
    const { x, y } = this.position
    context.strokeStyle = this.strokeStyle
    context.strokeRect(x, y, size, size)
  }
}
