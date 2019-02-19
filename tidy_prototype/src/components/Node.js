import React, { Component } from 'react'
import cx from 'classnames'
import stateManager from '../utilities/state_manager.js'
import { POTENTIAL_NODE_DRAG, POTENTIAL_SELECT } from '../constants/interaction_states.js'
import { padRect } from '../utilities/general.js'
import './Node.css'

// what is the simplest way to handle the connecting?
//    pos - find rect - analyse

class Node extends Component {
	constructor(props) {
		super(props)
		this.state = {
			nodeInteractionState: null // hover, connectEdge
		}
	}

	renderDetectionAreas(rect) {
		const outerRect = padRect(rect, 3)
		const innerRect = padRect(rect, -3)

		return [
			<rect
				className="outer-detection-area"
				fill="pink"
				x={outerRect.x}
				y={outerRect.y}
				width={outerRect.width}
				height={outerRect.height}
			/>,
			<rect
				className="inner-detection-area"
				fill="blue"
				x={innerRect.x}
				y={innerRect.y}
				width={innerRect.width}
				height={innerRect.height}
			/>
		]
	}
	// just use mouse move for all of these
	render() {
		const { pos, box, text, id, isActive, onMouseUp, onMouseDown } = this.props
		const { isHovered } = this.state
		return (
			<g
				onMouseDown={(e) => {
					onMouseDown(id, e)
					e.stopPropagation()
				}}
				onMouseUp={(e) => {
					onMouseUp(id, e)
					e.stopPropagation()
				}}
				className={cx('node', { isHovered, isActive })}
				onMouseEnter={() => stateManager.beginPotentialNodeDrag()}
				onMouseLeave={() => stateManager.endPotentialNodeDrag()}
			>
				<rect
					className="node-rect"
					fill="white"
					stroke="black"
					x={pos.x}
					y={pos.y}
					width={box.width}
					height={box.height}
				/>
				<text
					x={pos.x + text.dx}
					y={pos.y + text.dy}>
					{text.content}
				</text>
				{this.renderDetectionAreas({ x: pos.x, y: pos.y, width: box.width, height: box.height })}
			</g>
		)
	}
}

export default Node
