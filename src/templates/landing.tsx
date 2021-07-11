import DefaultCell from 'lib/entity/cell/default'
import useResize from 'lib/hooks'
import { setCookie } from 'lib/util/cookie'
import { useRouter } from 'next/router'
import { useAlert } from 'providers/dialog/alert/inner'
import { FormEvent, useEffect, useRef } from 'react'
import styles from 'sass/templates/landing.module.scss'

interface Data {
  context: CanvasRenderingContext2D
  width: number
  height: number
}

interface GridData {
  size: number
  gap: number
  cells: DefaultCell[]
  globalPosition: {
    x: number,
    y: number,
  }
}

export const G_SIZE = 'g_size'
export const G_ROWS = 'g_rows'
export const G_COLUMNS = 'g_columns'

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>()
  const cellSizeRef = useRef<HTMLInputElement>()
  const gridRowsRef = useRef<HTMLInputElement>()
  const gridColumnsRef = useRef<HTMLInputElement>()

  const router = useRouter()

  const { createAlert } = useAlert()

  const data : Data = {
    context: null,
    width: undefined,
    height: undefined,
  }

  const gridData : GridData = {
    size: 20,
    gap: 6,
    cells: [],
    globalPosition: {
      x: 0,
      y: 0,
    },
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const size = cellSizeRef.current.value
    const rows = gridRowsRef.current.value
    const columns = gridColumnsRef.current.value

    if (!size || !rows || !columns) {
      createAlert({ text: '필드를 모두 입력해 주세요' })
      return
    }

    setCookie(G_SIZE, size, 1000 * 60 * 60)
    setCookie(G_ROWS, rows, 1000 * 60 * 60)
    setCookie(G_COLUMNS, columns, 1000 * 60 * 60)

    router.push('/editor')
  }

  const draw = () => {
    if (!canvasRef.current) {
      return
    }

    data.context.clearRect(0, 0, data.width, data.height)

    gridData.cells.forEach((cell) => {
      cell.draw(data.context, gridData.size)
    })
  }

  const initializeGrid = () => {
    gridData.cells = []
    const { size, gap } = gridData
    const one = size + gap

    for (let y = 0; y < data.height; y += one) {
      for (let x = 0; x < data.width; x += one) {
        gridData.cells.push(new DefaultCell({ x, y }))
      }
    }
  }

  const initialize = () => {
    data.context = canvasRef.current.getContext('2d')
    resize()
    initializeGrid()
    draw()
  }

  const resize = () => {
    canvasRef.current.width = 4 * containerRef.current.clientWidth
    canvasRef.current.height = 4 * containerRef.current.clientHeight
    data.width = canvasRef.current.width
    data.height = canvasRef.current.height
  }

  useResize(initialize)

  useEffect(() => {
    initialize()
  }, [])

  return (
    <section ref={containerRef} className={styles.container}>
      <canvas className={styles.background} ref={canvasRef} />
      <div className={styles.foreground}>
        <h1 className={styles.title}>Theater-Editor.io</h1>
        <form className={styles.form} onSubmit={onSubmit}>
          <input ref={cellSizeRef} className={styles.input} type="number" placeholder="셀 사이즈" />
          <input ref={gridRowsRef} className={styles.input} type="number" placeholder="가로 행" />
          <input ref={gridColumnsRef} className={styles.input} type="number" placeholder="세로 열" />
          <input className={styles.submit} type="submit" value="시작하기" />
        </form>
      </div>
    </section>
  )
}
