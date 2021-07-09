import {
  useEffect, useRef, useState, ReactNode,
} from 'react'
import styles from 'sass/templates/editor.module.scss'
import { cn } from 'lib/util'
import Tool from 'services/tool'
import SelectTool from 'services/tool/select'
import AssignTool from 'services/tool/assign'
import EraseTool from 'services/tool/erase'
import IndexerTool from 'services/tool/indexer'
import useResize from 'lib/hooks'
import DraggableTool from 'services/tool/draggable'
import { RiEraserLine, RiCursorLine } from 'react-icons/ri'
import { BiSelection } from 'react-icons/bi'
import { ImSortNumericAsc } from 'react-icons/im'
import { FiTag } from 'react-icons/fi'
import Grid from 'lib/entity/grid'
import Ui from 'lib/entity/ui'
import Inspector from 'components/inspector'
import { ToolData, ToolType } from 'lib/entity/tool'
import KeyboardEventListener from 'services/keyboard'
import TaggerTool from 'services/tool/tagger'
import { deleteCookie, getCookie } from 'lib/util/cookie'
import { G_COLUMNS, G_ROWS, G_SIZE } from './landing'

export default function Editor() {
  const editorDataRef = useRef<ToolData>({
    gridData: null,
    uiData: null,
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
      case 'tagger':
        setTool(new TaggerTool(editorData))
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

  const setCenter = () => {
    mainRef.current.scrollTo(
      gridRef.current.clientWidth * 0.5 - mainRef.current.clientWidth * 0.5,
      gridRef.current.clientHeight * 0.5 - mainRef.current.clientHeight * 0.5,
    )
  }

  const initialize = () => {
    const size = parseInt(getCookie(G_SIZE), 10)
    const rows = parseInt(getCookie(G_ROWS), 10)
    const columns = parseInt(getCookie(G_COLUMNS), 10)

    editorDataRef.current.gridData = new Grid(
      gridRef,
      mainRef,
      {
        size, gap: 6, columns, rows,
      },
    )
    editorDataRef.current.uiData = new Ui(
      uiRef,
      mainRef,
      editorDataRef.current.gridData,
    )

    deleteCookie(G_SIZE)
    deleteCookie(G_ROWS)
    deleteCookie(G_COLUMNS)
  }

  const initializeControl = () => {
    uiRef.current.addEventListener('mousedown', onDragStart)
    KeyboardEventListener.instance
      .on('v', () => changeTool('select'))
      .on('a', () => changeTool('assign'))
      .on('e', () => changeTool('erase'))
      .on('i', () => changeTool('indexer'))
      .on('t', () => changeTool('tagger'))
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
      <div className={styles.body}>
        <Inspector tool={tool} />
        <section ref={mainRef} className={styles.main}>
          <canvas ref={gridRef} className={styles.canvas} />
          <canvas ref={uiRef} className={styles.ui} />
        </section>
      </div>
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
  {
    name: 'tagger',
    icon: <FiTag size={22} />,
  },
]
