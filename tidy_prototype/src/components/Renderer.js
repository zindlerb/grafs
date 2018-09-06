import React, { Component } from 'react';
import Node from './Node.js'
import {Pos, Rect} from '../data_types.js'

const generateLayout = (graphContainer) => {
  // rank size: size of largest node height
  const layoutShapes = []
  const root = graphContainer.pos

  const RANK_PADDING = 50
  const ORDER_PADDING = 20

  graphContainer.nodeMatrix.forEach((rank, rankInd) => {
    rank.forEach((nodeId, orderInd) => {
      const node = graphContainer.graph.getNode(nodeId)
      layoutShapes.push({
        attrs: { text: node.attrs.text },
        shape: new Rect(
          new Pos((orderInd + 1) * ORDER_PADDING, (rankInd + 1) * RANK_PADDING).add(root)),
          100,
          50
        })
    })
  })

  return layoutShapes
}

export default class Renderer extends Component {
  const nodes = generateLayout(this.props.graphContainer).map(({rect, attrs}) => {
    return <Node rect={rect} text={attrs.text}/>
  })

  render() {
    return (
      <svg className="renderer w-100 h-100 db">
        {nodes}
      </svg>
    )
  }
}
