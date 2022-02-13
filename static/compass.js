const compassCircle = document.querySelector(".compass-circle");
const myPoint = document.querySelector(".my-point");
const isIOS =
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
      navigator.userAgent.match(/AppleWebKit/);

function init() {
  navigator.geolocation.getCurrentPosition(locationHandler);

  if (!isIOS) {
    window.addEventListener("deviceorientationabsolute", handler, true);
  }
  startCompass();
}

function startCompass() {
  if (isIOS) {
    DeviceOrientationEvent.requestPermission()
                          .then((response) => {
                            if (response === "granted") {
                              window.addEventListener("deviceorientation", handler, true);
                            } else {
                              alert("has to be allowed!");
                            }
                          })
                          .catch(() => alert("not supported"));
  } else {
    window.addEventListener("deviceorientationabsolute", handler, true);
  }
}

function handler(e) {
  compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

  // ±15 degree
  if (
    (pointDegree < Math.abs(compass) &&
     pointDegree + 15 > Math.abs(compass)) ||
      pointDegree > Math.abs(compass + 15) ||
      pointDegree < Math.abs(compass)
  ) {
    myPoint.style.opacity = 0;
  } else if (pointDegree) {
    myPoint.style.opacity = 1;
  }
}

let pointDegree;

function locationHandler(position) {
  pointDegree = calcDegreeToPoint(position.coords, Schutzi);

  if (pointDegree < 0) {
    pointDegree = pointDegree + 360;
  }
}

class Coordinate {
  constructor(lat, lon) {
    this.latitude = lat;
    this.longitude = lon;
  }
}


const Schutzi = new Coordinate(47.50077, 8.71749);

function calcDegreeToPoint(point1, point2) {
  const phiK = (point2.latitude * Math.PI) / 180.0;
  const lambdaK = (point2.longitude * Math.PI) / 180.0;
  const phi = (point1.latitude * Math.PI) / 180.0;
  const lambda = (point1.longitude * Math.PI) / 180.0;
  const psi =
        (180.0 / Math.PI) *
        Math.atan2(
          Math.sin(lambdaK - lambda),
          Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
  return Math.round(psi);
}

init();
