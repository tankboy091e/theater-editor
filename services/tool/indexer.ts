import AssignedCell from 'lib/entity/cell/assigned'
import IndexAssigendCell from 'lib/entity/cell/assigned/indexer'
import IndexSelectedCell from 'lib/entity/cell/selected/indexer'
import BooleanOption from 'lib/entity/tool/options/boolean'
import NumberOption from 'lib/entity/tool/options/number'
import { ToolData } from 'lib/entity/tool'
import DraggableTool from './draggable'

export default class IndexerTool extends DraggableTool {
  protected static startNumberInitialize = '시작 번호'
  protected static linebreakingInitialize = '줄바꿈시 처음부터 시작'
  protected static passageInitialize = '통로를 지나면 처음부터 시작'

  constructor(data: ToolData) {
    super('indexer', data)
    this.metadata.name = '색인'
    this.metadata.description = '좌석에 번호를 매깁니다.'
    this._options[IndexerTool.startNumberInitialize] = new NumberOption(1)
    this._options[IndexerTool.linebreakingInitialize] = new BooleanOption(false)
    this._options[IndexerTool.passageInitialize] = new BooleanOption(false)
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

    this.gridData.update()
  }

  public onDragEnd(): void {
    super.onDragEnd()

    const start = this._options[IndexerTool.startNumberInitialize].value

    let index = start

    const previous = {
      x: undefined,
      y: undefined,
    }

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
      .forEach((element) => {
        const { x, y } = element.target.position

        if (this._options[IndexerTool.linebreakingInitialize].value) {
          if (previous.y !== y) {
            index = start
          }
        }

        if (this._options[IndexerTool.passageInitialize].value) {
          if (previous.y === y && previous.x !== x - (this.gridData.size + this.gridData.gap)) {
            index = start
          }
        }

        element.target = new IndexAssigendCell(x, y, index)

        previous.x = x
        previous.y = y

        index += 1
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
