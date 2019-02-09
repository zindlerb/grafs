import _ from 'lodash'
import { genId } from './general.js'

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
		this.stateChangeCallbacks.forEach(stateCb => stateCb(this.state))
	}

  /* ACTIONS */

  addNode(x, y, text = '') {
    const nodeId = genId()
    this.state.nodes.push({
      id: nodeId,
      box: {
        x, y, width: null, height: null
      },
      text: { x: null, y: null, content: text },
      interactionState: null
    })

    Object.assign(this.state, layout(this.state.nodes, this.state.edges, [nodeId]))
    this.triggerRender()
  }
}

const stateManager = new StateManager()

export default stateManager
