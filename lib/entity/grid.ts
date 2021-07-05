/* eslint-disable no-underscore-dangle */
import { MutableRefObject } from 'react'
import Canvas from './canvas'
import Cell from './cell'
import DefaultCell from './cell/default'

interface CellData {
  previous: Cell
  target: Cell
}

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
  private _assignedCells: CellList

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
    this._assignedCells = {}
    this.initializeCells()
    this.update()
  }

  private initializeCells() {
    for (let y = this.gap; y < this.height; y += this.size + this.gap) {
      const row = []
      for (let x = this.gap; x < this.width; x += this.size + this.gap) {
        row.push({
          target: new DefaultCell(x, y),
        })
      }
      this.cells.push(row)
    }
  }

  public get temporarySelectedCells(): CellData[] {
    return Object.values(this._temporarySelectedCells)
  }

  public get assignedCells(): CellData[] {
    return Object.values(this._assignedCells)
  }

  public selectTemporaryCell(x: number, y: number) {
    this._temporarySelectedCells[`${x}-${y}`] = this.cells[x][y]
  }

  public assignTemporaryCell() {
    this._assignedCells = {
      ...this._assignedCells,
      ...this._temporarySelectedCells,
    }
  }

  public deleteTemporaryCell(cellData: CellData) {
    const [key] = Object.entries(this._temporarySelectedCells).find(
      ([_, element]) => element === cellData,
    )
    delete this._temporarySelectedCells[key]
  }

  public initializeTemporaryCell() {
    this._temporarySelectedCells = {}
  }

  public deleteAssignedCell(cellData: CellData) {
    const [key] = Object.entries(this._assignedCells).find(
      ([_, element]) => element === cellData,
    )
    delete this._assignedCells[key]
  }

  public update() {
    super.update()
    this.cells.forEach((array) => array.forEach((element) => {
      element.target.draw(this.context, this.size)
    }))
  }
}
