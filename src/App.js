import React, { Component } from 'react';
import './App.css';
import Circle from './Circle.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delays: [0, 200, 400],
      progressStep: 0.085
    }
  }

  render() {
    return (
      <div>
        <Circle
          color="red"
          delay={this.state.delays[0]}
          progressStep={this.state.progressStep}
        />
        <Circle
          color="blue"
          delay={this.state.delays[1]}
          progressStep={this.state.progressStep}
        />
        <Circle
          color="green"
          delay={this.state.delays[2]}
          progressStep={this.state.progressStep}
        />
      </div>
    );
  }
}

export default App;
