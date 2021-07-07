import { ToolData } from 'lib/entity/tool'
import Tool from '.'

export default class SelectTool extends Tool {
  constructor(data: ToolData) {
    super('select', data)
    this.metadata.name = '선택'
  }
}
