import Radium, { Style } from 'radium';
import React, { Component } from 'react';
var color = require('color');

class Article extends Component {
  state = {
    specificBackgroundColor: 'rgba(0,0,0,0)'
  };

  render() {
    return (
      <div
        key={'article' + this.props.index}
        className={'article'}
        onMouseEnter={event => {
          let newColor =
            'rgba(' +
            this.props.activeColor[0] +
            ',' +
            this.props.activeColor[1] +
            ',' +
            this.props.activeColor[2] +
            ',' +
            0.5 +
            ')';
          console.log(newColor);
          this.setState({ specificBackgroundColor: newColor });
        }}
        style={{ backgroundColor: this.state.specificBackgroundColor }}
        onMouseLeave={event => {
          console.log('out hover');
          this.setState({ specificBackgroundColor: 'rgba(0,0,0,0)' });
        }}
        onClick={() => window.open(this.props.link, '_blank')}>
        <h4>{this.props.title}</h4>
        <p>{this.props.description}</p>
      </div>
    );
  }
}

export default Article;
