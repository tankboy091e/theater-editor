import AssignedCell from 'lib/entity/cell/assigned'
import DefaultCell from 'lib/entity/cell/default'
import SelectedCell from 'lib/entity/cell/selected'
import { ToolData } from '.'
import DraggableTool from './draggable'

export default class AssignTool extends DraggableTool {
  constructor(data: ToolData) {
    super('assign', data)
  }

  public onDrag(e: MouseEvent): void {
    super.onDrag(e)
    this.indicate()

    const result = []
    this.loopRange((i, j) => {
      const cell = this.gridData.cells[i][j]
      result.push(cell)

      if (cell.target instanceof DefaultCell) {
        this.gridData.selectTemporaryCell(i, j)
        const { x, y } = cell.target.position
        cell.previous = cell.target
        cell.target = new SelectedCell(x, y)
      }
    })

    this.gridData.temporarySelectedCells.forEach((element) => {
      if (!result.includes(element)) {
        element.target = element.previous
        this.gridData.deleteTemporaryCell(element)
      }
    })

    this.updateGrid()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    this.gridData.temporarySelectedCells.forEach((element) => {
      const { x, y } = element.target.position
      element.target = new AssignedCell(x, y)
    })

    this.gridData.assignTemporaryCell()
    this.gridData.initializeTemporaryCell()

    this.updateGrid()
  }

  public onDragCancle(): void {
    super.onDragCancle()

    this.gridData.temporarySelectedCells.forEach((element) => {
      if (this.gridData.assignedCells.includes(element)) {
        return
      }
      element.target = element.previous
    })

    this.gridData.initializeTemporaryCell()

    this.updateGrid()
  }
}
