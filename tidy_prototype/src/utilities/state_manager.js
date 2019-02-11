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
    this.setState(
      new Layout().addNode(this.state, { nodeX: x, nodeY: y, textContent: 'Insert Text Here' })
    )
  }

  beginDrag(nodeId) {
    this.setState({
      interactionState: 'dragging',
      draggedNode: _.cloneDeep(this.state.nodes.find(({ id }) => nodeId === id))
    })
  }

  dragNode(dx, dy) {
    const { x, y } = this.state.draggedNode.box
    this.state.draggedNode.box.x = x - dx
    this.state.draggedNode.box.y = y - dy
    this.triggerRender()
  }

  endDrag() {
    // this should set the actual x
    this.setState({
      interactionState: 'move',
      draggedNode: null
    })
  }
}

const stateManager = new StateManager()

export default stateManager
