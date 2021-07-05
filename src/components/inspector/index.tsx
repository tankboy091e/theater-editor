import styles from 'sass/components/inspector.module.scss'
import Tool from 'services/tool'
import CheckBox from './checkbox'
import InputNumber from './input-number'

export default function Inspector({ tool }: { tool: Tool }) {
  if (!tool) {
    return <></>
  }

  const { options } = tool

  const { name, description } = tool.metadata

  const getEditable = (key: string, value: any) => {
    switch (typeof value) {
      case 'boolean':
        return <CheckBox tool={tool} head={key} value={value} />
      case 'number':
        return <InputNumber tool={tool} head={key} value={value} />
      default:
        return null
    }
  }

  return (
    <section className={styles.container}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      {options?.length > 0 && (
        <ol className={styles.options}>
          <h4 className={styles.title}>옵션</h4>
          {options.map(({ key, value }) => (
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
