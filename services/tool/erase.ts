import AssignedCell from 'lib/entity/cell/assigned'
import DefaultCell from 'lib/entity/cell/default'
import ErasedCell from 'lib/entity/cell/erased'
import { ToolData } from '.'
import DraggableTool from './draggable'

export default class EraseTool extends DraggableTool {
  constructor(data: ToolData) {
    super('erase', data)
    this.metadata.name = '지우개'
    this.metadata.description = '할당된 좌석을 지웁니다.'
  }

  public onDrag(e: MouseEvent) {
    super.onDrag(e)

    const result = []
    this.loopRange((i, j) => {
      const cell = this.gridData.cells[i][j]
      result.push(cell)
      if (cell.target instanceof AssignedCell) {
        const { x, y } = cell.target.position
        cell.previous = cell.target
        cell.target = new ErasedCell(x, y)
        this.gridData.selectTemporaryCell(i, j)
      }
    })

    this.gridData.temporarySelectedCells.forEach((element) => {
      if (!result.includes(element)) {
        element.target = element.previous
        this.gridData.deleteTemporaryCell(element)
      }
    })

    this.gridData.update()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    this.gridData.temporarySelectedCells.forEach((element) => {
      const { x, y } = element.target.position
      element.target = new DefaultCell(x, y)
      this.gridData.deleteAssignedCell(element)
    })

    this.gridData.initializeTemporaryCell()

    this.gridData.update()
  }

  public onDragCancle(): void {
    super.onDragCancle()

    this.gridData.temporarySelectedCells.forEach((element) => {
      element.target = element.previous
    })

    this.gridData.initializeTemporaryCell()

    this.gridData.update()
  }
}
