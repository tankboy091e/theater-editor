import { Vector2 } from 'lib/util/mathf'
import Cell, { DefaultProps, Direction } from '..'

interface AssigendProps extends DefaultProps {
  index?: number
  tags?: string[]
  color? : string
}

export interface AssignedCellData {
  position: Vector2
  tags : string[]
  color: string
  column: string
  section: string
  index: number
}

export default class AssignedCell extends Cell {
  public readonly tags : string[]
  public readonly color: string
  public readonly column: string
  public readonly section: string
  public readonly index: number

  constructor({
    index, tags, color = 'rgba(0, 0, 0, 1)', ...props
  } : AssigendProps) {
    super(props)
    this.index = index
    this.tags = tags || []
    this.color = color

    if (tags?.length > 0) {
      this.tags = this.remainOnlyOneTag(this.tags, '열')
      this.tags = this.remainOnlyOneTag(this.tags, '구역')
      this.column = this.tags.find((tag) => tag.includes('열'))
      this.section = this.tags.find((tag) => tag.includes('구역'))
    }
  }

  private remainOnlyOneTag(tags: string[], value: string) {
    const array = tags.filter((tag) => tag)
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i].includes(value)) {
        const specific = array[i]
        const extra = array.filter((tag) => !tag.includes(value))
        return [...extra, specific]
      }
    }
    return array
  }

  protected get strokeStyle() {
    return this.color
  }

  public draw(context: CanvasRenderingContext2D, size: number) {
    super.draw(context, size)
    if (this.index === undefined) {
      return
    }
    context.font = `${size * 0.5}px Lato`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(0, 0, 0, 1)'
    context.fillText(
      this.index.toString(),
      this.position.x + size * 0.5,
      this.position.y + size * 0.5 + 1,
    )
  }

  public indicateColumn(context: CanvasRenderingContext2D, size: number, direction: Direction) {
    context.font = `${size * 0.5}px Lato`
    context.textAlign = 'right'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(0, 0, 0, 1)'

    if (direction === 'horizontal') {
      context.fillText(
        this.column,
        this.position.x - size * 0.5 + 1,
        this.position.y + size * 0.5 + 1,
      )
    }

    if (direction === 'vertical') {
      context.fillText(
        this.column,
        this.position.x + size * 0.5,
        this.position.y - size * 0.5,
      )
    }
  }

  public data() {
    return {
      position: this.position,
      index: this.index,
      color: this.color,
      tags: this.tags,
      column: this.column,
      section: this.section,
    }
  }
}
