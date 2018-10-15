import _ from 'lodash'
import { GraphContainer, Pos } from '../data_types.js'

const gc = new GraphContainer(new Pos(100, 100))

gc.addNodeToMatrix(1, 0, 'im a node')
gc.addNodeToMatrix(2, 0, 'im a node')

gc.graph.addEdge(gc.nodeMatrix[0][0], gc.nodeMatrix[2][0])

class StateManager {
	constructor() {
		this.stateChangeCallbacks = []
		this.state = {
			graphContainers: {
				[gc.id]: gc,
			},
			uiState: {
				editingNodeId: null,
				cursorState: null,
			},
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
}

const stateManager = new StateManager()

export default stateManager
