import _ from 'lodash'
import Layout from './layout.js'
import { POTENTIAL_SELECT, DRAG_NODE, POTENTIAL_NODE_DRAG } from '../constants/interaction_states.js'

class StateManager {
	constructor() {
		this.stateChangeCallbacks = []
		this.state = {
			interactionState: POTENTIAL_SELECT,
			activeItemId: null, // node or edge id
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
	setInteractionState(newInteractionState) {
		if (this.state.interactionState !== newInteractionState) {
			this.setState({ interactionState: newInteractionState })
		}
	}

	addNode(x, y, text = '') {
		this.setState(
			new Layout().addNode(this.state, { nodeX: x, nodeY: y, textContent: 'Insert Text Here' })
		)
	}

	selectNode(nodeId) {
		this.setState({ activeItemId: nodeId })
	}

	deselectNode() {
		this.setState({ activeItemId: null })
	}

	beginDrag(nodeId) {
		const draggedNode = this.state.nodes.find(({ id }) => nodeId === id)
		this.setState({
			interactionState: DRAG_NODE,
			draggedNode,
			originalDragPosition: _.cloneDeep(draggedNode.pos)
		})
	}

	dragNode(dx, dy) {
		const { x, y } = this.state.originalDragPosition
		this.state.draggedNode.pos.x = x + dx
		this.state.draggedNode.pos.y = y + dy
		this.triggerRender()
	}

	endDrag() {
		this.setState({
			interactionState: POTENTIAL_SELECT,
			draggedNode: null,
			originalDragPosition: null
		})
	}

	beginPotentialNodeDrag() {
		if (this.state.interactionState !== DRAG_NODE) {
			this.setState({ interactionState: POTENTIAL_NODE_DRAG })
		}
	}

	endPotentialNodeDrag() {
		if (this.state.interactionState === POTENTIAL_NODE_DRAG) {
			this.setState({ interactionState: POTENTIAL_SELECT })
		}
	}
}

const stateManager = new StateManager()

export default stateManager
