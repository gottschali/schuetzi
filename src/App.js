import './App.css';
import { useState, useEffect } from 'react';

import ReactCompass from './ReactCompass';

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
  const [coords, setCoords] = useState();
  const [heading, setHeading] = useState(0); // heading north to the compass
  const [schutzDirection, setSchutzDirection] = useState(0);

  useEffect( () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        setCoords(position.coords);
        setHeading(position.coords.heading);
        setSchutzDirection(toDegrees(bearing(Schutzi, position.coords)));
      });
    }
  }, []);

  useEffect( () => {
    window.addEventListener("deviceorientation", (event) => {
      var absolute = event.absolute;
      var alpha    = event.alpha;
      var beta     = event.beta;
      var gamma    = event.gamma;
      setHeading(alpha);
    }, true);
  });

  return (
    <div className="App">
      { coords !== undefined ?
        <div>
          <ReactCompass direction={heading} marker={(-heading + schutzDirection) % 360} />
          <input type="range" max="360" min="0" value={schutzDirection}
                 onChange={(e) => setSchutzDirection(parseInt(e.target.value, 10))}
                 onInput={(e) => setSchutzDirection(parseInt(e.target.value, 10))}/>
          <input type="range" max="360" min="0" value={heading}
                 onChange={(e) => setHeading(parseInt(e.target.value, 10))}
                 onInput={(e) => setHeading(parseInt(e.target.value, 10))}/>
          <div>
            <div> Latitude: {coords.latitude}</div>
            <div> Longitude: {coords.longitude}</div>
            <div> Accuracy: {coords.accuracy}</div>
            <div> SchütziDirection: {schutzDirection}</div>
          </div>
        </div> : <div> Please enable geolocation!</div>
      }
    </div>
  );
}

export default App;
