import Cell from 'lib/entity/cell'
import SelectedCell from 'lib/entity/selected-cell'
import { BiSelection } from 'react-icons/bi'
import { EditorData } from '.'
import DraggableTool from './draggable'

export default class AssignTool extends DraggableTool {
  constructor(data: EditorData) {
    super('assign', data)
    this.icon = <BiSelection size={24} />
  }

  public onDragStart(e: MouseEvent): void {
    super.onDragStart(e)
  }

  public onDrag(e: MouseEvent): void {
    super.onDrag(e)

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

    const result = []

    for (let i = Math.floor(from.y / (size + gap)); i < Math.round(to.y / (size + gap)); i++) {
      if (i >= cells.length) {
        continue
      }
      for (let j = Math.floor(from.x / (size + gap)); j < Math.round(to.x / (size + gap)); j++) {
        if (j >= cells[i].length) {
          continue
        }
        const cell = cells[i][j]
        const { x, y } = cell.target.position
        cell.target = new SelectedCell(x, y)
        result.push(cell)
        this.gridData.temporarySelectedCells[`${i}${j}`] = cell
      }
    }

    for (const element of Object.values(this.gridData.temporarySelectedCells)) {
      if (!result.includes(element)) {
        const { x, y } = element.target.position
        element.target = new Cell(x, y)
      }
    }

    this.update()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    this.gridData.temporarySelectedCells = {}
  }

  public onDragCancle(): void {
    for (const element of Object.values(this.gridData.temporarySelectedCells)) {
      const { x, y } = element.target.position
      element.target = new Cell(x, y)
    }
    this.onDragEnd()
    this.update()
  }
}
