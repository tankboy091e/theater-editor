import AssignedCell from 'lib/entity/cell/assigned'
import IndexAssigendCell from 'lib/entity/cell/assigned/indexer'
import IndexSelectedCell from 'lib/entity/cell/selected/indexer'
import BooleanOption from 'lib/entity/tool/options/boolean'
import NumberOption from 'lib/entity/tool/options/number'
import { ToolData } from 'lib/entity/tool'
import SelectOption from 'lib/entity/tool/options/select'
import DraggableTool from './draggable'

export default class IndexerTool extends DraggableTool {
  protected static HORIZONTAL_DIRECTION = '수평 색인'
  protected static VERTICAL_DIRECTION = '수직 색인'
  protected static START_NUMBER = '시작 번호'
  protected static LINE_BREAKING_INITIALIZE = '줄바꿈 시 처음부터 시작'
  protected static PASSAGE_INITIALIZE = '통로를 지나면 처음부터 시작'

  private static HONRIZONTAL_LEFT_TO_RIGHT = '왼쪽에서 오른쪽으로'
  private static HONRIZONTAL_RIGHT_TO_LEFT = '오른쪽에서 왼쪽으로'
  private static VERTICAL_UP_TO_DOWN = '위쪽에서 아래쪽으로'
  private static VERTICAL_DOWN_TO_UP = '아래쪽에서 위쪽으로'

  constructor(data: ToolData) {
    super('indexer', data)
    this.metadata.name = '색인'
    this.metadata.description = '좌석에 번호를 매깁니다.'
    this._options[IndexerTool.HORIZONTAL_DIRECTION] = new SelectOption([
      IndexerTool.HONRIZONTAL_LEFT_TO_RIGHT,
      IndexerTool.HONRIZONTAL_RIGHT_TO_LEFT,
    ])
    this._options[IndexerTool.VERTICAL_DIRECTION] = new SelectOption([
      IndexerTool.VERTICAL_UP_TO_DOWN,
      IndexerTool.VERTICAL_DOWN_TO_UP,
    ])
    this._options[IndexerTool.START_NUMBER] = new NumberOption(1)
    this._options[IndexerTool.LINE_BREAKING_INITIALIZE] = new BooleanOption(
      false,
    )
    this._options[IndexerTool.PASSAGE_INITIALIZE] = new BooleanOption(false)
  }

  public onDrag(e: MouseEvent) : void {
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

    const start = this._options[IndexerTool.START_NUMBER].value

    let index = start

    const previous = {
      x: undefined,
      y: undefined,
    }

    this.gridData.temporarySelectedCells
      .sort((a, b) => {
        const { x: aX, y: aY } = a.target.position
        const { x: bX, y: bY } = b.target.position
        const result = this.verticalIndexer(aY, bY)
        if (result !== 0) {
          return result
        }
        return this.horizontalIndexer(aX, bX)
      })
      .forEach((element) => {
        const { x, y } = element.target.position

        if (this._options[IndexerTool.LINE_BREAKING_INITIALIZE].value) {
          if (previous.y !== y) {
            index = start
          }
        }

        if (this._options[IndexerTool.PASSAGE_INITIALIZE].value) {
          if (previous.x !== x - (this.gridData.size + this.gridData.gap)) {
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

  private horizontalIndexer(a: any, b: any) : number {
    if (
      this._options[IndexerTool.HORIZONTAL_DIRECTION].value
      === IndexerTool.HONRIZONTAL_LEFT_TO_RIGHT
    ) {
      if (a > b) return 1
      if (a < b) return -1
    }
    if (
      this._options[IndexerTool.HORIZONTAL_DIRECTION].value
      === IndexerTool.HONRIZONTAL_RIGHT_TO_LEFT
    ) {
      if (a > b) return -1
      if (a < b) return 1
    }
    return 0
  }

  private verticalIndexer(a: any, b: any) : number {
    if (
      this._options[IndexerTool.VERTICAL_DIRECTION].value
      === IndexerTool.VERTICAL_UP_TO_DOWN
    ) {
      if (a > b) return 1
      if (a < b) return -1
    }
    if (
      this._options[IndexerTool.VERTICAL_DIRECTION].value
      === IndexerTool.VERTICAL_DOWN_TO_UP
    ) {
      if (a > b) return -1
      if (a < b) return 1
    }
    return 0
  }
}
