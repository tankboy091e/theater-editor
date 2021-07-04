import { Vector2 } from 'lib/util/mathf'
import { MutableRefObject } from 'react'
import Canvas from './canvas'
import Grid from './grid'

export default class Ui extends Canvas {
  public origin: Vector2
  constructor(ref: MutableRefObject<HTMLCanvasElement>, gridData: Grid) {
    super(ref)
    this.ref.current.width = gridData.width
    this.ref.current.height = gridData.height
  }
}
