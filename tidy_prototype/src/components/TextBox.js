import React, { Component } from 'react';

const store = {
  graphs: {
    id: {
      rect: Rect,
      rootNode?
    }
  },
  nodes: {
    id: {
      rect: Rect, // postioned in relation to the graph root
      text: 'fdfsafadj',
      edges: [pointer to edges]
    }
  },
  edges: {
    id: {
      direction: 'both' | 'forward' | 'backward' ,
      text: 'dfasdfas',
      line: Line,
      from: pointer,
      to: pointer,
    }
  }
  currentEditingNode: 'sdsd',
  activeGraphId: 'sdfs',
  activeNodeId: '',
}

// all laid out in graphs and use pointers
// add edge
// need to know:
//   from node id
//   to node id

// add node
// delete edge
// delete node
// move node


/*

   data
   graphs: [
   {
   nodes: {
   id: {  }
   }
   }
   ]



   edges: {

   }

   activeGraphId
   editingNodeId:







   design:

   textEditingStore
   knows: position and content of text nodes


   isEditing:
   call



 */

export default class TextBox extends Component {
  constructor() {
    super()
    this.state = { textElement: undefined }
  }

  render() {
    let {rect, text, borderColor, padding, lineHeight} = this.props
    const {x, y} = this.rect.pos

    lineHeight = lineHeight || "1.2em";
    padding = padding || 0;
    borderColor = borderColor || 'black';

    if (isEditing) {
      return <g/>
    } else {
      return (
        <g>
          <rect
            stroke={borderColor}
            fill="transparent"
            x={x}
            y={y}
            width={rect.width}
            height={rect.height} />
          <g transform={`translate(${x}, ${y})`}>
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
}
