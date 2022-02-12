import './App.css';
import { useState, useEffect } from 'react';

import ReactCompass from './ReactCompass';

function heading(c1, c2) {
  const la1 = c1.latitude;
  const lo1 = c1.longitude;
  const la2 = c2.latitude;
  const lo2 = c2.longitude;
  return Math.atan2(Math.cos(la1) * Math.sin(la2) - Math.sin(la2) * Math.cos(la2) * Math.cos(lo2 - lo1)
                    , Math.sin(lo2 - lo1) * Math.cos(la2));
}
function bearing(c1, c2) {
  /*
   * Δφ = ln( tan( latB / 2 + π / 4 ) / tan( latA / 2 + π / 4) )
   * Δlon = abs( lonA - lonB )
   * bearing :  θ = atan2( Δlon ,  Δφ )
   */
  const latA = c1.latitude;
  const lonA = c1.longitude;
  const latB = c2.latitude;
  const lonB = c2.longitude;
  const deltaPhi = Math.log(Math.tan(latB / 2 + Math.PI / 4) / Math.tan(latA / 2 + Math.PI / 4));
  const deltaLon = Math.abs(lonA - lonB);
  return Math.atan2(deltaLon, deltaPhi);
}

function toDegrees(radians) {
  return (radians / Math.PI * 180 + 360) % 360;
}

class Coordinate {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

const schutziLat = 47.50077;
const schutziLong = 8.71749;
const Schutzi = new Coordinate(schutziLat, schutziLong);

function App() {
  const [rangeVal, setRangeVal] = useState(0);
  const [coords, setCoords] = useState();

  useEffect( () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => setCoords(position.coords));
    }
  }, []);

  // the marker should mark the Schützi toDegrees(bearing(coords, Schutzi)) from geolocations
  return (
    <div className="App">
      <ReactCompass direction={0} marker={coords === undefined || coords.heading === null ? rangeVal : coords.heading}/>
      <input type="range" max="360" min="0"
          onChange={(e) => setRangeVal(parseInt(e.target.value, 10))} onInput={(e) => setRangeVal(parseInt(e.target.value, 10))}/>
      { coords !== undefined ? <div>
                        <div> Latitude: {coords.latitude}</div>
                        <div> Longitude: {coords.longitude}</div>
                      <div>  Accuracy: {coords.accuracy}</div>
                      <div>  Heading: {toDegrees(bearing(Schutzi, coords))}</div>

                                 </div> : <div> Please enable geolocation!</div>
      }
    </div>
  );
}

export default App;
