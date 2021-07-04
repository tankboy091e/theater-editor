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

    for (let
      i = Math.floor(from.y / (size + gap));
      i < Math.min(Math.round(to.y / (size + gap)), cells.length);
      i++
    ) {
      for (let
        j = Math.floor(from.x / (size + gap));
        j < Math.min(Math.round(to.x / (size + gap)), cells[i].length);
        j++
      ) {
        const cell = cells[i][j]
        this.gridData.temporaryAssignedCells[`${i}${j}`] = cell
        result.push(cell)

        if (cell.target instanceof Cell) {
          const { x, y } = cell.target.position
          cell.target = new SelectedCell(x, y)
        }
      }
    }

    for (const element of Object.values(this.gridData.temporaryAssignedCells)) {
      if (!result.includes(element)) {
        const assigendCells = Object.values(this.gridData.assignedCells)
        if (assigendCells.length > 0) {
          if (assigendCells.includes(element)) {
            continue
          }
        }
        const { x, y } = element.target.position
        element.target = new Cell(x, y)
      }
    }

    this.update()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    const selected = this.gridData.temporaryAssignedCells
    this.gridData.temporaryAssignedCells = {}

    const previous = this.gridData.assignedCells
    this.gridData.assignedCells = { ...previous, ...selected }
  }

  public onDragCancle(): void {
    this.onDragEnd()
    for (const element of Object.values(this.gridData.temporaryAssignedCells)) {
      const { x, y } = element.target.position
      element.target = new Cell(x, y)
    }
    this.update()
  }
}
