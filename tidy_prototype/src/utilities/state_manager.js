class StateManager {
	constructor() {
		this.stateChangeCallbacks = []
		this.state = {
			graphContainers: [],
			ranks: _.fill(Array(6), undefined),
			rankSpacing: 40,
			orderSpacing: 40,
		}
	}

	registerStateCallback(cb) {
		this.stateChangeCallbacks.push(cb)
	}

  setState(arg) {
    if (typeof arg === 'function') {
      arg(this.state)
      this.triggerRender()
    } else {
      Object.assign(this.state, arg)
    }

    this.triggerRender()
  }

  triggerRender() {
    this.stateChangeCallbacks.forEach((stateCb) => stateCb(this.state))
  }
}

const stateManager = new StateManager()

export default stateManager
