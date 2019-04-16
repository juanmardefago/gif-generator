import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import BezierEasing from 'bezier-easing';
import GIFEncoder from 'gifencoder';
import { save } from 'save-file'


class Circle extends Component {
  static propTypes = {
    color: PropTypes.string,
    delays: PropTypes.arrayOf(PropTypes.number),
    progressStep: PropTypes.number,
    playAnimation: PropTypes.bool,
    singleRun: PropTypes.bool,
    onSingleRunDone: PropTypes.func
  }

  static defaultProps = {
    color: '#666666',
    delays: [0, 0, 0],
    progressStep: 0.05,
    playAnimation: false,
    singleRun: false,
    onSingleRunDone: () => {}
  }

  constructor(props) {
    super(props)

    this.canvasRef = React.createRef();
    this.easing = BezierEasing(0.785, 0.135, 0.15, 0.86);
    const width = 132;
    const height = width / 3.5;
    const canvas = this.canvasRef.current;
    const radius = width / 7;
    const centerX = [
    	{ x: radius, index: 0 },
      { x: radius * 3 + radius / 2, index: 1 },
      { x: radius * 6, index: 2 }
    ];

    let alphaProgress = [
      1 - this.props.delays[0],
      1 - this.props.delays[1],
      1 - this.props.delays[2]
    ];

    let alpha = [
      this.easing(alphaProgress[0]),
      this.easing(alphaProgress[1]),
      this.easing(alphaProgress[2])
    ]

    this.state = {
      alpha,
      alphaIncrease: [true, true, true],
      progressStep: 0.05,
      alphaProgress,
      radius,
      centerX,
      alphaCycleDelay: 35,
      alphaCycleRetryDelay: 100,
      firstTime: true,
      singleRunHalfDone: [
        false,
        false,
        false
      ],
      singleRunFinished: [
        false,
        false,
        false
      ]
    }
    this.encoder = new GIFEncoder(this.state.radius * 2.4 * 3, this.state.radius * 2.15)
    this.encoder.start();
    this.encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    this.encoder.setDelay(35);  // frame delay in ms
    this.encoder.setQuality(10); // image quality. 10 is default.
    this.alphaCycleStarter()
  }

  fillColor() {
    let context = this.canvasRef.current.getContext('2d');
    if(context.imageSmoothingEnabled !== true) {
      context.imageSmoothingEnabled = true;
    }
    const centerY = this.canvasRef.current.height / 2;

    this.state.centerX.forEach(element => {
      context.clearRect (element.x - this.state.radius, 0, 300, 300);
      context.beginPath();
      context.globalAlpha = this.state.alpha[element.index];
      context.arc(element.x, centerY, this.state.radius, 0, 2 * Math.PI, false);
      context.fillStyle = this.props.color;
      context.fill();
      context.save();
    })
    if(this.props.singleRun && !this.state.singleRunFinished[0]) {
      console.log("add frame")
      this.encoder.addFrame(context)
    }
  }

  calculateModificationsFor(index) {
    let localProgress = this.state.alphaProgress[index];
    let increase = this.state.alphaIncrease[index];
    let singleRunHalfDone = this.state.singleRunHalfDone[index];
    let singleRunFinished = this.state.singleRunFinished[index];

    if(localProgress <= 0) {
      increase = true
      if(this.props.singleRun && !this.state.singleRunHalfDone[0]) {
        singleRunHalfDone = true;
      }
    } else if (localProgress >= 1){
      increase = false

      if(this.props.singleRun && this.state.singleRunHalfDone[0] && !this.state.singleRunFinished[0]) {
        singleRunFinished = true;
        const buf = this.encoder.out.getData();
        save('myanimated.gif', buf)
        this.props.onSingleRunDone();
      }
    }
    localProgress = increase ? localProgress + this.props.progressStep : localProgress - this.props.progressStep;
    const localAlpha = localProgress < 0 ? 0 : this.easing(localProgress);
    return {
      alpha: localAlpha,
      alphaIncrease: increase,
      alphaProgress: localProgress,
      singleRunHalfDone,
      singleRunFinished,
    }
  }

  alphaCycle() {
    setTimeout(() => {
      let modifications = [];
      modifications.push(this.calculateModificationsFor(0))
      modifications.push(this.calculateModificationsFor(1))
      modifications.push(this.calculateModificationsFor(2))

      this.setState({
        alpha: [
          modifications[0].alpha,
          modifications[1].alpha,
          modifications[2].alpha
        ],
        alphaIncrease: [
          modifications[0].alphaIncrease,
          modifications[1].alphaIncrease,
          modifications[2].alphaIncrease
        ],
        alphaProgress: [
          modifications[0].alphaProgress,
          modifications[1].alphaProgress,
          modifications[2].alphaProgress
        ],
        singleRunHalfDone: [
          modifications[0].singleRunHalfDone,
          modifications[1].singleRunHalfDone,
          modifications[2].singleRunHalfDone
        ],
        singleRunFinished: [
          modifications[0].singleRunFinished,
          modifications[1].singleRunFinished,
          modifications[2].singleRunFinished
        ],
      }, () => {

        if(this.props.playAnimation && !this.state.singleRunFinished[0]) {
          this.fillColor()
          this.alphaCycle();
        } else {
          this.alphaCycleStarter();
        }
      })
    }, this.state.alphaCycleDelay)
  }

  alphaCycleStarter() {
    if(this.props.playAnimation && this.canvasRef.current !== null && !this.state.singleRunFinished[0]) {
      this.alphaCycle()
    } else {
      setTimeout(() => this.alphaCycleStarter(), this.state.alphaCycleRetryDelay)
    }
  }

  resetAnimation() {
    let alphaProgress = [
      1 - this.props.delays[0],
      1 - this.props.delays[1],
      1 - this.props.delays[2]
    ];

    let alpha = [
      this.easing(alphaProgress[0]),
      this.easing(alphaProgress[1]),
      this.easing(alphaProgress[2])
    ]
    this.setState({
      alpha,
      alphaProgress,
      firstTime: true,
      singleRunHalfDone: [
        false,
        false,
        false
      ],
      singleRunFinished: [
        false,
        false,
        false
      ]
    }, () => {
      this.fillColor()
    })
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        width={this.state.radius * 2.4 * 3}
        height={this.state.radius * 2.15}
      />
    );
  }
}

export default Circle;
