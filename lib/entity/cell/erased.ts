import Cell from '.'

export default class ErasedCell extends Cell {
  private static color = 'rgba(230, 10, 10, 1)'
  constructor(x: number, y: number) {
    super(x, y, ErasedCell.color)
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
