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
        <div ref={this.renderSpaceRef}>
          <Circle
            ref={this.circleRefs[0]}
            color={this.state.color}
            delay={this.state.delays[0]}
            progressStep={this.state.progressStep}
            playAnimation={this.state.playAnimation}
          />
          <Circle
            ref={this.circleRefs[1]}
            color={this.state.color}
            delay={this.state.delays[1]}
            progressStep={this.state.progressStep}
            playAnimation={this.state.playAnimation}
          />
          <Circle
            ref={this.circleRefs[2]}
            color={this.state.color}
            delay={this.state.delays[2]}
            progressStep={this.state.progressStep}
            playAnimation={this.state.playAnimation}
          />
        </div>
      </div>
    );
  }
}

export default App;
