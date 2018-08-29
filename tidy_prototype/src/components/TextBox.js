import React, { Component } from 'react';

// TODO:
//   hover for ball on edge (do outside)
//   eventing ability to drag
//

export default class TextBox extends Component {
  constructor() {
    super()
    this.state = { textElement: undefined }
  }

  render() {
    let {pos, text, borderColor, padding, lineHeight} = this.props
    const {x, y} = pos

    lineHeight = lineHeight || "1.2em";
    padding = padding || 0;
    borderColor = borderColor || 'black';

    let borderContainer;
    if (this.state.textElement) {
      var boundingBox = this.state.textElement.getBBox();
      borderContainer = (
        <rect
          stroke={borderColor}
          fill="transparent"
          x={x}
          y={y}
          width={boundingBox.width + (padding * 2)}
          height={boundingBox.height + (padding * 2)} />
      )
    }

    return (
      <g>
        {borderContainer}
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
