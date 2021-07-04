import { RiEraserLine } from 'react-icons/ri'
import Tool, { EditorData } from '.'

export default class EraseTool extends Tool {
  constructor(data: EditorData) {
    super('erase', data)
    this.icon = <RiEraserLine size={24} />
  }
}
