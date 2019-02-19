import cx from 'classnames'
import React from 'react'
import { POTENTIAL_ADD_NODE } from '../constants/interaction_states.js'

const TopBar = ({ interactionState }) => {
	return (
		<div className="top-bar flex justify-between pv3 ph4 items-center flex-shrink-0">
			<div className={cx("help-text", { tomato: interactionState === POTENTIAL_ADD_NODE })}>Hold "D" to add a new node.</div>
			<div className="flex">
				<div className="mh1 button clickable">Layout Horizontal</div>
				<div className="mh1 button clickable">Layout Vertical</div>
			</div>
		</div>
	)
}

export default TopBar
