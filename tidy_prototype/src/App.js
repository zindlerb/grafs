import classnames from 'classnames'
import _ from 'lodash'
import $ from 'jquery'
import dragManager from './drag_manager.js'
import React, { Component } from 'react';
import './App.css';
import { Graph } from './graph_lib.js'
import stateManager from './utilities/state_manager.js'
import {Pos} from './data_types.js'
import Renderer from './components/Renderer.js'

import {isPointWithinRect, getRectMidpoint} from './utilities/general.js'

window.isDebugMode = false

class App extends Component {
  constructor() {
    super()
    this.state = stateManager.state
  }

  componentDidMount() {
    stateManager.registerStateCallback((state) => this.setState(state))
  }

  render() {
    return (
      <div className="App w-100 h-100">
        <Renderer {...this.state} />
      </div>
    );
  }
}

export default App;
