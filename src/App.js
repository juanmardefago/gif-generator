import React, { Component } from 'react';
import './App.css';
import Circle from './Circle.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.renderSpaceRef = React.createRef();
    this.circleRefs = [];
    this.circleRefs.push(React.createRef())
    this.circleRefs.push(React.createRef())
    this.circleRefs.push(React.createRef())
    this.state = {
      delays: [0, 200, 400],
      progressStep: 0.085,
      color: "blue",
      playAnimation: false,
      singleRun: false,
      recording: false,
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

  resetAnimation = () => {
    this.stopAnimation()
    this.circleRefs[0].current.resetAnimation()
    this.circleRefs[1].current.resetAnimation()
    this.circleRefs[2].current.resetAnimation()
  }

  startRecordSingleRun = () => {
    this.stopAnimation()
    this.setState({
      singleRun: true
    }, () => {
      this.startRecording();
    })
  }

  startRecording = () => {
    this.resetAnimation()
    this.setState({
      recording: true
    }, () => {
      this.startAnimation();
    })
  }

  stopRecording = () => {
    this.stopAnimation()
    this.setState({
      recording: false
    }, () => {

    })
  }

  onSingleRunDone = () => {
    this.stopRecording();
    this.setState({
      singleRun: false
    }, () => {
      this.resetAnimation()
    })
  }

  handleChange = (event) => {
    this.setState({
      color: event.target.value
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
          onClick={this.resetAnimation}
        >
          Reset
        </button>
        <button
          onClick={this.startRecordSingleRun}
        >
          Single run record
        </button>
        { !this.state.recording &&
          <button
            onClick={this.startRecording}
          >
            Start recording
          </button>
        }
        { this.state.recording &&
          <button
            onClick={this.stopRecording}
          >
            Stop Recording
          </button>
        }
        <br/>
        <input type="text" value={this.state.color} onChange={this.handleChange} />
        <br/>
        <div ref={this.renderSpaceRef}>
          <Circle
            ref={this.circleRefs[0]}
            color={this.state.color}
            delay={this.state.delays[0]}
            progressStep={this.state.progressStep}
            playAnimation={this.state.playAnimation}
            singleRun={this.state.singleRun}
          />
          <Circle
            ref={this.circleRefs[1]}
            color={this.state.color}
            delay={this.state.delays[1]}
            progressStep={this.state.progressStep}
            playAnimation={this.state.playAnimation}
            singleRun={this.state.singleRun}
          />
          <Circle
            ref={this.circleRefs[2]}
            color={this.state.color}
            delay={this.state.delays[2]}
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
