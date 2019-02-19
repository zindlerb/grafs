import React from 'react'

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

export default Edge
