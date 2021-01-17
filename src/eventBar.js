import React from 'react';
import './event_bar.css';

export default class EventBar extends React.Component {
  constructor(props) {
    super(props);
    this.width = props.numPixelsPerDay * props.span;
  }

  render() {
    return (
      <div className="bar" style={{width: this.width, maxWidth: this.width}}>
        {this.props.itemName}
      </div>
    );
  }
}