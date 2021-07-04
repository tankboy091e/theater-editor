import { IDraggable } from 'lib/entity'
import { Vector2 } from 'lib/util/mathf'
import getPosition from 'lib/util/mouseEvent'
import Tool, { ToolData, ToolType } from '.'

export default abstract class DraggableTool extends Tool implements IDraggable {
  protected position : Vector2

  constructor(name: ToolType, data: ToolData) {
    super(name, data)
    this.bindDragListeners()
  }

  private bindDragListeners() {
    this.onDrag = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDragCancle = this.onDragCancle.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  public onDragStart(e: MouseEvent): void {
    this.attachListeners()
    this.uiData.origin = this.getPosition(e)
  }

  public onDrag(e: MouseEvent): void {
    this.position = this.getPosition(e)
    const {
      origin, context,
    } = this.uiData
    this.clearUI()
    context.strokeStyle = 'rgba(196, 37, 64, .7)'
    context.strokeRect(
      origin.x,
      origin.y,
      this.position.x - origin.x,
      this.position.y - origin.y,
    )
    context.fillStyle = 'rgba(196, 37, 64, .3)'
    context.fillRect(
      origin.x,
      origin.y,
      this.position.x - origin.x,
      this.position.y - origin.y,
    )
  }

  public onDragEnd(): void {
    this.onDragClear()
  }

  public onDragCancle(): void {
    this.onDragClear()
  }

  public onDragClear() : void {
    this.detachListeners()
    this.clearUI()
  }

  public onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.onDragCancle()
    }
  }

  protected loopRange(func: (i: number, j: number) => void) {
    const { size, gap, cells } = this.gridData

    const { origin } = this.uiData

    const from = {
      x: origin.x < this.position.x ? origin.x : this.position.x,
      y: origin.y < this.position.y ? origin.y : this.position.y,
    }

    const to = {
      x: origin.x > this.position.x ? origin.x : this.position.x,
      y: origin.y > this.position.y ? origin.y : this.position.y,
    }

    const column = {
      min: Math.max(Math.floor(from.y / (size + gap)), 0),
      max: Math.min(Math.round(to.y / (size + gap)), cells.length),
    }
    for (let i = column.min; i < column.max; i++) {
      const row = {
        min: Math.max(Math.floor(from.x / (size + gap)), 0),
        max: Math.min(Math.round(to.x / (size + gap)), cells[i].length),
      }
      for (let j = row.min; j < row.max; j++) {
        func(i, j)
      }
    }
  }

  private calibrateMousePosition = (position: Vector2) => {
    const result = position
    result.x -= this.containerRef.current.offsetLeft - this.containerRef.current.scrollLeft
    result.y -= this.containerRef.current.offsetTop - this.containerRef.current.scrollTop
    return result
  }

  private attachListeners() {
    this.uiData.ref.current.addEventListener('mouseup', this.onDragEnd)
    this.uiData.ref.current.addEventListener('mousemove', this.onDrag)
  }

  private detachListeners() {
    this.uiData.ref.current.removeEventListener('mouseup', this.onDragEnd)
    this.uiData.ref.current.removeEventListener('mousemove', this.onDrag)
  }

  protected getPosition(e: MouseEvent) {
    return this.calibrateMousePosition(getPosition(e))
  }
}
