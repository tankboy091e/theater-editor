import { MutableRefObject } from 'react'

export default abstract class Canvas {
  public readonly ref: MutableRefObject<HTMLCanvasElement>
  protected readonly containerRef: MutableRefObject<HTMLElement>
  protected readonly context: CanvasRenderingContext2D

  constructor(
    ref: MutableRefObject<HTMLCanvasElement>,
    containerRef: MutableRefObject<HTMLElement>,
  ) {
    this.ref = ref
    this.containerRef = containerRef
    this.context = this.ref.current.getContext('2d')
    this.ref.current.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  public get width() {
    return this.ref.current.width
  }

  public get height() {
    return this.ref.current.height
  }

  public update() : void {
    this.clear()
  }

  public clear() {
    this.context.clearRect(0, 0, this.width, this.height)
  }
}
