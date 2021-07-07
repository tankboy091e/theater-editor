import SelectedCell from '.'
import AssignedCell from '../assigned'

export default class TagSelectedCell extends SelectedCell {
  private static readonly indexColor = 'rgba(254, 210, 20, 1)'

  public index: number
  public tags: string[]

  constructor(cell: AssignedCell) {
    super(cell.position)
    this.index = cell.index
    this.tags = cell.tags
  }

  protected get strokeStyle() {
    return TagSelectedCell.indexColor
  }
}
