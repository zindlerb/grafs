import cx from 'classnames'
import _ from 'lodash'
import $ from 'jquery'
import dragManager from './drag_manager.js'
import React, { Component } from 'react'
import './App.css'
import stateManager from './utilities/state_manager.js'
import { D_KEY, F_KEY } from './utilities/keycodes.js'
import { isPointWithinRect, getRectMidpoint } from './utilities/general.js'

/*
   Idea:
   data => render

   renderer has no smarts it does what it is told and handles events.

   nodes:
   id
   box: x, y, widht, height
   text: x, y, content
   interactionState: isHovered, isActive .. might just need is active

   edge:
   line: x1, y1, x2, y2
   text: x, y, content
 */

const Node = ({ box, text, interactionState }) => {
  return (
    <g>
    <text
    x={text.x}
        y={text.y}>
        {text.content}
      </text>
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
      />
    </g>
  )
}

const Edge = ({ line, text }) => {
  return (
    <g>
      <text
        x={text.x}
        y={text.y}>
        {text.content}
      </text>
      <line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        stroke="black"
      />
    </g>
  )
}

class Renderer extends Component {
  click() {
    const { interactionState } = this.props

    if (interactionState === 'addNode') {
      stateManager.setState((state) => {
        state.nodes.push({

        })
      })
    }
  }

  render() {
    const { nodes, edges } = this.props

    return (
      <svg onClick={this.click.bind(this)} className="w-100 h-100 flex-auto">
        {edges.map((node) => <Edge {...edge}/>)}
        {nodes.map((node) => <Node {...node}/>)}
      </svg>
    )
  }
}

const TopBar = ({ interactionState }) => {
  return (
    <div className="top-bar flex justify-between pv3 ph4 items-center flex-shrink-0">
      <div className={cx("help-text", { tomato: interactionState === 'addNode' })}>Hold "D" to add a new node.</div>
      <div className="flex">
				<div className="mh1 button clickable">Layout Horizontal</div>
        <div className="mh1 button clickable">Layout Vertical</div>
			</div>
    </div>
  )
}

const onKeydown = ({ keyCode }) => {
  if (D_KEY === keyCode) {
    stateManager.setState({ interactionState: 'addNode' })
  }
}

const onKeyup = ({ keyCode }) => {
  if (D_KEY === keyCode) {
    stateManager.setState({ interactionState: 'move' })
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = stateManager.state
  }

  componentDidMount() {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)
    stateManager.registerStateCallback(state => this.setState(state))
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('keyup', onKeyup)
  }

	render() {
    const { interactionState } = this.state

		return (
			<div className={cx('app h-100 flex flex-column', interactionState)}>
				<TopBar interactionState={interactionState} />
				<Renderer {...this.state} />
			</div>
		)
  }
}

export default App
