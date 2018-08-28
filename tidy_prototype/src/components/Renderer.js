import React, { Component } from 'react';
import TextBox from './TextBox.js'
import {Pos} from '../data_types.js'

export default class Renderer extends Component {
  render() {
    return (
      <svg className="renderer w-100 h-100 db">
        <TextBox pos={new Pos(100, 100)} padding={10} text="Hi boi"/>
      </svg>
    )
  }
}
