import React from 'react';
import moment from 'moment';
import './timeline_view.css';
import EventBar from './eventBar';

export default class TimelineView extends React.Component {
  constructor(props) {
    super(props);
    this.numPixelsPerDay = props.width || 100;
    this.timelineItems = props.timelineItems;
    // sort timeline items 
    this.timelineSortedByStart = [...this.timelineItems];
    this.timelineSortedByStart.sort((item1, item2) => item1.start.diff(item2.start));
    this.timelineStartDate = this.timelineSortedByStart[0].start;
    /////////////////
    this.timelineSortedByEndDescending = [...this.timelineItems];
    this.timelineSortedByEndDescending.sort((item1, item2) => item2.end.diff(item1.end));
    this.timelineEndDate = this.timelineSortedByEndDescending[0].end;
  }

  // most space-efficient way to group bars. //

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

  // given array of items, create bars.
  getBars = (timelineItems) => {
    return timelineItems.map((item) => {
      let pixels = this.getDaysFromStart(item.start) * this.numPixelsPerDay;
      let days = this.getDaysFromStart(item.start) * this;
      return (
        <div className="event" 
             style={{left: pixels}}>
               <EventBar numPixelsPerDay={this.numPixelsPerDay}
                         span={item.span}
                         itemName={item.name}/>
        </div>
      );
    });
  }
    

  getDaysFromStart = (date) => date.diff(this.timelineStartDate, 'days');
  
  render() {
    console.log(rowsArray);
    // create date markers.
    let dateToWrite = moment(Object.assign({}, this.timelineStartDate));
    let tics = [];
    let leftPixels = 0;
    let monthToWrite = -1;
    while (dateToWrite.isBetween(this.timelineStartDate, this.timelineEndDate, undefined, '[]')) {
      if (dateToWrite.format("M") !== monthToWrite) {
        tics.push(
          <div className="tic"
          style={{left: leftPixels, width: this.numPixelsPerDay}}>
                 {dateToWrite.format("MMM D")}
          </div>
        );
        monthToWrite = dateToWrite.format("M");
      } else {
        tics.push(
          <div className="tic"
          style={{left: leftPixels, width: this.numPixelsPerDay}}>
                 {dateToWrite.format("D")}
          </div>
        );
      }
      leftPixels += this.numPixelsPerDay;
      dateToWrite = moment(dateToWrite).add(1, "days");
    }
    // create rows.
    let rowsArray = this.getRows();
    let runs = rowsArray.map((row, i) => {
      let bgc = i % 2 === 0 ? "#ffffff" : "#9999997e";
      return (
      <div 
                className="row"
                style={{gridRowStart: i+1, backgroundColor: bgc}}
              >
                {this.getBars(row)}
              </div>)
    }
    );
    
    return (
      <div className="timeline">
        {tics}
        {runs}
      </div>
    );
  }
  
}