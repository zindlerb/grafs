import {Pos} from '../data_types.js'

class GraphContainer {
  constructor(pos) {
    this.nodeMatrix = []
    this.graph = new Graph()
    this.pos = pos
  }

  addNodeToMatrix(rank, order, text) {
    const node = this.graph.addNode({ text })
    if (!this.nodeMatrix[rank]) {
      this.nodeMatrix[rank] = []
    }

    this.nodeMatrix[rank].splice(order, 0, node.id)
  }
}

const graphContainer = new GraphContainer(new Pos(50, 25))

graphContainer.addNodeToMatrix(0, 0, 'Ravi')
graphContainer.addNodeToMatrix(0, 1, 'Matt')
graphContainer.addNodeToMatrix(1, 0, 'Brittany')
graphContainer.addNodeToMatrix(2, 0, 'Alisha')

class StateManager {
	constructor() {
		this.stateChangeCallbacks = []
		this.state = {
			graphContainers: [
        graphContainer
      ]
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
