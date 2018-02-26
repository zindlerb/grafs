// for connecting - svg overlaid on whole thing, arrows from center of boxes, keep arrow in the center

/*

	td:
		[x] make the nodes line up in the center verticaly
		- add adjustable rank and order spacing
		- save to toolbar + persist across sessions, add clear to toolbar
		- add text with auto box sizing
		- add dragging
		- add delete
		- prototype with one of the diagrams - the original coms diagram
		- work on arrow avoidance .. how should the nodes move?
		- test direction
		- test on more diagrams


		- exclude self from the drag
*/

import classnames from 'classnames'
import _ from 'lodash'
import $ from 'jquery'
import dragManager from './drag_manager.js'
import React, { Component } from 'react';
import './App.css';
import { Graph } from './graph_lib.js'

// Modes
const DRAG = 'DRAG'
const CONNECT = 'CONNECT'

const Scrubber = ({ onChange, value, sensitivity }) => {
	sensitivity = sensitivity || 5;

	return (
		<span
			className="scrubber u-unselectable"
			onMouseDown={(e) => {
				dragManager.start(e, {
					originalValue: value,
					onDrag(e) {
						const newValue = this.originalValue + Math.round((e.clientX - this.originalX) / sensitivity)
						if (newValue !== this.originalValue) {
							onChange(newValue)
						}
					}
				})
			}}>
			{ value }
		</span>
	)
}

class StateManager {
	constructor() {
		this.stateChangeCallbacks = []
		this.state = {
			graph: new Graph(),
			ranks: _.fill(Array(6), undefined),
			rankSpacing: 40,
			orderSpacing: 40,
			mode: CONNECT,
			modes: [
				DRAG,
				CONNECT
			]
		}
	}

	registerStateCallback(cb) {
		this.stateChangeCallbacks.push(cb)
	}

	changeState() {
		this.stateChangeCallbacks.forEach((stateCb) => stateCb(this.state))
	}
}

function isPointWithinRect(point, rect) {
	return (
		point.x > rect.x &&
		point.x < (rect.x + rect.width) &&
		point.y > rect.y &&
		point.y < (rect.y + rect.height)
	)
}

function getRectMidpoint({ x, y, width, height }) {
	return {
		x: x + width/2,
		y: y + height/2
	}
}

const stateManager = new StateManager()

const Node = ({ node }) => {
	const { text } = node.attrs
	return (
 			<div
			className={classnames("node u-clickable u-unselectable", node.id)}
			data-node-id={node.id}
			onClick={(e) => e.stopPropagation()}
			onMouseDown={(e) => {
				// connect
				if (stateManager.state.mode === CONNECT) {
					dragManager.start(e, {
						nodeId: node.id,
						onEnd(e) {
							const dragManagerCtx = this;
							$('.node').each(function () {
								const rect = this.getBoundingClientRect();

								if (isPointWithinRect({ x: e.clientX, y: e.clientY }, rect)) {
									stateManager.state.graph.addEdge(
										dragManagerCtx.nodeId,
										$(this).data().nodeId,
										true
									)
									stateManager.changeState()
								}
							})
						}
					})
				} else if (stateManager.state.mode === DRAG) {
					dragManager.start(e, {
						onEnd() {
							// figure out which rank
							// grab all nodes in rank see which one it is in between
						}
					})
				}
			}}>
			{ text }
		</div>
	)
}

const RankContainer = ({ nodes, rank }) => {
	return (
		<div className="rank-container tc"
			onClick={() => {
				const node = stateManager.state.graph.addNode({ text: 'I am a node', rank })

				if (!stateManager.state.ranks[rank]) {
					stateManager.state.ranks[rank] = []
				}

				stateManager.state.ranks[rank].push(node)
				stateManager.changeState()
			}}>
			{ nodes ? nodes.map((node) => <Node node={node} />) : [] }
		</div>
	)
}

class Arrow extends Component {
	componentDidUpdate(prevProps) {
		$(this._lineEl).attr(this.getDomLineAttrs(prevProps.edge.vertices))
	}

	getDomLineAttrs(vertices) {
		const [fromNode, toNode] = vertices
		const fromNodeRect = getRectMidpoint($(`.${fromNode.id}`).get(0).getBoundingClientRect())
		const toNodeRect = getRectMidpoint($(`.${toNode.id}`).get(0).getBoundingClientRect())

		return {
			x1: fromNodeRect.x,
			y1: fromNodeRect.y,
			x2: toNodeRect.x,
			y2: toNodeRect.y
		}
	}

	render() {
		console.log('props', this.props)
		const lineAttrs = this.getDomLineAttrs(this.props.edge.vertices)

		return (
			<line
				ref={(line) => this._lineEl = line}
	      strokeWidth="2"
				stroke="black"
				{...lineAttrs} />
		)
	}
}

const ArrowRenderer = ({ edges }) => {
	return (
		<svg className="arrow-renderer w-100 h-100">
			{ edges.map((edge) => <Arrow edge={edge} />) }
		</svg>
	)
}

class App extends Component {
	constructor() {
		super()
		this.state = stateManager.state
	}

	componentDidMount() {
		stateManager.registerStateCallback((state) => this.setState(state))
	}

  render() {
    return (
      <div className="App w-100 h-100">

				<div className="toolbar">
					<span>toolbar</span>
					<select
							value={this.state.mode}
							onChange={(newMode) => {
								stateManager.state.mode = newMode;
								stateManager.changeState()
							}}>
						{
							this.state.modes.map((mode) => {
								return <option value={mode}>{mode.toLowerCase()}</option>
							})
						}
					</select>
					<span className="dib mh2">Rank Spacing:</span>
					<Scrubber
						value={this.state.rankSpacing}
						onChange={(newValue) => {
							stateManager.state.rankSpacing = newValue;
							stateManager.changeState()
						}}/>
					<span className="dib mh2">Order Spacing:</span>
					<Scrubber
						value={this.state.orderSpacing}
						onChange={(newValue) => {
							stateManager.state.orderSpacing = newValue;
							stateManager.changeState()
						}}/>
				</div>
				{ this.state.ranks.map((nodes, rankNum) => <RankContainer nodes={nodes} rank={rankNum} /> ) }
				<ArrowRenderer
					edges={_.toArray(stateManager.state.graph._edges)} />
      </div>
    );
  }
}

export default App;
