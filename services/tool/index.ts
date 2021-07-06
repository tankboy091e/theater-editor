import Grid from 'lib/entity/grid'
import { Metadata, ToolData, ToolType } from 'lib/entity/tool'
import { Options } from 'lib/entity/tool/options'
import Ui from 'lib/entity/ui'

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
    return Object.entries(this._options).map(([key, option]) => ({
      key,
      option,
    }))
  }

  public setOption(key: string, value: any) : void {
    this._options[key] = value
  }
}
