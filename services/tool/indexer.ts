import Tool, { ToolData } from '.'

export default class IndexerTool extends Tool {
  constructor(data: ToolData) {
    super('indexer', data)
  }
}
