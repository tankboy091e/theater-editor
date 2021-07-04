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

    const result = []
    this.loopRange((i, j) => {
      const cell = this.gridData.cells[i][j]
      result.push(cell)

      if (cell.target instanceof DefaultCell) {
        this.gridData.selectTemporaryCell(i, j)
        const { x, y } = cell.target.position
        cell.target = new SelectedCell(x, y)
      }
    })

    this.gridData.temporarySelectedCells.forEach((element) => {
      if (!result.includes(element)) {
        const { x, y } = element.target.position
        element.target = new DefaultCell(x, y)
        this.gridData.deleteTemporaryCell(element)
      }
    })

    this.update()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    this.gridData.assignTemporaryCell()
    this.gridData.initializeTemporaryCell()
  }

  public onDragCancle(): void {
    super.onDragCancle()

    this.gridData.temporarySelectedCells.forEach((element) => {
      if (this.gridData.assignedCells.includes(element)) {
        return
      }
      const { x, y } = element.target.position
      element.target = new DefaultCell(x, y)
    })

    this.gridData.initializeTemporaryCell()

    this.update()
  }
}
