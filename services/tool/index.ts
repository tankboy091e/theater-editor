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
}

export default abstract class Tool {
  public readonly name: ToolType
  public readonly metadata: Metadata
  protected readonly _options : Options

  protected gridData: Grid
  protected uiData: Ui

  constructor(name: ToolType, data: ToolData) {
    this.name = name
    this.gridData = data.gridData
    this.uiData = data.uiData
    this.metadata = {
      name: '',
      description: '',
    }
    this._options = {}
  }

  public get options() {
    return Object.entries(this._options).map(([key, value]) => (
      {
        key,
        value,
      }
    ))
  }

  public setOption(key: string, value: any) {
    this._options[key] = value
  }
}
