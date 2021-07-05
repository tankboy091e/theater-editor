import Tool, { ToolData } from '.'

export default class SelectTool extends Tool {
  constructor(data: ToolData) {
    super('select', data)
    this.metadata.name = '선택'
  }
}
