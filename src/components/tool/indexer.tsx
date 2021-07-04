import { ImSortNumericAsc } from 'react-icons/im'
import Tool, { EditorData } from '.'

export default class IndexerTool extends Tool {
  constructor(data: EditorData) {
    super('indexer', data)
    this.icon = <ImSortNumericAsc size={20} />
  }
}
