appendHTML("Div1", `A circle has $n$ points on its perimeter.
  A chord connects every point to every other point. However, the 
  points are arranged such that no three chords ever concur at a point.<br> 
  Three questions.
  <ol>
  <li>How many chords are drawn for $n$ points? $\\binom{n}{2}$</li>
  <li>How many intersecting segments exist inside the circle perimeter? $\\binom{n}{4}$</li>
  <li>How many chord bounded regions exist for $n$ points</li>
  </ol>
  `);

//globals
let r = 350 / 2;
let n = parseFloat(document.getElementById("numPts").value);
let theta;
let segments = [];
let pts = [];
let firstTime = true;
let center;
let allIntersections = [];
let regions = [];

function setup() {
  const cnvs = createCanvas(400, 400);
  cnvs.parent('cvs');

  create_n_Points(n);
  if (pts.length > 0 && firstTime) {
    firstTime = false;
  }

}

function draw() {
  background(250);
  noFill();
  circle(width / 2, height / 2, 2 * r); //the big circle
  for (let i = 0; i < pts.length; ++i) {
    circle(pts[i][0], pts[i][1], 5);
  }
  if(segments.length>0){
    drawSegments();
  }

}

function create_n_Points(n) {
  pts = [];
  center = [width / 2, height / 2];
  for (let i = 0; i < n; ++i) {
    theta = i * 2 * Math.PI / n;

    pts.push([center[0] + r * Math.cos(theta), center[1] + r * Math.sin(theta)])
  }
  segments=[];
  createSegments();
}

function createSegments() {
  for (let i = 0; i < pts.length - 1; ++i) {
    for (let j = i + 1; j < pts.length; ++j) {
      segments.push([pts[i][0], pts[i][1], pts[j][0], pts[j][1]]) //start pt of seg and end pt of segment
    }
  }
}

function drawSegments(){
  for(let i=0; i<segments.length; ++i){
    line(segments[i][0],segments[i][1],segments[i][2],segments[i][3]);
  }
}

