import React from 'react';
import moment from 'moment';
import './timeline_view.css';
import EventBar from './eventBar';

export default class TimelineView extends React.Component {
  state = {
    rowHeights: this.props.timelineItems.map(x => 0),
    numPixelsPerDay: this.props.width || 100
  }
  constructor(props) {
    super(props);
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

  componentDidMount() {
    let heights = this.state.rowHeights.map((h, index) => {
      let idName = "#eventInRow" + index;
      const nodeArr = [...document.querySelectorAll(idName)];
      return Math.max.apply(Math, nodeArr.map((node) => node.clientHeight));
    });
    this.setState({
      rowHeights: heights
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let heights = this.state.rowHeights.map((h, index) => {
      let idName = "#eventInRow" + index;
      let nodeArr = [...document.querySelectorAll(idName)];
      console.log("noderr = ", nodeArr);
      let nodeaddlist = nodeArr.map((n) => n.clientHeight);
      console.log("noderrlist = ", nodeaddlist);
      let nodeArrMax = Math.max.apply(Math, nodeArr.map((node) => node.clientHeight));
      return Math.max.apply(Math, nodeArr.map((node) => node.clientHeight));
    });
    console.log("old rowheights: " + this.state.rowHeights);
    console.log("new heights: " + heights);
    if (JSON.stringify(this.state.rowHeights) !== JSON.stringify(heights)) {
      console.log("updating!")
      this.setState({
        rowHeights: heights
      });
      //this.forceUpdate();
    }
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
  getBars = (timelineItems, rowIndex) => {
    return timelineItems.map((item) => {
      let pixels = this.getDaysFromStart(item.start) * this.state.numPixelsPerDay;
      return (
        <div className="event"
             id={"eventInRow" + rowIndex} 
             style={{left: pixels}}>
               <EventBar numPixelsPerDay={this.state.numPixelsPerDay}
                         span={item.span}
                         itemName={item.name}/>
        </div>
      );
    });
  }
    
  // onclick event for zoom.
  zoomIn = () => {
    console.log("clicked zoomin");
    const newDayPixels = this.state.numPixelsPerDay + 10;
    if (newDayPixels <= 200) {
      this.setState({
        numPixelsPerDay: newDayPixels
      });
    }
  }
  zoomOut = () => {
    console.log("clicked zoomout ");
    const newDayPixels = this.state.numPixelsPerDay - 10;
    if (newDayPixels >= 20) {
      this.setState({
        numPixelsPerDay: newDayPixels
      });
    }
  }
  getDaysFromStart = (date) => date.diff(this.timelineStartDate, 'days');
  
  render() {
    console.log("rendering");
    // create date markers.
    let dateToWrite = moment(Object.assign({}, this.timelineStartDate));
    let tics = [];
    let leftPixels = 0;
    let monthToWrite = -1;
    while (dateToWrite.isBetween(this.timelineStartDate, this.timelineEndDate, undefined, '[]')) {
      if (dateToWrite.format("M") !== monthToWrite) {
        tics.push(
          <div className="tic"
          style={{left: leftPixels, width: this.state.numPixelsPerDay}}>
                 {dateToWrite.format("MMM D")}
          </div>
        );
        monthToWrite = dateToWrite.format("M");
      } else {
        tics.push(
          <div className="tic"
          style={{left: leftPixels, width: this.state.numPixelsPerDay}}>
                 {dateToWrite.format("D")}
          </div>
        );
      }
      leftPixels += this.state.numPixelsPerDay;
      dateToWrite = moment(dateToWrite).add(1, "days");
    }
    // create rows.
    let rowsArray = this.getRows();
    let runs = rowsArray.map((row, i) => {
      let bgc = i % 2 === 0 ? "#ffffff" : "#9999997e";
      return (
      <div 
        className="row"
        style={{
          gridRowStart: i+1, 
          backgroundColor: bgc, 
          height: this.state.rowHeights[i],
          width: leftPixels}}
      >
        {this.getBars(row, i)}
      </div>)
    }
    );
    
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