import SelectedCell from '.'

export default class IndexSelectedCell extends SelectedCell {
  private static readonly indexColor = 'rgba(0, 50, 255, .7)'

  protected get strokeStyle() {
    return IndexSelectedCell.indexColor
  }
}
