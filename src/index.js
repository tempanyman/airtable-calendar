import React, {useState, useEffect} from 'react';
import { render } from 'react-dom';
import timelineItems from './timelineItems';
import TimelineView from './timelineView';
import './index.css';

function App() {
  return (
    <div>
      <TimelineView 
        timelineItems={timelineItems}
        width={50}/>
    </div>
  );
};

render(<App className="App"/>, document.getElementById('root'));
