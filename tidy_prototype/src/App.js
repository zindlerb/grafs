import cx from 'classnames'
import _ from 'lodash'
import React, { Component } from 'react'
import './shared.css'
import './App.css'
import stateManager from './utilities/state_manager.js'
import { D_KEY, F_KEY } from './utilities/keycodes.js'
import TopBar from './components/TopBar.js'
import Renderer from './components/Renderer.js'
import { POTENTIAL_ADD_NODE, POTENTIAL_SELECT } from './constants/interaction_states.js'

class App extends Component {
	constructor() {
		super()
		this.state = stateManager.state
	}

	onKeydown({ keyCode }) {
		if (D_KEY === keyCode) {
			stateManager.setInteractionState(POTENTIAL_ADD_NODE)
		}
	}

	onKeyup({ keyCode }) {
		const { interactionState } = this.state
		if (D_KEY === keyCode) {
			stateManager.setInteractionState(POTENTIAL_SELECT)
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
			<div className={cx('app h-100 flex flex-column', interactionState.toLowerCase())}>
				<TopBar interactionState={interactionState} />
				<Renderer {...this.state} />
			</div>
		)
	}
}

export default App
