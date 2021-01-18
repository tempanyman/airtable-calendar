import React from 'react';
import ReactDOM from 'react-dom';
import './event_bar.css';

export default class EventBar extends React.Component {
  state = {
    width: this.props.numPixelsPerDay * this.props.span
  }
  node;
  height;
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.height = this.node.clientHeight;
    this.props.updateRowHeights(this.height, this.props.index);
  }

  componentDidUpdate(prevProps) {
    if(this.props.numPixelsPerDay !== prevProps.numPixelsPerDay) {
      this.setState({
        width: this.props.numPixelsPerDay * this.props.span
      });
    }

    if (this.node.clientHeight !== this.height) {
      // invoke callback
      this.height = this.node.clientHeight;
      this.props.updateRowHeights(this.height, this.props.index);
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