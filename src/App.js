import React, { Component } from 'react';
import './App.css';
import Circle from './Circle.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delays: [0, 0.4, 0.8],
      progressStep: 0.05,
      color: "#666666",
      playAnimation: false,
      singleRun: false,
    }
  }

  startAnimation = () => {
    this.setState({
      playAnimation: true
    })
  }

  stopAnimation = () => {
    this.setState({
      playAnimation: false
    })
  }

  startRecordSingleRun = () => {
    this.stopAnimation()
    this.setState({
      singleRun: true
    }, () => {
      this.startAnimation();
    })
  }

  onSingleRunDone = () => {
    this.stopRecording();
    this.setState({
      singleRun: false
    }, () => {
    })
  }

  render() {
    return (
      <div>
        <button
          onClick={this.startAnimation}
        >
          Start
        </button>
        <button
          onClick={this.stopAnimation}
        >
          Pause
        </button>
        <button
          onClick={this.startRecordSingleRun}
        >
          Single run
        </button>
        <div>
          <Circle
            color={this.state.color}
            delays={this.state.delays}
            progressStep={this.state.progressStep}
            playAnimation={this.state.playAnimation}
            singleRun={this.state.singleRun}
            onSingleRunDone={this.onSingleRunDone}
          />
        </div>
      </div>
    );
  }
}

export default App;
