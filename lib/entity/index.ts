export interface IDraggable {
  onDragStart(e: MouseEvent) : void
  onDrag(e: MouseEvent) : void
  onDragEnd(e: MouseEvent) : void
  onDragCancle() : void
}
