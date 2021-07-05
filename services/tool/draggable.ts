import { IDraggable } from 'lib/entity'
import { Vector2 } from 'lib/util/mathf'
import getPosition from 'lib/util/mouseEvent'
import Tool, { ToolData, ToolType } from '.'

export default abstract class DraggableTool extends Tool implements IDraggable {
  protected position : Vector2
  protected static stokeStyle = 'rgba(196, 37, 64, .7)'
  protected static fillStyle = 'rgba(196, 37, 64, .3)'

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
    context.strokeStyle = DraggableTool.stokeStyle
    context.strokeRect(
      origin.x,
      origin.y,
      this.position.x - origin.x,
      this.position.y - origin.y,
    )
    context.fillStyle = DraggableTool.fillStyle
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

  protected indicate() {
    const { row, column } = this.getTemporaryGridRange()
    if (row < 1 || column < 1) {
      return
    }

    const { context } = this.uiData
    const to = this.getDragTo()
    const size = 16

    context.font = `${size}px Lato`
    context.fillStyle = 'rgba(0, 0, 0, .8)'
    context.fillText(`${row}×${column}`, to.x + 4, to.y)
  }

  protected loopRange(func: (i: number, j: number) => void) {
    const column = this.getColumn()
    for (let i = column.min; i < column.max; i++) {
      const row = this.getRow(i)
      for (let j = row.min; j < row.max; j++) {
        func(i, j)
      }
    }
  }

  private getDragRange() {
    return {
      from: this.getDragFrom(),
      to: this.getDragTo(),
    }
  }

  private getDragFrom() {
    const { origin } = this.uiData
    return {
      x: origin.x < this.position.x ? origin.x : this.position.x,
      y: origin.y < this.position.y ? origin.y : this.position.y,
    }
  }

  private getDragTo() {
    const { origin } = this.uiData
    return {
      x: origin.x > this.position.x ? origin.x : this.position.x,
      y: origin.y > this.position.y ? origin.y : this.position.y,
    }
  }

  private getColumn() {
    const { size, gap, cells } = this.gridData
    const { from, to } = this.getDragRange()
    return {
      min: Math.max(Math.floor(from.y / (size + gap)), 0),
      max: Math.min(Math.round(to.y / (size + gap)), cells.length),
    }
  }

  private getRow(column: number) {
    const { size, gap, cells } = this.gridData
    const { from, to } = this.getDragRange()
    return {
      min: Math.max(Math.floor(from.x / (size + gap)), 0),
      max: Math.min(Math.round(to.x / (size + gap)), cells[column].length),
    }
  }

  private getTemporaryGridRange() {
    const columnRange = this.getColumn()
    const rowRange = this.getRow(columnRange.min)
    return {
      row: rowRange.max - rowRange.min,
      column: columnRange.max - columnRange.min,
    }
  }

  private calibrateMousePosition(position: Vector2) {
    const result = position
    const rect = this.containerRef.current.getBoundingClientRect()
    result.x -= rect.left - this.containerRef.current.scrollLeft
    result.y -= rect.top - this.containerRef.current.scrollTop
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
