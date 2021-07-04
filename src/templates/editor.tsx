import Cell from 'lib/entity/cell'
import { Vector2 } from 'lib/util/mathf'
import {
  MutableRefObject, useEffect, useRef, useState,
} from 'react'
import styles from 'sass/templates/editor.module.scss'
import { cn } from 'lib/util'
import Tool from 'components/tool'
import SelectTool from 'components/tool/select'
import AssignTool from 'components/tool/assign'
import EraseTool from 'components/tool/erase'
import IndexerTool from 'components/tool/indexer'
import useResize from 'lib/hooks'

interface CanvasData {
  ref: MutableRefObject<HTMLCanvasElement>
  context: CanvasRenderingContext2D
  width: number
  height: number
}

export interface GridData extends CanvasData {
  cells: CellData[][]
  column: number
  row: number
  size: number
  gap: number
  temporarySelectedCells: { [key: string]: CellData }
}

export interface UiData extends CanvasData {
  origin: Vector2
}

interface CellData {
  target: Cell
}

export default function Editor() {
  const gridData = {
    ref: null,
    context: null,
    width: 0,
    height: 0,
    column: 100,
    row: 100,
    size: 18,
    gap: 6,
    cells: null,
    temporarySelectedCells: {},
  }
  const uiData = {
    ref: null,
    context: null,
    width: 0,
    height: 0,
    origin: { x: 0, y: 0 },
  }

  const [tools, setTools] = useState([])
  const [tool, setTool] = useState<Tool>(null)

  const toolRef = useRef<Tool>(tool)
  const containerRef = useRef<HTMLElement>()
  const toolBarRef = useRef<HTMLElement>()
  const mainRef = useRef<HTMLElement>()
  const gridRef = useRef<HTMLCanvasElement>()
  const uiRef = useRef<HTMLCanvasElement>()

  const onToolClick = (tool: Tool) => {
    setTool(tool)
  }

  const setCenter = () => {
    mainRef.current.scrollTo(
      gridRef.current.clientWidth * 0.5 - mainRef.current.clientWidth * 0.5,
      gridRef.current.clientHeight * 0.5 - mainRef.current.clientHeight * 0.5,
    )
  }

  const initializeCanvas = (ref: MutableRefObject<HTMLCanvasElement>, data: CanvasData) => {
    data.context = ref.current.getContext('2d')
    ref.current.width = gridData.column * (gridData.size + gridData.gap) + gridData.gap
    ref.current.height = gridData.row * (gridData.size + gridData.gap) + gridData.gap
    data.width = gridRef.current.width
    data.height = gridRef.current.height
    data.ref = ref
    ref.current.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  const initializeCells = () => {
    const { width, height } = gridData
    const { size, gap } = gridData

    gridData.cells = []
    for (let i = gap; i < height; i += size + gap) {
      const row = []
      for (let j = gap; j < width; j += size + gap) {
        row.push({
          target: new Cell(j, i),
        })
      }
      gridData.cells.push(row)
    }
  }

  const initializeTools = () => {
    const editorData = {
      gridData,
      uiData,
      containerRef: mainRef,
    }
    const initialTool = new SelectTool(editorData)
    setTools([
      initialTool,
      new AssignTool(editorData),
      new EraseTool(editorData),
      new IndexerTool(editorData),
    ])
    setTool(initialTool)
  }

  useResize(setCenter)

  useEffect(() => {
    toolRef.current = tool
  }, [tool])

  useEffect(() => {
    initializeCanvas(gridRef, gridData)
    initializeCanvas(uiRef, uiData)
    initializeCells()
    initializeTools()
    setCenter()
  }, [])

  return (
    <section ref={containerRef} className={styles.container}>
      <section ref={toolBarRef} className={styles.toolBar}>
        {tools.map((element) => {
          const { name, icon } = element
          return (
            <button
              key={name}
              type="button"
              className={cn(styles.tool, tool?.name === name && styles.active)}
              onClick={() => onToolClick(element)}
            >
              {icon}
            </button>
          )
        })}
      </section>
      <section ref={mainRef} className={styles.main}>
        <canvas ref={gridRef} className={styles.canvas} />
        <canvas ref={uiRef} className={styles.ui} />
      </section>
    </section>
  )
}
