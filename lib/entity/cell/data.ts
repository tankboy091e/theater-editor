import Cell from '.'

export default class CellData {
  private static MAXIMUM_MEMORY = 10

  private _memento: Cell[]
  private _previous: Cell
  public current: Cell

  constructor(cell: Cell) {
    this.current = cell
    this._memento = []
  }

  public get previous() {
    return this._previous
  }

  public saveMemento() {
    if (this._memento.length > CellData.MAXIMUM_MEMORY - 1) {
      this._memento.shift()
    }
    if (!this._previous) {
      this._memento.push(this.current)
      return
    }
    this._memento.push(this._previous)
    this._previous = null
  }

  public loadMemento() {
    if (this._memento.length === 0) {
      return
    }
    this.current = this._memento.pop()
  }

  public saveTemporary() {
    this._previous = this.current
  }

  public loadTemporary() {
    this.current = this._previous
    this._previous = null
  }
}
