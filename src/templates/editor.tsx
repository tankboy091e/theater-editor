import {
  useEffect, useRef, useState, ReactNode,
} from 'react'
import styles from 'sass/templates/editor.module.scss'
import { cn } from 'lib/util'
import Tool, { ToolData, ToolType } from 'services/tool'
import SelectTool from 'services/tool/select'
import AssignTool from 'services/tool/assign'
import EraseTool from 'services/tool/erase'
import IndexerTool from 'services/tool/indexer'
import useResize from 'lib/hooks'
import DraggableTool from 'services/tool/draggable'
import { RiEraserLine, RiCursorLine } from 'react-icons/ri'
import { BiSelection } from 'react-icons/bi'
import { ImSortNumericAsc } from 'react-icons/im'
import Grid from 'lib/entity/grid'
import Ui from 'lib/entity/ui'

export default function Editor() {
  const editorDataRef = useRef<ToolData>({
    gridData: null,
    uiData: null,
    containerRef: null,
  })

  const [tool, setTool] = useState<Tool>(null)

  const toolRef = useRef<Tool>(tool)
  const containerRef = useRef<HTMLElement>()
  const toolBarRef = useRef<HTMLElement>()
  const mainRef = useRef<HTMLElement>()
  const gridRef = useRef<HTMLCanvasElement>()
  const uiRef = useRef<HTMLCanvasElement>()

  const changeTool = (name: ToolType) => {
    const editorData = editorDataRef.current
    switch (name) {
      case 'select':
        setTool(new SelectTool(editorData))
        break
      case 'assign':
        setTool(new AssignTool(editorData))
        break
      case 'erase':
        setTool(new EraseTool(editorData))
        break
      case 'indexer':
        setTool(new IndexerTool(editorData))
        break
      default:
        break
    }
  }

  const onDragStart = (e: MouseEvent) => {
    if (toolRef.current instanceof DraggableTool) {
      toolRef.current.onDragStart(e)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'v':
        changeTool('select')
        return
      case 'a':
        changeTool('assign')
        return
      case 'e':
        changeTool('erase')
        return
      case 'i':
        changeTool('indexer')
        return
      default:
        break
    }
    if (toolRef.current instanceof DraggableTool) {
      toolRef.current.onKeyDown(e)
    }
  }

  const setCenter = () => {
    mainRef.current.scrollTo(
      gridRef.current.clientWidth * 0.5 - mainRef.current.clientWidth * 0.5,
      gridRef.current.clientHeight * 0.5 - mainRef.current.clientHeight * 0.5,
    )
  }

  const initialize = () => {
    editorDataRef.current.gridData = new Grid(gridRef, {
      size: 18, gap: 6, column: 100, row: 100,
    })
    editorDataRef.current.uiData = new Ui(uiRef, editorDataRef.current.gridData)
    editorDataRef.current.containerRef = mainRef
  }

  const initializeControl = () => {
    uiRef.current.addEventListener('mousedown', onDragStart)
    window.addEventListener('keydown', onKeyDown)
  }

  useResize(setCenter)

  useEffect(() => {
    toolRef.current = tool
  }, [tool])

  useEffect(() => {
    initialize()
    changeTool('select')
    setCenter()
    initializeControl()
  }, [])

  return (
    <section ref={containerRef} className={styles.container}>
      {tools && (
        <section ref={toolBarRef} className={styles.toolBar}>
          {tools.map(({ name, icon }) => (
            <button
              key={name}
              type="button"
              className={cn(styles.tool, tool?.name === name && styles.active)}
              onClick={() => changeTool(name)}
            >
              {icon}
            </button>
          ))}
        </section>
      )}
      <section ref={mainRef} className={styles.main}>
        <canvas ref={gridRef} className={styles.canvas} />
        <canvas ref={uiRef} className={styles.ui} />
      </section>
    </section>
  )
}

const tools: {
  name: ToolType
  icon: ReactNode
}[] = [
  {
    name: 'select',
    icon: <RiCursorLine size={24} />,
  },
  {
    name: 'assign',
    icon: <BiSelection size={24} />,
  },
  {
    name: 'erase',
    icon: <RiEraserLine size={24} />,
  },
  {
    name: 'indexer',
    icon: <ImSortNumericAsc size={20} />,
  },
]
