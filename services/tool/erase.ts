import AssignedCell from 'lib/entity/cell/assigned'
import DefaultCell from 'lib/entity/cell/default'
import ErasedCell from 'lib/entity/cell/erased'
import { ToolData } from 'lib/entity/tool'
import DraggableTool from './draggable'

export default class EraseTool extends DraggableTool {
  constructor(data: ToolData) {
    super('erase', data)
    this.metadata.name = '지우개'
    this.metadata.description = '할당된 좌석을 지웁니다.'
    this.stokeStyle = 'rgba(196, 37, 64, .7)'
    this.fillStyle = 'rgba(196, 37, 64, .3)'
  }

  public onDrag(e: MouseEvent) : void {
    super.onDrag(e)

    const result = []
    this.loopRange((i, j) => {
      const cell = this.gridData.cells[i][j]
      result.push(cell)
      if (cell.current instanceof AssignedCell) {
        const { props } = cell.current
        cell.saveTemporary()
        cell.current = new ErasedCell(props)
        this.gridData.selectTemporaryCell(i, j)
      }
    })

    this.gridData.temporarySelectedCells.forEach((element) => {
      if (!result.includes(element)) {
        element.loadTemporary()
        this.gridData.deleteTemporaryCell(element)
      }
    })

    this.gridData.update()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    if (this.gridData.temporarySelectedCells.length === 0) {
      return
    }

    this.gridData.temporarySelectedCells.forEach((element) => {
      const { props } = element.current
      element.current = new DefaultCell(props)
    })

    this.gridData.initializeTemporaryCells()
    this.gridData.update()
    this.gridData.save()
  }

  public onDragCancle(): void {
    super.onDragCancle()

    this.gridData.temporarySelectedCells.forEach((element) => {
      element.loadTemporary()
    })

    this.gridData.initializeTemporaryCells()

    this.gridData.update()
  }
}
