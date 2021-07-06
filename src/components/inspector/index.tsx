import Option from 'lib/entity/tool/options'
import BooleanOption from 'lib/entity/tool/options/boolean'
import NumberOption from 'lib/entity/tool/options/number'
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

  const getEditable = (option: Option) => {
    if (option instanceof BooleanOption) {
      return <CheckBox option={option} />
    }
    if (option instanceof NumberOption) {
      return <InputNumber option={option} />
    }
    return null
  }

  return (
    <section className={styles.container}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      {options?.length > 0 && (
        <ol className={styles.options}>
          <h4 className={styles.title}>옵션</h4>
          {options.map(({ key, option }) => (
            <li key={key} className={styles.option}>
              {getEditable(option)}
              <span className={styles.value}>{key}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
