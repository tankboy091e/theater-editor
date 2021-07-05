import Cell from '..'

export default class AssignedCell extends Cell {
  private static readonly color = 'rgba(0, 0, 0, 1)'

  protected get strokeStyle() {
    return AssignedCell.color
  }
}
