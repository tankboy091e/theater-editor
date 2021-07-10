import { OnKeyboard } from 'providers/keyboard'
import Grid from '../grid'
import Ui from '../ui'

export type ToolType = 'select' | 'assign' | 'erase' | 'indexer' | 'tagger' | 'row-tagger' | 'section-tagger'

export interface ToolData {
  gridData: Grid
  uiData: Ui
  keyboard: {
    on: OnKeyboard
  }
}

export interface Metadata {
  name: string
  description: string
}
