import { IDraggable } from 'lib/entity'
import { Vector2 } from 'lib/util/mathf'
import getPosition from 'lib/util/mouseEvent'
import Tool, { EditorData, ToolType } from '.'

export default abstract class DraggableTool extends Tool implements IDraggable {
  protected position : Vector2

  constructor(name: ToolType, data: EditorData) {
    super(name, data)
    this.bindDragListeners()
    this.attachEventListeners()
  }

  private bindDragListeners() {
    this.onDrag = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDragCancle = this.onDragCancle.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  private attachEventListeners() {
    this.uiData.ref.current.addEventListener('mousedown', this.onDragStart)
    window.addEventListener('keydown', this.onKeyDown)
  }

  public onDragStart(e: MouseEvent): void {
    this.attachListeners()
    this.uiData.origin = this.getPosition(e)
  }

  public onDrag(e: MouseEvent): void {
    this.position = this.getPosition(e)
    const {
      origin, context,
    } = this.uiData
    this.clearUI()
    context.strokeStyle = 'rgba(196, 37, 64, .7)'
    context.strokeRect(
      origin.x,
      origin.y,
      this.position.x - origin.x,
      this.position.y - origin.y,
    )
    context.fillStyle = 'rgba(196, 37, 64, .3)'
    context.fillRect(
      origin.x,
      origin.y,
      this.position.x - origin.x,
      this.position.y - origin.y,
    )
  }

  public onDragEnd(): void {
    this.clear()
  }

  public onDragCancle(): void {
    this.clear()
  }

  protected clear(): void {
    this.detachListeners()
    this.clearUI()
  }

  private calibrateMousePosition = (position: Vector2) => {
    const result = position
    result.x -= this.containerRef.current.offsetLeft - this.containerRef.current.scrollLeft
    result.y -= this.containerRef.current.offsetTop - this.containerRef.current.scrollTop
    return result
  }

  private attachListeners() {
    this.uiData.ref.current.addEventListener('mouseup', this.onDragEnd)
    this.uiData.ref.current.addEventListener('mousemove', this.onDrag)
  }

  private detachListeners() {
    this.uiData.ref.current.removeEventListener('mouseup', this.onDragEnd)
    this.uiData.ref.current.removeEventListener('mousemove', this.onDrag)
  }

  protected getPosition(e: MouseEvent) {
    return this.calibrateMousePosition(getPosition(e))
  }

  protected onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.onDragCancle()
    }
  }
}
