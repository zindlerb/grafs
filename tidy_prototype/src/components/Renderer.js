import _ from 'lodash'
import React, { Component } from 'react';
import Node from './Node.js'
import * as dataTypes from '../data_types.js'
import {getTextBoxDimensions, getOffsetPos} from '../utilities/general.js'
import $ from 'jquery'
import Rect from './Rect.js'
import GraphContainer from './GraphContainer.js'
import stateManager from '../utilities/state_manager.js'
import {COLORS} from '../constants.js'

const RANK_PADDING = 20
const ORDER_PADDING = 20
const TEXT_BOX_PADDING = 15

const TextEditField = ({onChange, value, rect}) => {
  return (
    <textarea
      onClick={(e) => e.stopPropagation()}
      onChange={onChange}
      value={value}
      style={{
        position: 'absolute',
        left: rect.pos.x,
        top: rect.pos.y,
        width: rect.width,
        height: rect.height
      }} />
  )
}

const generateLayout = (graphContainer, uiState) => {
  // rank size: size of largest node height
  const nodeData = []
  const root = graphContainer.pos

  // box sizing
  // row heights - tallest box in row + padding
  // width - widest row + padding
  // centering - (total width - total box width) / 2 start pos

  let containerWidth;
  let containerHeight;
  let rankHeights = []
  let rankWidths = []
  let editComponent;

  graphContainer.nodeMatrix.forEach((rank, rankInd) => {
    let rankWidth = 0
    let rankHeight = 0
    rank.forEach((nodeId, orderInd) => {
      const node = graphContainer.graph.getNode(nodeId)
      const { height, width } = getTextBoxDimensions(node.attrs.text, TEXT_BOX_PADDING)

      if (orderInd === 0) rankWidth += ORDER_PADDING
      rankWidth += width
      rankWidth += ORDER_PADDING

      rankHeight = Math.max(rankHeight, height + RANK_PADDING)
    })

    rankHeights[rankInd] = rankHeight
    rankWidths[rankInd] = rankWidth
  })

  containerHeight = rankHeights.reduce((a, b) => a + b, 0)
  containerWidth = rankWidths.reduce((a, b) => Math.max(a, b), 0)

  /*
  console.log('containerWidth', containerWidth)
  console.log('containerHeight', containerHeight)
  console.log('rankHeights', rankHeights)
  console.log('rankWidths', rankWidths)
  */

  let rankY = 0
  graphContainer.nodeMatrix.forEach((rank, rankInd) => {
    let rankHeight = rankHeights[rankInd]
    let rankWidth = rankWidths[rankInd]
    const rankOffset = (containerWidth - rankWidth) / 2
    let rankX = rankOffset
    rank.forEach((nodeId, orderInd) => {
      const node = graphContainer.graph.getNode(nodeId)
      const { height, width } = getTextBoxDimensions(node.attrs.text, TEXT_BOX_PADDING)
      rankX += ORDER_PADDING
      const nodeDatum = {
        isEditing: uiState.editingNodeId === nodeId,
        attrs: { text: node.attrs.text, nodeId: node.id },
        shape: new dataTypes.Rect(
          new dataTypes.Pos(rankX, rankY + ((rankHeight - height) / 2)).add(root),
          width,
          height
        ),
        rawNode: node
      }

      nodeData.push(nodeDatum)

      rankX += width
    })

    rankY += rankHeight
  })

  const nodeComponents = nodeData.map(({shape, attrs, isEditing}) => {
    return <Node isEditing={isEditing} rect={shape} text={attrs.text} padding={TEXT_BOX_PADDING} nodeId={attrs.nodeId} />
  })

  const containerComponent = (
    <GraphContainer
      rect={new dataTypes.Rect(root, containerWidth, containerHeight)}
      graphContainerId={graphContainer.id}
    >
    {nodeComponents}
    </GraphContainer>
  )

  const editDatum = nodeData.find(({isEditing}) => isEditing)
  if (editDatum) {
    editComponent = (
      <TextEditField
        onChange={(e) => {
            editDatum.rawNode.attrs.text = e.target.value
            stateManager.triggerRender()
        }}
        rect={editDatum.shape}
        value={editDatum.attrs.text}
      />
    )
  }

  return {
      containerHeight,
      containerWidth,
      components: [containerComponent],
      domComponents: [editComponent]
    }
}

const AddContainerCursor = ({pos}) => {
  const width = 50
  const height = 30
  const bluePlusSize = 20
  const bluePlusPos = pos.add(new dataTypes.Pos(width/2, height/2))

  const bluePlus = (
    <text
      fontSize={bluePlusSize}
      x={bluePlusPos.x}
      y={bluePlusPos.y}
      fill={COLORS.blue}>
      +
    </text>
  )

  return (
    <g>
      <Rect rect={new dataTypes.Rect(pos, width, height)} borderColor="black" />
      {bluePlus}
    </g>
  )
}

export default class Renderer extends Component {
  deSelect() {
    stateManager.setState((state) => {
      state.uiState.editingNodeId = null
    })
  }

  render() {
    let allDomNodes = []
    let allShapes = []
    let addContainerCursor

    _.toArray(this.props.graphContainers).forEach((graphContainer) => {
      const {
        components,
        domComponents
      } = generateLayout(graphContainer, this.props.uiState)

      allDomNodes = allDomNodes.concat(domComponents)
      allShapes = allShapes.concat(components)
    })

    const cursorStateType = _.get(this.props.uiState, 'cursorState.stateType')
    const cursorStatePos = _.get(this.props.uiState, 'cursorState.pos')

    if (cursorStateType === 'container') {
      addContainerCursor = <AddContainerCursor pos={cursorStatePos} />
    }

    return (
      <div className="w-100 h-100" onClick={(e) => {
          const cursorStateType = _.get(this.props.uiState, 'cursorState.stateType')
          if (cursorStateType === 'container' ) {
            stateManager.setState((state) => {
              const graphContainer = new dataTypes.GraphContainer(getOffsetPos(e, true))
              state.graphContainers[graphContainer.id] = graphContainer
            })
          }
          this.deSelect()
      }} >
        {allDomNodes}
        <svg className="renderer w-100 h-100 db"
             onMouseMove={(e) => {
                 stateManager.state.uiState.cursorState = { stateType: 'container', pos: getOffsetPos(e, true) }
                 stateManager.triggerRender()
                 e.stopPropagation()
             }}
        >
          {addContainerCursor}
          {allShapes}
        </svg>
      </div>
    )
  }
}
