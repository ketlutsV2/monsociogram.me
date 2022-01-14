var app=app || {};

const sideCountEl = document.querySelector('#js-side-count');
const radiusEl = document.querySelector('#js-radius');
const cxEl = document.querySelector('#js-cx');
const cyEl = document.querySelector('#js-cy');
const generateEl = document.querySelector('#js-generate');
const polygonEl = document.querySelector('#js-polygon');
const resultEl = document.querySelector('#js-result');
const svgEl = document.querySelector('#js-svg');

function pts(sideCount, radius) {
  const angle = 360 / sideCount;
  const vertexIndices = range(sideCount);
  const offsetDeg =  ((180 - angle) / 2);
  const offset = degreesToRadians(offsetDeg);

  return vertexIndices.map((index) => {
    return {
      theta: offset + degreesToRadians(angle * index),
      r: radius,
    };
  });
}

function range(count) {
  return Array.from(Array(count).keys());
}

function degreesToRadians(angleInDegrees) {
  return (Math.PI * angleInDegrees) / 180;
}

function polygon([cx, cy], sideCount, radius) {
  return pts(sideCount, radius)
  .map(({ r, theta }) => [
    5+ cx + r * Math.cos(theta), 
    5+ cy + r * Math.sin(theta),
    ])
  .join(' '); 
}

function generatePolygon(sideCount) {
  const radius = 0.08*$('#spine').width();
  const s = 2 * radius ;

  const viz = polygon([s / 2, s / 2], sideCount, radius);
  const spine_polygon=document.getElementById('spine_polygon');
  const spine_pages=document.getElementById('spine_pages');
  spine_pages.innerHTML='';
  const svgPolygon=document.getElementById('spine_center');

  svgPolygon.setAttribute('points', viz);
  
  const summits=viz.split(' ');

  spine_polygon.style.width=(s+10)+'px';
  spine_polygon.style.height=(s+10)+'px';
  spine_pages.style.width=(s+10)+'px';
  spine_pages.style.height=(s+10)+'px';

  for (let i = summits.length - 1; i >= 0; i--) {

    let circle= document.createElementNS("http://www.w3.org/2000/svg", "circle");
    let coords=summits[i].split(',');
    circle.setAttribute('cx', coords[0]);
    circle.setAttribute('cy', coords[1]);
    circle.setAttribute('r', 5);
    let fill='#E3E3E3';

    if(i==app.spinePage){
      fill="#ff7040";
    }

    circle.setAttribute('fill', fill);  
    circle.setAttribute('stroke', "#E3E3E3");
    spine_pages.appendChild(circle);
  }
}