import Grid from 'lib/entity/grid'
import Ui from 'lib/entity/ui'

export type ToolType = 'select' | 'assign' | 'erase' | 'indexer'

export interface ToolData {
  gridData: Grid
  uiData: Ui
}

export default abstract class Tool {
  public readonly name: ToolType
  protected gridData: Grid
  protected uiData: Ui

  constructor(name: ToolType, data: ToolData) {
    this.name = name
    this.gridData = data.gridData
    this.uiData = data.uiData
    this.gridData.update()
  }
}
