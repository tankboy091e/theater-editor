import styles from 'sass/components/inspector.module.scss'
import Tool from 'services/tool'

export default function Inspector({ tool }: { tool: Tool }) {
  if (!tool) {
    return <></>
  }

  const { name, description, options } = tool.metadata

  const list = Object.entries(options)

  const getEditable = (key: string, value: any) => {
    switch (typeof value) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            onClick={() => {
              options[key] = !options[key]
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <section className={styles.container}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      {list?.length > 0 && (
        <ol className={styles.options}>
          <h4 className={styles.title}>옵션</h4>
          {list.map(([key, value]) => (
            <li key={key} className={styles.option}>
              {getEditable(key, value)}
              <span className={styles.value}>{key}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
