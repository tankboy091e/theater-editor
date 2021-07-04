import { RiCursorLine } from 'react-icons/ri'
import Tool, { EditorData } from '.'

export default class SelectTool extends Tool {
  constructor(data: EditorData) {
    super('select', data)
    this.icon = <RiCursorLine size={24} />
  }
}
