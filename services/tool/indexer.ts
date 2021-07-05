import AssignedCell from 'lib/entity/cell/assigned'
import IndexAssigendCell from 'lib/entity/cell/assigned/indexer'
import IndexSelectedCell from 'lib/entity/cell/selected/indexer'
import { ToolData } from '.'
import DraggableTool from './draggable'

export default class IndexerTool extends DraggableTool {
  constructor(data: ToolData) {
    super('indexer', data)
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
        cell.target = new IndexSelectedCell(x, y)
        this.gridData.selectTemporaryCell(i, j)
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

    this.gridData.temporarySelectedCells
      .sort((a, b) => {
        const { x: aX, y: aY } = a.target.position
        const { x: bX, y: bY } = b.target.position
        if (aY > bY) return 1
        if (aY < bY) return -1
        if (aX > bX) return 1
        if (aX < bX) return -1
        return 0
      })
      .forEach((element, index) => {
        const { x, y } = element.target.position
        element.target = new IndexAssigendCell(x, y, index + 1)
      })

    this.gridData.initializeTemporaryCell()

    this.updateGrid()
  }

  public onDragCancle(): void {
    super.onDragCancle()

    this.gridData.temporarySelectedCells.forEach((element) => {
      element.target = element.previous
    })

    this.gridData.initializeTemporaryCell()
    this.updateGrid()
  }
}
