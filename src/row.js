import React from 'react';
import './row.css';
import moment from 'moment';
import EventBar from './eventBar';

export default class Row extends React.Component {
  /* necessary props:
  timelineItems: list of events that will go in the row 
  numPixelsPerDay
  rowIndex
  startDate: start date of the timeline.
   */

  constructor(props) {
    super(props);
    this.startDate = this.props.startDate || moment();
    /* due to the asynchronous nature of updating state, and since rowheights and maxheight 
    are updated in a callback mathod, we save these as local variables, not as state variables. */

    this.rowHeights = this.props.timelineItems.map(x => 0);
    this.maxHeight = 0;
  }

  componentDidMount() {
    this.maxHeight = Math.max(...this.rowHeights);
  }

  updateRowHeights (height, index) {
    this.rowHeights[index] = height;
    let newHeight = Math.max(...this.rowHeights);
    if (this.maxHeight !== newHeight) {
      this.maxHeight =  newHeight;
      // we force an update after every change to maxHeight.
      this.forceUpdate();
    }
  }

  getDaysFromStart = (date) => date.diff(this.startDate, 'days');

  getBars = () => {
    return (
      this.props.timelineItems.map((item, barIndex) => {
        let pixels = this.getDaysFromStart(item.start) * this.props.numPixelsPerDay;
        return (
          <div className="event"
              id={"eventInRow" + this.props.rowIndex} 
              style={{left: pixels}}
              >
                <EventBar numPixelsPerDay={this.props.numPixelsPerDay}
                          span={item.span}
                          itemName={item.name}
                          index={barIndex}
                          updateRowHeights={(r, i) => this.updateRowHeights(r, i)}/>
          </div>
        );
      })
    );
  }

  render() {
    let bars = this.getBars();
    return(
      <div style={{height: this.maxHeight}}>
        {bars}
      </div>
    );
  }
}