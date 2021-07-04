import { MutableRefObject } from 'react'

export default class Canvas {
  public readonly ref: MutableRefObject<HTMLCanvasElement>
  public readonly context: CanvasRenderingContext2D

  constructor(ref: MutableRefObject<HTMLCanvasElement>) {
    this.ref = ref
    this.context = this.ref.current.getContext('2d')
    this.ref.current.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  public get width() {
    return this.ref.current.width
  }

  public get height() {
    return this.ref.current.height
  }
}
