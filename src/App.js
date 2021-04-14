import React from 'react';
import { Router } from '@reach/router';

import Preparation from './components/Preparation';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Preparation path="/" />
      </Router>
    </div>
  );
}

export default App;
