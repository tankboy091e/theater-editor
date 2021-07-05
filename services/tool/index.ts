import { MutableRefObject } from 'react'
import Grid from 'lib/entity/grid'
import Ui from 'lib/entity/ui'

export type ToolType = 'select' | 'assign' | 'erase' | 'indexer'

export interface ToolData {
  gridData: Grid
  uiData: Ui
  containerRef: MutableRefObject<HTMLElement>
}

export default abstract class Tool {
  public name: ToolType
  protected gridData: Grid
  protected uiData: Ui
  protected containerRef: MutableRefObject<HTMLElement>

  constructor(name: ToolType, data: ToolData) {
    this.name = name
    this.gridData = data.gridData
    this.uiData = data.uiData
    this.containerRef = data.containerRef
    this.updateGrid()
  }

  protected updateGrid() {
    this.clearGrid()
    this.gridData.cells.forEach((array) => array.forEach((element) => {
      element.target.draw(this.gridData.context, this.gridData.size)
    }))
  }

  protected clearGrid() {
    const { context, width, height } = this.gridData
    context.clearRect(0, 0, width, height)
  }

  protected clearUI() {
    const { context, width, height } = this.uiData
    context.clearRect(0, 0, width, height)
  }
}
