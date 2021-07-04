import { MutableRefObject, ReactNode } from 'react'
import { GridData, UiData } from 'templates/editor'

export type ToolType = 'select' | 'assign' | 'erase' | 'indexer'

export interface EditorData {
  gridData: GridData
  uiData: UiData
  containerRef: MutableRefObject<HTMLElement>
}

export default abstract class Tool {
  public name: ToolType
  public icon: ReactNode
  protected gridData: GridData
  protected uiData: UiData
  protected containerRef: MutableRefObject<HTMLElement>

  constructor(name: ToolType, data: EditorData) {
    this.name = name
    this.gridData = data.gridData
    this.uiData = data.uiData
    this.containerRef = data.containerRef
    this.update()
  }

  protected update() {
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
