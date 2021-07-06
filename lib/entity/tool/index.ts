import Grid from '../grid'
import Ui from '../ui'

export type ToolType = 'select' | 'assign' | 'erase' | 'indexer'

export interface ToolData {
  gridData: Grid
  uiData: Ui
}

export interface Metadata {
  name: string
  description: string
}
