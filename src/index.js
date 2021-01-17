import React, {useState, useEffect} from 'react';
import { render } from 'react-dom';
import timelineItems from './timelineItems';
import moment from 'moment';
import Calendar from './components/Calendar/index';
import TimelineView from './timelineView';
import './index.css';

const onDayClick = (e, day) => {
  // show full thingy!!
}

function App() {
  const parseTimelineItems = timelineItems.map((item) => {
    return ({
      id: item.id,
      start: moment(item.start, "YYYY-MM-DD"),
      end: moment(item.end, "YYYY-MM-DD"),
      span: moment(item.end, "YYYY-MM-DD").diff(moment(item.start, "YYYY-MM-DD"), 'days') + 1,
      name: item.name
    });
  });
  return (
    <div>
      <TimelineView 
        timelineItems={parseTimelineItems}
        width={50}/>
    </div>
  );
};

render(<App className="App"/>, document.getElementById('root'));
