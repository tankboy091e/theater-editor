import Cell from '.'

export default class ErasedCell extends Cell {
  private static readonly color = 'rgba(230, 10, 10, 1)'

  protected get strokeStyle() {
    return ErasedCell.color
  }

  public draw(context: CanvasRenderingContext2D, size: number) {
    super.draw(context, size)
    const { x, y } = this.position
    context.fillStyle = ErasedCell.color
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + size, y + size)
    context.moveTo(x + size, y)
    context.lineTo(x, y + size)
    context.stroke()
  }
}
