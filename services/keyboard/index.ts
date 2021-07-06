export default class KeyboardEventListener {
  private static _instance : KeyboardEventListener
  public static get instance() {
    if (!this._instance) {
      this._instance = new KeyboardEventListener()
    }
    return this._instance
  }

  private readonly _currentKeys : { [key: string] : boolean }
  private callbacks : { [key: string] : () => void }

  private constructor() {
    this._currentKeys = {}
    this.callbacks = {}
    this.bindEventListeners()
    this.attachEventListeners()
  }

  public on(keys : string | string[], func: () => void) : KeyboardEventListener {
    const key = Array.isArray(keys) ? keys.join('-') : keys
    this.callbacks[key.toLowerCase()] = func
    return this
  }

  private attachEventListeners() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  private bindEventListeners() : void {
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  private onKeyDown(e: KeyboardEvent) : void {
    this._currentKeys[e.key.toLowerCase()] = true
    this.update()
  }

  private onKeyUp(e: KeyboardEvent) : void {
    delete this._currentKeys[e.key.toLowerCase()]
  }

  private update() : void {
    const current = Object.keys(this._currentKeys).join('-')
    for (const [key, element] of Object.entries(this.callbacks)) {
      if (key === current) {
        element.call(null)
        return
      }
    }
  }
}
