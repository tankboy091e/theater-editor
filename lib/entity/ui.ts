/* eslint-disable no-underscore-dangle */
import { Vector2 } from 'lib/util/mathf'
import getPosition from 'lib/util/mouseEvent'
import { MutableRefObject } from 'react'
import Canvas from './canvas'
import Grid from './grid'

export default class Ui extends Canvas {
  private static readonly defaultStrokeStyle = 'rgba(0, 0, 0, 1)'
  private static readonly defaultFillStyle = 'rgba(0, 0, 0, 0)'

  private _origin: Vector2
  private _position: Vector2

  constructor(
    ref: MutableRefObject<HTMLCanvasElement>,
    containerRef: MutableRefObject<HTMLElement>,
    gridData: Grid,
  ) {
    super(ref, containerRef)
    this.ref.current.width = gridData.width
    this.ref.current.height = gridData.height
  }

  public get origin() : Vector2 {
    return this._origin
  }

  public get position(): Vector2 {
    return this._position
  }

  public drawRange(style?: { stroke: string, fill: string}) {
    this.clear()
    this.context.strokeStyle = style?.stroke || Ui.defaultStrokeStyle
    this.context.strokeRect(
      this.origin.x,
      this.origin.y,
      this.position.x - this.origin.x,
      this.position.y - this.origin.y,
    )
    this.context.fillStyle = style.fill || Ui.defaultFillStyle
    this.context.fillRect(
      this.origin.x,
      this.origin.y,
      this.position.x - this.origin.x,
      this.position.y - this.origin.y,
    )
  }

  public indicate(row: number, column: number, x: number, y: number) {
    if (row < 1 || column < 1) {
      return
    }
    this.context.font = '16px Lato'
    this.context.fillStyle = 'rgba(0, 0, 0, .8)'
    this.context.fillText(`${row}×${column}`, x, y)
  }

  public updateOrigin(e: MouseEvent) {
    this._origin = this.getPosition(e)
  }

  public updatePosition(e: MouseEvent) {
    this._position = this.getPosition(e)
  }

  protected getPosition(e: MouseEvent) {
    return this.calibrateMousePosition(getPosition(e))
  }

  private calibrateMousePosition(position: Vector2) {
    const result = position
    const { current } = this.containerRef
    const rect = current.getBoundingClientRect()
    result.x -= rect.left - current.scrollLeft
    result.y -= rect.top - current.scrollTop
    return result
  }
}
