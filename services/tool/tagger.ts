import AssignedCell from 'lib/entity/cell/assigned'
import TagSelectedCell from 'lib/entity/cell/selected/tag'
import { ToolData } from 'lib/entity/tool'
import BooleanOption from 'lib/entity/tool/options/boolean'
import ColorOption from 'lib/entity/tool/options/color'
import DraggableTool from './draggable'

export default class TaggerTool extends DraggableTool {
  private static SHOULD_PAINT = '색칠하기'
  private static PAINT_COLOR = '색 선택'

  constructor(data: ToolData) {
    super('tagger', data)
    this.metadata.name = '태그'
    this.metadata.description = '좌석에 태그를 붙입니다.'
    this.stokeStyle = 'rgba(245, 234, 60, .7)'
    this.fillStyle = 'rgba(245, 234, 60, .3)'

    this._options[TaggerTool.SHOULD_PAINT] = new BooleanOption(false)
    this._options[TaggerTool.PAINT_COLOR] = new ColorOption('#FFFFFF')
  }

  public onDrag(e: MouseEvent): void {
    super.onDrag(e)

    const result = []
    this.loopRange((i, j) => {
      const cell = this.gridData.cells[i][j]
      result.push(cell)
      if (cell.current instanceof AssignedCell) {
        cell.saveTemporary()
        cell.current = new TagSelectedCell(cell.current)
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

  public async onDragEnd(): Promise<void> {
    super.onDragEnd()

    if (this.gridData.temporarySelectedCells.length === 0) {
      return
    }

    const tag = await this.uiData.createPrompt({ text: '태그를 입력하세요' })

    if (!tag) {
      this.onDragCancle()
      return
    }

    const customColor = this._options[TaggerTool.SHOULD_PAINT].value === true
      ? this._options[TaggerTool.PAINT_COLOR].value
      : null

    this.gridData.temporarySelectedCells
      .forEach((element) => {
        if (!(element.previous instanceof AssignedCell)) {
          return
        }
        const {
          tags, props, index, color,
        } = element.previous
        element.current = new AssignedCell({
          ...props, index, tags: [...tags, tag], color: customColor || color,
        })
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
