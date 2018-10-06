import React, { Component } from 'react'
import Rect from './Rect.js'
import TextBox from './TextBox.js'
import { Pos } from '../data_types.js'
import numeric from 'numeric'
import stateManager from '../utilities/state_manager.js'
import classNames from 'classnames'
import { getOffsetPos } from '../utilities/general.js'
import { CURSOR_STATES } from '../constants.js'
import dragManager from '../drag_manager.js'

const DRAG_NODE = 'DRAG_NODE'
const DRAW_EDGE = 'DRAW_EDGE'

class Node extends Component {
	constructor() {
		super()
		this.state = {
			isEditing: false,
			interactionType: undefined,
		}
	}

	onEnterOuterHitbox = e => {
		this.setState({ interactionType: DRAW_EDGE })
	}

	onExitOuterHitbox = e => {
		this.setState({
			interactionType: undefined,
		})
	}

	onEnterInnerHitbox = e => {
		this.setState({
			interactionType: DRAG_NODE,
		})
	}

	render() {
		const borderHitboxWidth = 15
		const { interactionType } = this.state

		return (
			<g
				className={classNames({
					'c-crosshair': interactionType === DRAW_EDGE,
					'c-move': interactionType === DRAG_NODE,
				})}
				onDoubleClick={e => {
					stateManager.setState(({ uiState }) => (uiState.editingNodeId = this.props.nodeId))
					e.stopPropagation()
				}}
				onMouseDown={e => {
					if (interactionType === DRAW_EDGE) {
						stateManager.setState(state => {
							state.uiState.cursorState = {
								stateType: CURSOR_STATES.dragEdge,
								originalPos: getOffsetPos(e, true),
								pos: getOffsetPos(e, true),
								originNodeId: this.props.nodeId,
								originContainerId: this.props.containerId,
							}
						})

						dragManager.start(e, {
							onDrag(e) {
								stateManager.setState(state => {
									Object.assign(state.uiState.cursorState, {
										pos: getOffsetPos(e, true),
									})
								})
							},
						})
					}
					e.stopPropagation()
				}}
				onMouseUp={e => {
					const { containerId, nodeId } = this.props
					const originNodeId = _.get(stateManager, 'state.uiState.cursorState.originNodeId', {})
					const originContainerId = _.get(
						stateManager,
						'state.uiState.cursorState.originContainerId',
						{}
					)

					if (originContainerId === containerId && nodeId !== originNodeId) {
						// May remove self node check in future
						stateManager.setState(state => {
							state.graphContainers[containerId].graph.addEdge(originNodeId, nodeId, true, {})
						})
					}
				}}>
				<TextBox
					isEditing={this.props.isEditing}
					onBlur={this.props.onBlur}
					rect={this.props.rect}
					text={this.props.text}
					padding={this.props.padding}
				/>
				<Rect
					onMouseEnter={this.onEnterOuterHitbox}
					onMouseLeave={this.onExitOuterHitbox}
					onMouseMove={this.onBorderHitboxMove}
					rect={this.props.rect.expand(borderHitboxWidth / 2)}
				/>
				<Rect
					onMouseEnter={this.onEnterInnerHitbox}
					rect={this.props.rect.shrink(borderHitboxWidth / 2)}
				/>
			</g>
		)
	}
}

export default Node
