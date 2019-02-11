import cx from 'classnames'
import _ from 'lodash'
import $ from 'jquery'
import dragManager from './drag_manager.js'
import React, { Component } from 'react'
import './App.css'
import stateManager from './utilities/state_manager.js'
import { D_KEY, F_KEY } from './utilities/keycodes.js'
import { isPointWithinRect, getRectMidpoint } from './utilities/general.js'
import positionInElement from './utilities/positionInElement.js'
import dragManager from './drag_manager.js'

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

class Node extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovered: false
    }
  }

  render() {
    const { box, text, interactionState, id, isActive, onMouseUp, onMouseDown } = this.props
    const { isHovered } = this.state
    return (
      <g
        onMouseDown={(e) => {
          onMouseDown(id, e)
          e.stopPropagation()
        }}
        onMouseUp={() => {
          onMouseUp(id, e)
          e.stopPropagation()
        }}
        className={cx('grab node', { isHovered, isActive })}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false  })}
      >
        <rect
          className="node-rect"
          fill="white"
          stroke="black"
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
        />
        <text
          x={text.x}
          y={text.y}>
          {text.content}
        </text>
      </g>
    )
  }
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
        stateManager.drag(dx, dy)
      },
      onEnd() {
        stateManager.endDrag()
      }
    })
  }

  click(e) {
    const { interactionState } = this.props
    if (interactionState === 'addNode') {
      const { x, y } = positionInElement(e)
      stateManager.addNode(x, y)
    } else if (interactionState === 'move') {
      this.setState({ activeItemId: null })
    }
  }

  render() {
    const { nodes, edges, onNodeClick } = this.props
    const { activeItemId } = this.state

    return (
      <svg onClick={this.click.bind(this)} className="w-100 h-100 flex-auto">
        {edges.map((edge) => <Edge key={edge.id} {...edge}/>)}
        {nodes.map((node) => {
           return (
             <Node
                onMouseDown={this.beginDrag.bind(this)}
                key={node.id}
                onMouseUp={(id) => {
                  if (stateManager.state.interactionState === 'move') {
                    this.setState({ activeItemId: id })
                  }
                }}
               isActive={activeItemId === node.id }
               {...node}
             />
           )
        })}
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



class App extends Component {
  constructor() {
    super()
    this.state = stateManager.state
  }

  onKeydown({ keyCode }) {
    const { interactionState } = this.state
    if (D_KEY === keyCode && interactionState !== 'addNode') {
      stateManager.setState({ interactionState: 'addNode' })
    }
  }

  onKeyup({ keyCode }) {
    const { interactionState } = this.state
    if (D_KEY === keyCode && interactionState !== 'move') {
      stateManager.setState({ interactionState: 'move' })
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeydown.bind(this))
    window.addEventListener('keyup', this.onKeyup.bind(this))
    stateManager.registerStateCallback(state => this.setState(state))
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeydown.bind(this))
    window.removeEventListener('keyup', this.onKeyup.bind(this))
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
