import Grid from 'lib/entity/grid'
import Ui from 'lib/entity/ui'

export type ToolType = 'select' | 'assign' | 'erase' | 'indexer'

export interface ToolData {
  gridData: Grid
  uiData: Ui
}

interface Options {
  [property: string] : any
}

interface Metadata {
  name: string
  description: string
  options : Options
}

export default abstract class Tool {
  public readonly name: ToolType
  public readonly metadata: Metadata

  protected gridData: Grid
  protected uiData: Ui

  constructor(name: ToolType, data: ToolData) {
    this.name = name
    this.gridData = data.gridData
    this.uiData = data.uiData
    this.metadata = {
      name: '',
      description: '',
      options: {},
    }
  }
}
