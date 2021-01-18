import React, {useState, useEffect} from 'react';
import { render } from 'react-dom';
import TimelineView from './timelineView';
import './index.css';

function App() {
  return (
    <div>
      <TimelineView
        width={75}/>
    </div>
  );
};

render(<App className="App"/>, document.getElementById('root'));
