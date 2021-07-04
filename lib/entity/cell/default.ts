import Cell from '.'

export default class DefaultCell extends Cell {
  constructor(x: number, y: number) {
    super(x, y, 'rgba(0, 0, 0, 0.2)')
  }
}
