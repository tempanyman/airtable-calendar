import React from 'react';
import moment from 'moment';
import './timeline_view.css';
import Row from './row';

export default class TimelineView extends React.Component {
  state = {
    numPixelsPerDay: this.props.width || 100
  }
  constructor(props) {
    super(props);
    this.timelineItems = props.timelineItems.map((item) => {
      return ({
        id: item.id,
        start: moment(item.start, "YYYY-MM-DD"),
        end: moment(item.end, "YYYY-MM-DD"),
        span: moment(item.end, "YYYY-MM-DD").diff(moment(item.start, "YYYY-MM-DD"), 'days') + 1,
        name: item.name
      });
    });
    // sort timeline items by start date, ascending.
    this.timelineSortedByStart = [...this.timelineItems];
    this.timelineSortedByStart.sort((item1, item2) => item1.start.diff(item2.start));
    this.timelineStartDate = this.timelineSortedByStart[0].start;
    // sort timeline items by end date, descending.
    this.timelineSortedByEndDescending = [...this.timelineItems];
    this.timelineSortedByEndDescending.sort((item1, item2) => item2.end.diff(item1.end));
    this.timelineEndDate = this.timelineSortedByEndDescending[0].end;
  }

  /////////// most space-efficient way to group bars. ///////////
  // helper method
  // since items are sorted by start time, item is compatable with row iff row[-1].endTime <= item.startTime.
  getFirstCompatibleRowIndex = (rowsArray, item) => {
    for(let index = 0; index < rowsArray.length; index++) {
      let lastIndex = rowsArray[index].length - 1;
      if (rowsArray[index][lastIndex].end.isBefore(item.start) || 
          rowsArray[index][lastIndex].end.isSame(item.start)) {
        return index;
      }
    }
    return -1;
  }
  getRows = () => {
    let rowsArray = [];
    this.timelineSortedByStart.forEach(item => {
      // check if item is compatible with row (ie check item overlap).
      let compatibleRowIndex = this.getFirstCompatibleRowIndex(rowsArray, item);
      if (compatibleRowIndex === -1) {
        rowsArray.push([item]);
      } else {
        rowsArray[compatibleRowIndex].push(item);
      }
    });
    return rowsArray;
  }
  /////////////////////////////////////////////////////////////

  ///////// onclick events for zoom. /////////
  zoomIn = () => {
    const newDayPixels = this.state.numPixelsPerDay + 10;
    if (newDayPixels <= 200) {
      this.setState({
        numPixelsPerDay: newDayPixels
      });
    }
  }
  zoomOut = () => {
    const newDayPixels = this.state.numPixelsPerDay - 10;
    if (newDayPixels >= 20) {
      this.setState({
        numPixelsPerDay: newDayPixels
      });
    }
  }
  ////////////////////////////////////////////

  render() {
    const numPixelsPerDay = this.state.numPixelsPerDay;
    ///////// create date markers. /////////
    let dateToWrite = moment(Object.assign({}, this.timelineStartDate));
    let tics = [];
    let leftPixels = 0;
    let monthToWrite = -1;
    while (dateToWrite.isBetween(this.timelineStartDate, this.timelineEndDate, undefined, '[]')) {
      if (dateToWrite.format("M") !== monthToWrite) {
        tics.push(
          <div className="tic"
          style={{left: leftPixels, width: numPixelsPerDay}}>
                 {dateToWrite.format("MMM D")}
          </div>
        );
        monthToWrite = dateToWrite.format("M");
      } else {
        tics.push(
          <div className="tic"
          style={{left: leftPixels, width: numPixelsPerDay}}>
                 {dateToWrite.format("D")}
          </div>
        );
      }
      leftPixels += numPixelsPerDay;
      dateToWrite = moment(dateToWrite).add(1, "days");
    }
    ////////////////////////////////////

    /////////// create rows. ///////////
    let rowsArray = this.getRows();
    let runs = rowsArray.map((row, i) => {
      let bgc = i % 2 === 0 ? "#ffffff" : "#9999997e";
      return (
      <div 
        className="row"
        style={{
          gridRowStart: i+1, 
          backgroundColor: bgc, 
          width: leftPixels}}
      >
        {
        <Row 
          timelineItems = {row}
          numPixelsPerDay = {numPixelsPerDay}
          rowIndex = {i}
          startDate = {this.timelineStartDate}
        />
        }
      </div>)
    }
    );
    ////////////////////////////////////

    return (
      <div className="timeline">
        {tics}
        {runs}
        <div className="zooming">
          <span className="zoom-in" onClick={this.zoomIn}>ZOOM IN</span>
          <span className="zoom-out" onClick={this.zoomOut}>ZOOM OUT</span>
        </div>
      </div>
    );
  }
}