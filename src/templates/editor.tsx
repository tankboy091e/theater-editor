import Cell from 'lib/entity/cell'
import SelectedCell from 'lib/entity/selected-cell'
import { Vector2 } from 'lib/util/mathf'
import getPosition from 'lib/util/mouseEvent'
import { useEffect, useRef } from 'react'
import styles from 'sass/templates/editor.module.scss'

interface CanvasData {
  context: CanvasRenderingContext2D
  width: number
  height: number
}

interface GridData extends CanvasData {
  cells: CellData[][]
  column: number
  row: number
  size: number
  gap: number
}

interface UiData extends CanvasData {
  origin : Vector2
}

interface CellData {
  target: Cell
}

export default function Editor() {
  const containerRef = useRef<HTMLElement>()
  const toolBarRef = useRef<HTMLElement>()
  const mainRef = useRef<HTMLElement>()
  const gridRef = useRef<HTMLCanvasElement>()
  const uiRef = useRef<HTMLCanvasElement>()

  const gridData : GridData = {
    context: null,
    width: 0,
    height: 0,
    column: 100,
    row: 100,
    size: 18,
    gap: 6,
    cells: null,
  }

  const uiData : UiData = {
    context: null,
    width: 0,
    height: 0,
    origin: { x: 0, y: 0 },
  }

  const update = () => {
    clear()
    gridData.cells.forEach((array) => (
      array.forEach((element) => {
        element.target.draw(gridData.context, gridData.size)
      })
    ))
  }

  const clear = () => {
    gridData.context.clearRect(0, 0, gridData.width, gridData.height)
  }

  const select = (from : Vector2, to: Vector2) => {
    const { size, gap } = gridData

    for (let i = Math.floor(from.y / (size + gap)); i < Math.round(to.y / (size + gap)); i++) {
      for (let j = Math.floor(from.x / (size + gap)); j < Math.round(to.x / (size + gap)); j++) {
        const { x, y } = gridData.cells[i][j].target.position
        gridData.cells[i][j].target = new SelectedCell(x, y)
      }
    }

    update()
  }

  const setCenter = () => {
    mainRef.current.scrollTo(
      gridRef.current.clientWidth * 0.5 - mainRef.current.clientWidth * 0.5,
      gridRef.current.clientHeight * 0.5 - mainRef.current.clientHeight * 0.5,
    )
  }

  const calibrateMousePosition = (position : Vector2) => {
    const result = position
    result.x -= mainRef.current.offsetLeft - mainRef.current.scrollLeft
    result.y -= mainRef.current.offsetTop - mainRef.current.scrollTop
    return result
  }

  const onDragStart = (e: MouseEvent): void => {
    attachListeners()

    uiData.origin = calibrateMousePosition(getPosition(e))
  }

  const onDrag = (e: MouseEvent): void => {
    const position = calibrateMousePosition(getPosition(e))

    const {
      origin, context, width, height,
    } = uiData

    context.clearRect(0, 0, width, height)
    context.strokeStyle = 'rgba(0, 100, 250, .7)'
    context.strokeRect(origin.x, origin.y, position.x - origin.x, position.y - origin.y)
    context.fillStyle = 'rgba(0, 100, 250, .3)'
    context.fillRect(origin.x, origin.y, position.x - origin.x, position.y - origin.y)
  }

  const onDragEnd = (e: MouseEvent): void => {
    detachListeners()

    const position = calibrateMousePosition(getPosition(e))
    const {
      origin, context, width, height,
    } = uiData

    context.clearRect(0, 0, width, height)

    select({
      x: origin.x < position.x ? origin.x : position.x,
      y: origin.y < position.y ? origin.y : position.y,
    },
    {
      x: origin.x > position.x ? origin.x : position.x,
      y: origin.y > position.y ? origin.y : position.y,
    })
  }

  const initializeCanvas = (ref: HTMLCanvasElement, data: CanvasData) => {
    data.context = ref.getContext('2d')
    ref.width = gridData.column * (gridData.size + gridData.gap) + gridData.gap
    ref.height = gridData.row * (gridData.size + gridData.gap) + gridData.gap
    data.width = gridRef.current.width
    data.height = gridRef.current.height
  }

  const initializeEventListener = () => {
    uiRef.current.addEventListener('mousedown', onDragStart)
  }

  const initializeCells = () => {
    const { width, height } = gridData
    const { size: gridSize, gap } = gridData

    gridData.cells = []
    for (let i = gap; i < height; i += gridSize + gap) {
      const row = []
      for (let j = gap; j < width; j += gridSize + gap) {
        row.push({
          target: new Cell(j, i, 'rgba(0, 0, 0, .3)'),
        })
      }
      gridData.cells.push(row)
    }
  }

  const attachListeners = () => {
    uiRef.current.addEventListener('mouseup', onDragEnd)
    uiRef.current.addEventListener('mousemove', onDrag)
  }

  const detachListeners = () => {
    uiRef.current.removeEventListener('mouseup', onDragEnd)
    uiRef.current.removeEventListener('mousemove', onDrag)
  }

  useEffect(() => {
    initializeCanvas(gridRef.current, gridData)
    initializeCanvas(uiRef.current, uiData)
    initializeEventListener()
    initializeCells()
    update()
    setCenter()
  }, [])

  return (
    <section ref={containerRef} className={styles.container}>
      <section ref={toolBarRef} className={styles.toolBar} />
      <section ref={mainRef} className={styles.main}>
        <canvas ref={gridRef} className={styles.canvas} />
        <canvas ref={uiRef} className={styles.ui} />
      </section>
    </section>
  )
}
