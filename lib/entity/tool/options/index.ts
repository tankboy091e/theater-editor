export default abstract class Option<T = any> {
  protected _value: T

  constructor(value: T) {
    this._value = value
  }

  public get value() {
    return this._value
  }

  public setValue(value: T): void {
    this._value = value
  }
}

export interface Options {
  [property: string]: Option
}
