import _ from 'lodash'
import Layout from './layout.js'

class StateManager {
	constructor() {
		this.stateChangeCallbacks = []
		this.state = {
      interactionState: 'move',
			edges: [],
      nodes: []
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
    console.log('this.state', this.state)
		this.stateChangeCallbacks.forEach(stateCb => stateCb(this.state))
	}

  /* ACTIONS */
  addNode(x, y, text = '') {
    Object.assign(this.state, new Layout().addNode(this.state, { nodeX: x, nodeY: y, textContent: 'Insert Text Here' }))
    this.triggerRender()
  }
}

const stateManager = new StateManager()

export default stateManager
