import React from 'react';
import dragManager from '../drag_manager.js'
import stateManager from '../utilities/state_manager.js'
import MoveArrowIcon from './icons/MoveArrowIcon.js'
import Rect from './Rect.js'
import {Pos} from '../data_types.js'

const GraphContainer = ({rect, graphContainerId}) => {
  const moveIconSize = 20
  const moveIconSpacing = 10

  return (
    <g>
      <MoveArrowIcon
        onMouseDown={(e) => dragManager.start(e, {
            rootX: rect.pos.x,
            rootY: rect.pos.y,
            onDrag(_, {dx, dy}) {
              stateManager.setState((state) => {
                state.graphContainers[graphContainerId].pos = new Pos(this.rootX + dx, this.rootY + dy)
              })
            }
        })}
        x={rect.pos.x}
        y={rect.pos.y - moveIconSize - moveIconSpacing}
        size={moveIconSize}
      />
      <Rect
        rect={rect}
        borderColor="black"
      />
    </g>
  )
}

export default GraphContainer
