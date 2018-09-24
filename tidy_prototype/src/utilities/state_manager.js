import _ from 'lodash'

class StateManager {
	constructor() {
		this.stateChangeCallbacks = []
		this.state = {
			graphContainers: {},
      uiState: {
        editingNodeId: null,
        cursorState: null
      }
		}
	}

	registerStateCallback(cb) {
		this.stateChangeCallbacks.push(cb)
	}

  setState(arg) {
    if (typeof arg === 'function') {
      arg(this.state)
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
