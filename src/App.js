import './App.css';
import { useState } from 'react';

import ReactCompass from './ReactCompass';

function App() {
  const [rangeVal, setRangeVal] = useState(0);

  return (
    <div className="App">
      <ReactCompass direction={rangeVal}/>
      <input type="range" max="360" min="0"
          onChange={(e) => setRangeVal(parseInt(e.target.value, 10))} onInput={(e) => setRangeVal(parseInt(e.target.value, 10))}/>
    </div>
  );
}

export default App;
