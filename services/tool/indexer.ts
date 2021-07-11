import AssignedCell from 'lib/entity/cell/assigned'
import IndexSelectedCell from 'lib/entity/cell/selected/indexer'
import BooleanOption from 'lib/entity/tool/options/boolean'
import NumberOption from 'lib/entity/tool/options/number'
import { ToolData } from 'lib/entity/tool'
import SelectOption from 'lib/entity/tool/options/select'
import CellData from 'lib/entity/cell/data'
import { Direction } from 'lib/entity/cell'
import DraggableTool from './draggable'

export default class IndexerTool extends DraggableTool {
  protected static readonly START_NUMBER = '시작 번호'
  protected static readonly INDEX_DIRECTION = '색인 방향'
  protected static readonly HORIZONTAL_DIRECTION = '수평 색인'
  protected static readonly VERTICAL_DIRECTION = '수직 색인'
  protected static readonly LINE_BREAKING_INITIALIZE = '줄바꿈 시 처음부터 시작'
  protected static readonly PASSAGE_INITIALIZE = '자리를 건너뛰면 처음부터 시작'
  protected static readonly AUTO_INDEXED_COLUMN = '자동으로 열 태그 입력'

  private static readonly INDEX_HORIZONTAL = '가로'
  private static readonly INDEX_VERTICAL = '세로'
  private static readonly HONRIZONTAL_LEFT_TO_RIGHT = '왼쪽에서 오른쪽으로'
  private static readonly HONRIZONTAL_RIGHT_TO_LEFT = '오른쪽에서 왼쪽으로'
  private static readonly VERTICAL_UP_TO_DOWN = '위쪽에서 아래쪽으로'
  private static readonly VERTICAL_DOWN_TO_UP = '아래쪽에서 위쪽으로'

  constructor(data: ToolData) {
    super('indexer', data)
    this.metadata.name = '색인'
    this.metadata.description = '좌석에 번호를 매깁니다.'
    this.initializeOptions()
  }

  public onDrag(e: MouseEvent): void {
    super.onDrag(e)

    const result = []
    this.loopRange((i, j) => {
      const cell = this.gridData.cells[i][j]
      result.push(cell)
      if (cell.current instanceof AssignedCell) {
        const { props } = cell.current
        cell.saveTemporary()
        cell.current = new IndexSelectedCell(props)
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

    const start = this._options[IndexerTool.START_NUMBER].value

    let index = start
    let column = 0

    const previous = {
      x: undefined,
      y: undefined,
    }

    this.gridData.temporarySelectedCells
      .sort(this.arrange)
      .forEach((element) => {
        if (!(element.previous instanceof AssignedCell)) {
          return
        }
        const { tags, position, color } = element.previous
        const { x, y } = position

        const newOne : {
          x: number
          y: number
          index?: number
          color: string
          direction?: Direction
          tags?: string[]
        } = {
          x, y, tags, color: color === 'rgba(0, 0, 0, 1)' ? 'rgba(0, 80, 255, 1)' : color,
        }

        newOne.direction = this.getDirection()

        if (this._options[IndexerTool.AUTO_INDEXED_COLUMN].value) {
          if (newOne.direction === 'horizontal') {
            if (previous.y !== y) {
              column += 1
            }
          }
          if (newOne.direction === 'vertical') {
            if (previous.x !== x) {
              column += 1
            }
          }
          newOne.tags.push(`${column}열`)
        } else {
          newOne.tags = newOne.tags.filter((tag) => !tag.includes('열'))
        }

        if (this._options[IndexerTool.LINE_BREAKING_INITIALIZE].value) {
          if (newOne.direction === 'horizontal') {
            if (previous.y !== y) {
              index = start
            }
          }
          if (newOne.direction === 'vertical') {
            if (previous.x !== x) {
              index = start
            }
          }
        }

        if (this._options[IndexerTool.PASSAGE_INITIALIZE].value) {
          if (newOne.direction === 'horizontal') {
            if (this._options[IndexerTool.HORIZONTAL_DIRECTION].value
                === IndexerTool.HONRIZONTAL_LEFT_TO_RIGHT) {
              if (previous.x !== x - (this.gridData.size + this.gridData.gap)) {
                index = start
              }
            }
            if (this._options[IndexerTool.HORIZONTAL_DIRECTION].value
              === IndexerTool.HONRIZONTAL_RIGHT_TO_LEFT) {
              if (previous.x !== x + (this.gridData.size + this.gridData.gap)) {
                index = start
              }
            }
          }
          if (newOne.direction === 'vertical') {
            if (this._options[IndexerTool.VERTICAL_DIRECTION].value
              === IndexerTool.VERTICAL_UP_TO_DOWN) {
              if (previous.y !== y - (this.gridData.size + this.gridData.gap)) {
                index = start
              }
            }
            if (this._options[IndexerTool.VERTICAL_DIRECTION].value
              === IndexerTool.VERTICAL_DOWN_TO_UP) {
              if (previous.y !== y + (this.gridData.size + this.gridData.gap)) {
                index = start
              }
            }
          }
        }

        newOne.index = index

        element.current = new AssignedCell(newOne)

        previous.x = x
        previous.y = y

        index += 1
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

  private arrange(a : CellData, b : CellData): number {
    const { x: aX, y: aY } = a.current.position
    const { x: bX, y: bY } = b.current.position
    if (
      this._options[IndexerTool.INDEX_DIRECTION].value
      === IndexerTool.INDEX_HORIZONTAL
    ) {
      const result = this.arrangeVertical(aY, bY)
      if (result !== 0) {
        return result
      }
      return this.arrangeHorizontal(aX, bX)
    }
    if (
      this._options[IndexerTool.INDEX_DIRECTION].value
      === IndexerTool.INDEX_VERTICAL
    ) {
      const result = this.arrangeHorizontal(aX, bX)
      if (result !== 0) {
        return result
      }
      return this.arrangeVertical(aY, bY)
    }
    return 0
  }

  private arrangeHorizontal(a: any, b: any): number {
    return this.arrangeBy(
      a,
      b,
      IndexerTool.HORIZONTAL_DIRECTION,
      IndexerTool.HONRIZONTAL_LEFT_TO_RIGHT,
      IndexerTool.HONRIZONTAL_RIGHT_TO_LEFT,
    )
  }

  private arrangeVertical(a: any, b: any): number {
    return this.arrangeBy(
      a,
      b,
      IndexerTool.VERTICAL_DIRECTION,
      IndexerTool.VERTICAL_UP_TO_DOWN,
      IndexerTool.VERTICAL_DOWN_TO_UP,
    )
  }

  private arrangeBy(a : any, b : any, option: string, option1: string, option2: string) {
    if (
      this._options[option].value
      === option1
    ) {
      if (a > b) return 1
      if (a < b) return -1
    }
    if (
      this._options[option].value
      === option2
    ) {
      if (a > b) return -1
      if (a < b) return 1
    }
    return 0
  }

  private getDirection() : Direction {
    if (this._options[IndexerTool.INDEX_DIRECTION].value === IndexerTool.INDEX_HORIZONTAL) {
      return 'horizontal'
    }
    if (this._options[IndexerTool.INDEX_DIRECTION].value === IndexerTool.INDEX_VERTICAL) {
      return 'vertical'
    }
    return null
  }

  private initializeOptions() {
    this._options[IndexerTool.START_NUMBER] = new NumberOption(1)
    this._options[IndexerTool.INDEX_DIRECTION] = new SelectOption([
      IndexerTool.INDEX_HORIZONTAL,
      IndexerTool.INDEX_VERTICAL,
    ])
    this._options[IndexerTool.HORIZONTAL_DIRECTION] = new SelectOption([
      IndexerTool.HONRIZONTAL_LEFT_TO_RIGHT,
      IndexerTool.HONRIZONTAL_RIGHT_TO_LEFT,
    ])
    this._options[IndexerTool.VERTICAL_DIRECTION] = new SelectOption([
      IndexerTool.VERTICAL_UP_TO_DOWN,
      IndexerTool.VERTICAL_DOWN_TO_UP,
    ])
    this._options[IndexerTool.AUTO_INDEXED_COLUMN] = new BooleanOption(false)
    this._options[IndexerTool.LINE_BREAKING_INITIALIZE] = new BooleanOption(false)
    this._options[IndexerTool.PASSAGE_INITIALIZE] = new BooleanOption(false)
  }

  protected bindEventListeners() {
    super.bindEventListeners()
    this.arrange = this.arrange.bind(this)
  }
}
