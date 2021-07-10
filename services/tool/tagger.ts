import AssignedCell from 'lib/entity/cell/assigned'
import TagSelectedCell from 'lib/entity/cell/selected/tag'
import { ToolData } from 'lib/entity/tool'
import TextOption from 'lib/entity/tool/options/text'
import DraggableTool from './draggable'

export default class TaggerTool extends DraggableTool {
  protected static readonly TAG_NAME = '태그 이름'

  constructor(data: ToolData) {
    super('tagger', data)
    this.metadata.name = '태그'
    this.metadata.description = '좌석에 태그를 붙입니다.'
    this.stokeStyle = 'rgba(245, 234, 60, .7)'
    this.fillStyle = 'rgba(245, 234, 60, .3)'

    this._options[TaggerTool.TAG_NAME] = new TextOption('')
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

    // const tag = this._options[TaggerTool.TAG_NAME].value

    const tag = await this.uiData.createPrompt({ text: 'd?' })
    console.log(tag)
    this.gridData.temporarySelectedCells
      .forEach((element) => {
        if (!(element.previous instanceof AssignedCell)) {
          return
        }
        const { tags, props, index } = element.previous
        element.current = new AssignedCell({
          ...props, index, tags: [...tags, tag],
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
