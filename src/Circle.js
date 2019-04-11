import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import BezierEasing from 'bezier-easing';

class Circle extends Component {
  static propTypes = {
    color: PropTypes.string,
    delay: PropTypes.number,
    progressStep: PropTypes.number,
    playAnimation: PropTypes.bool,
    singleRun: PropTypes.bool
  }

  static defaultProps = {
    color: 'grey',
    delay: 0,
    progressStep: 0.05,
    playAnimation: false,
    singleRun: false
  }

  constructor(props) {
    super(props)
    this.canvasRef = React.createRef();
    this.easing = BezierEasing(0.785, 0.135, 0.15, 0.86);
    const width = 132;
    const height = width / 3.5;
    //const canvas = document.getElementById('myCanvas');
    const canvas = this.canvasRef.current;
    const radius = width / 7;
    const centerX = radius

    this.state = {
      alpha: 0,
      alphaIncrease: true,
      progressStep: 0.05,
      alphaProgress: 0,
      radius,
      centerX,
      alphaCycleDelay: 50,
      alphaCycleRetryDelay: 200,
      firstTime: true,
      pauseTimeout: null
    }

    this.alphaCycleStarter()
  }

  fillColor() {
    let context = this.canvasRef.current.getContext('2d');
    if(context.imageSmoothingEnabled !== true) {
      context.imageSmoothingEnabled = true;
    }
    const centerY = this.canvasRef.current.height / 2;

    context.clearRect (0, 0, 300, 300);

    context.beginPath();
    context.globalAlpha = this.state.alpha;
    context.arc(this.state.centerX, centerY, this.state.radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.props.color;
    context.fill();
  }

  alphaCycle(delay) {
    setTimeout(() => {
      let localProgress = this.state.alphaProgress;
      let increase = this.state.alphaIncrease;
      if(localProgress <= 0) {
        increase = true
      } else if (localProgress >= 1 && !this.props.singleRun){
        increase = false
      }
      localProgress = increase ? localProgress + this.props.progressStep : localProgress - this.props.progressStep;
      const localAlpha = this.easing(localProgress);
      this.setState({
        alpha: localAlpha, alphaIncrease: increase, alphaProgress: localProgress
      }, () => {
        if(this.props.playAnimation) {
          this.fillColor()
          console.log("Alpha: " + localAlpha)
          console.log("Progress: " + localProgress)
          this.alphaCycle();
        } else {
          this.alphaCycleStarter();
        }
      })
    }, delay ? delay : this.state.alphaCycleDelay)
  }

  alphaCycleStarter() {
    if(this.props.playAnimation && this.canvasRef.current !== null) {
      if(this.state.firstTime) {
        this.setState({
          firstTime: false
        }, () => {
          this.alphaCycle(this.props.delay)
        })
      } else {
        this.alphaCycle()
      }
    } else {
      setTimeout(() => this.alphaCycleStarter(), this.state.alphaCycleRetryDelay)
    }
  }

  resetAnimation() {
    this.setState({
      alpha: 0,
      alphaProgress: 0,
      firstTime: true
    }, () => {
      this.fillColor()
    })
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        width={this.state.radius * 2.15}
        height={this.state.radius * 2.15}
      />
    );
  }
}

export default Circle;
