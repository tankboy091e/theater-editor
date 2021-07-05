import Cell from '..'

export default class SelectedCell extends Cell {
  private static readonly color = 'rgba(0, 0, 0, .6)'

  protected get strokeStyle() {
    return SelectedCell.color
  }
}
