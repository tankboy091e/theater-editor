import Cell, { DefaultProps, Direction } from '..'

interface AssigendProps extends DefaultProps {
  index?: number
  tags?: string[]
}

export default class AssignedCell extends Cell {
  private static readonly COLOR = 'rgba(0, 0, 0, 1)'
  private static readonly INDEXED_COLOR = 'rgba(0, 100, 250, 1)'
  public readonly tags : string[]
  private _index: number
  private _column: string

  constructor({ index, tags, ...props } : AssigendProps) {
    super(props)
    this._index = index
    this.tags = []

    if (tags?.length > 0) {
      tags = tags.filter((tag) => tag)
      for (let i = tags.length - 1; i >= 0; i--) {
        if (tags[i].includes('열')) {
          const columnTag = tags[i]
          const exceptColumnTags = tags.filter((tag) => !tag.includes('열'))
          if (columnTag) {
            this._column = columnTag.replace('열', '').trim()
          }
          this.tags = [...exceptColumnTags, columnTag]
          return
        }
      }
      this.tags = tags
    }
  }

  protected get strokeStyle() {
    if (!this._index) {
      return AssignedCell.COLOR
    }
    return AssignedCell.INDEXED_COLOR
  }

  public get index() {
    return this._index
  }

  public get column() {
    return this._column
  }

  public draw(context: CanvasRenderingContext2D, size: number) {
    super.draw(context, size)
    if (this._index === undefined) {
      return
    }
    context.font = `${size * 0.5}px Lato`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(0, 0, 0, 1)'
    context.fillText(
      this._index.toString(),
      this.position.x + size * 0.5,
      this.position.y + size * 0.5 + 1,
    )
  }

  public indicateColumn(context: CanvasRenderingContext2D, size: number, direction: Direction) {
    context.font = `${size * 0.5}px Lato`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(0, 0, 0, 1)'

    if (direction === 'horizontal') {
      context.fillText(
        this._column,
        this.position.x - size * 0.5,
        this.position.y + size * 0.5 + 1,
      )
    }

    if (direction === 'vertical') {
      context.fillText(
        this._column,
        this.position.x + size * 0.5,
        this.position.y - size * 0.5,
      )
    }
  }
}
