/* eslint-disable no-underscore-dangle */
import { MutableRefObject } from 'react'
import Canvas from './canvas'
import AssignedCell from './cell/assigned'
import CellData from './cell/data'
import DefaultCell from './cell/default'

interface CellList {
  [key: string]: CellData
}

interface Props {
  size: number
  columns: number
  rows: number
  gap: number
}

export default class Grid extends Canvas {
  public readonly cells: CellData[][]
  public readonly columns: number
  public readonly rows: number
  public readonly size: number
  public readonly gap: number
  private _temporarySelectedCells: CellList

  constructor(
    ref: MutableRefObject<HTMLCanvasElement>,
    containerRef: MutableRefObject<HTMLElement>,
    {
      size, columns: column, rows: row, gap,
    }: Props,
  ) {
    super(ref, containerRef)
    this.size = size
    this.columns = column
    this.rows = row
    this.gap = gap
    this.ref.current.width = this.columns * (this.size + this.gap) + this.gap
    this.ref.current.height = this.rows * (this.size + this.gap) + this.gap
    this.cells = []
    this._temporarySelectedCells = {}
    this.initializeCells()
    this.update()
  }

  private initializeCells(): void {
    for (let y = this.gap; y < this.height; y += this.size + this.gap) {
      const row = []
      for (let x = this.gap; x < this.width; x += this.size + this.gap) {
        row.push(new CellData(new DefaultCell({ x, y })))
      }
      this.cells.push(row)
    }
  }

  public get temporarySelectedCells(): CellData[] {
    return Object.values(this._temporarySelectedCells)
  }

  public selectTemporaryCell(x: number, y: number): void {
    this._temporarySelectedCells[`${x}-${y}`] = this.cells[x][y]
  }

  public deleteTemporaryCell(cellData: CellData): void {
    const [key] = Object.entries(this._temporarySelectedCells).find(
      ([_, element]) => element === cellData,
    )
    delete this._temporarySelectedCells[key]
  }

  public initializeTemporaryCells(): void {
    this._temporarySelectedCells = {}
  }

  public update(): void {
    super.update()

    const sections = {}

    this.cells.forEach((rows, columnIndex, columns) => rows.forEach((element, rowIndex, rows) => {
      element.current.draw(this.context, this.size)

      this.indicateColumn(element, rows, rowIndex, columns, columnIndex)

      if (!(element.current instanceof AssignedCell)) {
        return
      }

      const { section } = element.current

      if (!section) {
        return
      }

      if (!sections[section]) {
        sections[section] = {
          min: {
            x: element.current.position.x,
            y: element.current.position.y,
          },
          max: {
            x: element.current.position.x,
            y: element.current.position.y,
          },
        }
      }

      const { min, max } = sections[section]
      const { position } = element.current

      if (position.x < min.x) {
        min.x = position.x
      }
      if (position.y < min.y) {
        min.y = position.y
      }
      if (position.x > max.x) {
        max.x = position.x
      }
      if (position.y > max.y) {
        max.y = position.y
      }
    }))

    this.indicateSection(sections)
  }

  private indicateSection(sections: {
    [key: string]: {
      max: { x: number; y: number}; min: { x: number; y: number }
    }
  }) {
    Object.entries(sections).forEach(([key, value]) => {
      const { min, max } = value
      const { size } = this
      this.context.textAlign = 'center'
      this.context.textBaseline = 'middle'
      this.context.font = `bold ${size}px Lato`
      this.context.fillStyle = 'rgba(0, 0, 0, 1)'
      this.context.fillText(key, 0.5 * ((max.x + min.x) + size), 0.5 * ((max.y + min.y) + size))
    })
  }

  private indicateColumn(
    element: CellData,
    rows: CellData[],
    rowIndex: number,
    columns: CellData[][],
    columnIndex: number,
  ) {
    if (element.current instanceof AssignedCell) {
      if (!element.current.column) {
        return
      }
      const { direction } = element.current
      if (direction === 'horizontal') {
        if (rowIndex > 1) {
          const prev = rows[rowIndex - 1]
          if (prev.current instanceof AssignedCell) {
            if (element.current.column === prev.current.column) {
              return
            }
          }
        }
        element.current.indicateColumn(this.context, this.size, direction)
      }
      if (direction === 'vertical') {
        if (columnIndex > 1) {
          const prev = columns[columnIndex - 1][rowIndex]
          if (prev.current instanceof AssignedCell) {
            if (element.current.column === prev.current.column) {
              return
            }
          }
        }
        element.current.indicateColumn(this.context, this.size, direction)
      }
    }
  }

  public save(): void {
    this.cells.forEach((cells) => cells.forEach((cell) => cell.saveMemento()))
  }

  public undo(): void {
    this.cells.forEach((cells) => cells.forEach((cell) => cell.loadMemento()))

    this.update()
  }
}
