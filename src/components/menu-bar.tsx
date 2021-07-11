import AssignedCell, { AssignedCellData } from 'lib/entity/cell/assigned'
import { ToolData } from 'lib/entity/tool'
import { useAlert } from 'providers/dialog/alert/inner'
import { usePrompt } from 'providers/dialog/prompt/inner'
import styles from 'sass/components/menu.module.scss'

type MenuType = '내보내기'

interface Menu {
  type: MenuType
  children: Menu[]
}

export default function MenuBar({ toolData }: { toolData: ToolData }) {
  const { createPrompt } = usePrompt()
  const { createAlert } = useAlert()

  const menus : Menu[] = [
    {
      type: '내보내기',
      children: null,
    },
  ]

  const onClick = (name: MenuType) => {
    switch (name) {
      case '내보내기':
        onExport()
        break
      default:
        break
    }
  }

  const onExport = async () => {
    const assignedCells = getAssignedCells()

    if (assignedCells.length === 0) {
      await createAlert({ text: '지정된 좌석이 없습니다.' })
      return
    }

    const filename = await createPrompt({ text: '파일 이름을 입력하세요' })

    const data = JSON.stringify(assignedCells)

    const encoded = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`

    const anchor = document.createElement('a')
    anchor.setAttribute('href', encoded)
    anchor.setAttribute('download', `${filename}.json` || 'seat-layout.json')
    anchor.click()

    anchor.remove()
  }

  const getAssignedCells = () => {
    const min = {
      x: undefined,
      y: undefined,
    }

    const result: AssignedCellData[][] = []

    toolData.gridData.cells
      .forEach((columns) => {
        const rows : AssignedCellData[] = []
        columns.forEach((row) => {
          if (row.current instanceof AssignedCell) {
            const { current } = row
            rows.push(current.data())

            const { position } = current

            if (min.x === undefined && min.y === undefined) {
              min.x = position.x
              min.y = position.y
            }

            if (position.x < min.x) {
              min.x = position.x
            }

            if (position.y < min.y) {
              min.y = position.y
            }
          }
        })
        if (rows.length > 0) {
          result.push(rows)
        }
      })

    result.forEach((rows) => rows.forEach((data) => {
      const { position } = data
      data.position = {
        x: position.x - min.x,
        y: position.y - min.y,
      }
    }))

    return result
  }

  return (
    <section className={styles.container}>
      {menus.map(({ type, children }) => (
        <button key={type} type="button" className={styles.menu} onClick={() => onClick(type)}>{type}</button>
      ))}
    </section>
  )
}
