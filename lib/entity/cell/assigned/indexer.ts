import AssignedCell from '.'

export default class IndexAssigendCell extends AssignedCell {
  private static readonly indexColor = 'rgba(0, 50, 255, 1)'
  private index: number

  constructor(x: number, y: number, index: number) {
    super(x, y)
    this.index = index
  }

  protected get strokeStyle() {
    return IndexAssigendCell.indexColor
  }

  public draw(context: CanvasRenderingContext2D, size: number) {
    super.draw(context, size)
    context.font = `${size * 0.5}px Lato`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(0, 0, 0, 1)'
    context.fillText(
      this.index.toString(),
      this.position.x + size * 0.5,
      this.position.y + size * 0.5,
    )
  }
}
