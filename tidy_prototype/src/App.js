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
			graphContainers: [],
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

class Pos {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class GraphContainerModel {
	constructor(pos) {
		this.graph = new Graph()
		this.pos = pos
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
		console.log('this.state', this.state)
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
				<Renderer graphContainers={this.state.graphContainers} />
      </div>
    );
  }
}

const getOffsetPos = (ev) => {
	console.log(ev.clientX, ev.target.x)
	const rect = ev.target.getBoundingClientRect();
	return new Pos(
		ev.clientX - rect.x,
		ev.clientY - rect.y
	)
}

class Renderer extends Component {
	addGraphContainer = (e) => {
		stateManager.state.graphContainers.push(
			new GraphContainerModel(getOffsetPos(e))
		)
		stateManager.changeState()
	}

	render() {
		return (
			<svg className="renderer" onClick={this.addGraphContainer}>
				{this.props.graphContainers.map((container) => <GraphContainer container={container} />)}
			</svg>
		)
	}
}

class GraphContainer extends Component {
	addNode() {
		this.props.container.graph.addNode({ text: 'noddjkfdlfade\nbdsjffldsdfjsjdfklsoi\nfdjkfdakadjfl' })
		stateManager.changeState()
	}

	render() {
		const {pos} = this.props.container;
		const nodes = this.props.container.graph.allNodes()
		return (
			<g>
				<rect
					onClick={(e) =>  {
						this.addNode()
						e.stopPropagation()
					}}
					className="graph-container"
					x={pos.x} y={pos.y} width={300} height={300} />
				{nodes.map(({ attrs }) => (<GraphNode text={attrs.text} x={pos.x} y={pos.y} />))}
			</g>
		)
	}
}

const GraphNode = ({x, y, text}) => {
	return (
		<g>
			<TextBox x={x} y={y} text={text} padding={8}/>
		</g>
	)
	// make that a p?
}

class TextBox extends Component {
	constructor() {
		super()
		this.state = {}
	}

	render() {
		let {x, y, text, borderColor, padding} = this.props
		const lineHeight = "1.2em";
		padding = padding || 0;
		borderColor = borderColor || 'black';

		let r;
		if (this.state.textElement) {
			var bb = this.state.textElement.getBBox();
			r = (
				<rect
					stroke={borderColor}
					fill="transparent"
					x={x}
					y={y}
					width={bb.width + (padding * 2)}
					height={bb.height + (padding * 2)} />
			)
		}

		return (
			<g>
				{r}
				<g ref={(el) => {
						if (!this.state.textElement) {
							this.setState({textElement: el})
						}
					}} transform={`translate(${x + padding}, ${y + padding})`}>
				  <text x="0" y="0">
						{
							text.split('\n').map(
								(line) => <tspan x="0" dy={lineHeight}>{line}</tspan>
							)
						}
				  </text>
				</g>
			</g>
		)
	}
}




export default App;
