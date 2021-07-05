import Cell from '.'

export default class DefaultCell extends Cell {
  private static readonly color = 'rgba(0, 0, 0, 0.15)'

  protected get strokeStyle() {
    return DefaultCell.color
  }
}
