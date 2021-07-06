import Option from '.'

export default class SelectOption extends Option<string> {
  protected _values: string[]

  constructor(values: string[]) {
    super(values[0])
    this._values = values
  }

  public get values() {
    return this._values
  }
}
