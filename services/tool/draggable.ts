import { IDraggable } from 'lib/entity'
import Tool, { ToolData, ToolType } from '.'

export default abstract class DraggableTool extends Tool implements IDraggable {
  protected stokeStyle = 'rgba(0, 90, 244, .7)'
  protected fillStyle = 'rgba(0, 90, 244, .3)'

  constructor(name: ToolType, data: ToolData) {
    super(name, data)
    this.bindDragListeners()
  }

  public onDragStart(e: MouseEvent): void {
    this.attachListeners()
    this.uiData.updateOrigin(e)
  }

  public onDrag(e: MouseEvent): void {
    this.uiData.updatePosition(e)

    this.uiData.drawRange({
      stroke: this.stokeStyle,
      fill: this.fillStyle,
    })
  }

  public onDragEnd(): void {
    this.onDragFinish()
  }

  public onDragCancle(): void {
    this.onDragFinish()
  }

  public onDragFinish() : void {
    this.detachListeners()
    this.uiData.clear()
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

    const location = this.getDragTo()
    this.uiData.indicate(row, column, location.x + 4, location.y)
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
    const { origin, position } = this.uiData
    return {
      x: origin.x < position.x ? origin.x : position.x,
      y: origin.y < position.y ? origin.y : position.y,
    }
  }

  private getDragTo() {
    const { origin, position } = this.uiData
    return {
      x: origin.x > position.x ? origin.x : position.x,
      y: origin.y > position.y ? origin.y : position.y,
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

  private attachListeners() {
    this.uiData.ref.current.addEventListener('mouseup', this.onDragEnd)
    this.uiData.ref.current.addEventListener('mousemove', this.onDrag)
  }

  private detachListeners() {
    this.uiData.ref.current.removeEventListener('mouseup', this.onDragEnd)
    this.uiData.ref.current.removeEventListener('mousemove', this.onDrag)
  }

  private bindDragListeners() {
    this.onDrag = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDragCancle = this.onDragCancle.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }
}
