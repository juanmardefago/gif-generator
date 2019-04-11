import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import BezierEasing from 'bezier-easing';

class Circle extends Component {
  static propTypes = {
    color: PropTypes.string,
    delay: PropTypes.number,
    progressStep: PropTypes.number
  }

  static defaultProps = {
    color: 'grey',
    delay: 0,
    progressStep: 0.05
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
      width,
      height,
      radius,
      centerX,
      alphaCycleDelay: 50,
      alphaCycleRetryDelay: 200
    }

    setTimeout(() => this.alphaCycle(), this.props.delay)
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

  alphaCycle() {
    if(this.canvasRef.current !== null) {
      setTimeout(() => {
        let localProgress = this.state.alphaProgress;
        let increase = this.state.alphaIncrease;
        if(localProgress <= 0) {
          increase = true
        } else if (localProgress >= 1){
          increase = false
        }
        localProgress = increase ? localProgress + this.props.progressStep : localProgress - this.props.progressStep;
        const localAlpha = this.easing(localProgress);
        this.setState({
          alpha: localAlpha, alphaIncrease: increase, alphaProgress: localProgress
        }, () => {
          this.fillColor()
          console.log("Alpha: " + localAlpha)
          console.log("Progress: " + localProgress)
          this.alphaCycle();
        })
      }, this.state.alphaCycleDelay)
    } else {
      setTimeout(() => this.alphaCycle(), this.state.alphaCycleRetryDelay)
    }
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
