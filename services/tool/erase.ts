import DefaultCell from 'lib/entity/cell/default'
import ErasedCell from 'lib/entity/cell/erased'
import SelectedCell from 'lib/entity/cell/selected'
import { ToolData } from '.'
import DraggableTool from './draggable'

export default class EraseTool extends DraggableTool {
  constructor(data: ToolData) {
    super('erase', data)
  }

  public onDrag(e: MouseEvent) {
    super.onDrag(e)

    const result = []
    this.loopRange((i, j) => {
      const cell = this.gridData.cells[i][j]
      result.push(cell)
      if (cell.target instanceof SelectedCell) {
        const { x, y } = cell.target.position
        cell.target = new ErasedCell(x, y)
        this.gridData.selectTemporaryCell(i, j)
      }
    })

    for (const element of this.gridData.temporarySelectedCells) {
      if (!result.includes(element)) {
        const assigendCells = this.gridData.assignedCells
        if (assigendCells.length > 0) {
          if (assigendCells.includes(element)) {
            const { x, y } = element.target.position
            element.target = new SelectedCell(x, y)
            this.gridData.deleteTemporaryCell(element)
          }
        }
      }
    }

    this.update()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    this.gridData.temporarySelectedCells.forEach((element) => {
      const { x, y } = element.target.position
      element.target = new DefaultCell(x, y)
      this.gridData.deleteAssignedCell(element)
    })

    this.gridData.initializeTemporaryCell()
    this.update()
  }

  public onDragCancle(): void {
    super.onDragCancle()

    this.gridData.temporarySelectedCells.forEach((element) => {
      const { x, y } = element.target.position
      element.target = new SelectedCell(x, y)
    })

    this.gridData.initializeTemporaryCell()
    this.update()
  }
}
