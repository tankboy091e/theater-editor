/* eslint-disable no-underscore-dangle */
import { MutableRefObject } from 'react'
import Canvas from './canvas'
import CellData from './cell/data'
import DefaultCell from './cell/default'

interface CellList {
  [key: string]: CellData
}

interface Props {
  size: number
  column: number
  row: number
  gap: number
}

export default class Grid extends Canvas {
  public readonly cells: CellData[][]
  public readonly column: number
  public readonly row: number
  public readonly size: number
  public readonly gap: number
  private _temporarySelectedCells: CellList

  constructor(
    ref: MutableRefObject<HTMLCanvasElement>,
    containerRef: MutableRefObject<HTMLElement>,
    {
      size, column, row, gap,
    }: Props,
  ) {
    super(ref, containerRef)
    this.size = size
    this.column = column
    this.row = row
    this.gap = gap
    this.ref.current.width = this.column * (this.size + this.gap) + this.gap
    this.ref.current.height = this.row * (this.size + this.gap) + this.gap
    this.cells = []
    this._temporarySelectedCells = {}
    this.initializeCells()
    this.update()
  }

  private initializeCells() : void {
    for (let y = this.gap; y < this.height; y += this.size + this.gap) {
      const row = []
      for (let x = this.gap; x < this.width; x += this.size + this.gap) {
        row.push(new CellData(new DefaultCell(x, y)))
      }
      this.cells.push(row)
    }
  }

  public get temporarySelectedCells(): CellData[] {
    return Object.values(this._temporarySelectedCells)
  }

  public selectTemporaryCell(x: number, y: number) : void {
    this._temporarySelectedCells[`${x}-${y}`] = this.cells[x][y]
  }

  public deleteTemporaryCell(cellData: CellData) : void {
    const [key] = Object.entries(this._temporarySelectedCells).find(
      ([_, element]) => element === cellData,
    )
    delete this._temporarySelectedCells[key]
  }

  public initializeTemporaryCells() : void {
    this._temporarySelectedCells = {}
  }

  public update() : void {
    super.update()
    this.cells.forEach((array) => array.forEach((element) => {
      element.current.draw(this.context, this.size)
    }))
  }

  public save() : void {
    this.cells.forEach((cells) => cells.forEach((cell) => cell.saveMemento()))
  }

  public undo() : void {
    this.cells.forEach((cells) => cells.forEach((cell) => cell.loadMemento()))

    this.update()
  }
}
