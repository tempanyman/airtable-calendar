import React from 'react';
import './event_bar.css';

export default class EventBar extends React.Component {
  state = {
    width: this.props.numPixelsPerDay * this.props.span
  }
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if(this.props.numPixelsPerDay !== prevProps.numPixelsPerDay) {
      this.setState({
        width: this.props.numPixelsPerDay * this.props.span
      });
    }
  }

  render() {
    return (
      <div className="bar" style={{width: this.state.width, maxWidth: this.state.width}}>
        {this.props.itemName}
      </div>
    );
  }
}