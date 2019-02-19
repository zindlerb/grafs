import React, { Component } from 'react'
import cx from 'classnames'
import positionInElement from '../utilities/positionInElement.js'
import stateManager from '../utilities/state_manager.js'
import dragManager from '../drag_manager.js'
import Edge from './Edge.js'
import Node from './Node.js'
import { POTENTIAL_ADD_NODE, POTENTIAL_SELECT } from '../constants/interaction_states.js'

class Renderer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeItemId: null
		}
	}

	beginDrag(id, e) {
		dragManager.start(e, {
			onConsummate() {
				stateManager.beginDrag(id)
			},
			onDrag(e, { dx, dy }) {
				stateManager.dragNode(dx, dy)
			},
			onEnd() {
				stateManager.endDrag()
			}
		})
	}

	click(e) {
		const { interactionState } = this.props
		if (interactionState === POTENTIAL_ADD_NODE) {
			const { x, y } = positionInElement(e)
			stateManager.addNode(x, y)
		} else if (interactionState === POTENTIAL_SELECT) {
			stateManager.deselectNode()
		}
	}

	render() {
		const { nodes, edges, onNodeClick, interactionState, activeItemId } = this.props
		console.log('render props', this.props)
		return (
			<svg onMouseUp={this.click.bind(this)} className={cx('renderer w-100 h-100 flex-auto', interactionState.toLowerCase())}>
				{edges.map((edge) => <Edge key={edge.id} {...edge}/>)}
				{nodes.map((node) => {
					 return (
						 <Node
								onMouseDown={this.beginDrag.bind(this)}
								key={node.id}
								onMouseUp={(id) => {
									console.log('here')
									stateManager.selectNode(id)
								}}
								isActive={activeItemId === node.id }
								interactionState={interactionState}
								{...node}
						 />
					 )
				})}
			</svg>
		)
	}
}

export default Renderer
