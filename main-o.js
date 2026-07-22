appendHTML("Div1", `A circle has $n$ points on its perimeter.
  A chord connects every point to every other point. However, the 
  points are arranged such that no three chords ever concur at a point.<br> 
  Three questions.
  <ol>
  <li>How many chords are drawn for $n$ points? $\\binom{n}{2}$</li>
  <li>How many intersecting segments exist inside the circle perimeter? $\\binom{n}{4}$</li>
  <li>How many chord bounded regions exist for $n$ points? $\\binom{n}{4} + \\binom{n}{2} + 1$</li>
  </ol>
  `);

//globals
let r = 350 / 2; //the canvas is 400x400 so this is a radius for the big circle.
let n = parseFloat(document.getElementById("numPts").value); //index.html default is n=2
let theta;
let segments = [];
let pts = [];
let center;
let allIntersections = [];
let intersections = [];
let regions = [];
let epsilon = 0.0001

function setup() {
  const cnvs = createCanvas(400, 400);
  cnvs.parent('cvs');

  create_n_Points(n);
}

function draw() {
  background(250);
  noFill();
  circle(width / 2, height / 2, 2 * r); //the big circle

  //This loop Draws tiny circles to represent points on the big circle.
  noStroke();
  fill('blue');
  for (let i = 0; i < pts.length; ++i) {
    circle(pts[i][0], pts[i][1], 5);
  }
  stroke("black");

  //When points were created, segments were also created.
  if (segments.length > 0) {
    drawSegments();
    if(intersections.length>0){plotIntersections();}
    
  }

}

function create_n_Points(n) {
  /* Each pt is made of x,y. pt[0][0] = pt[ptnumber][x] and pt[0][1] = pt[ptnumber][y]  */
  pts = []; //clear the point array
  center = [width / 2, height / 2]; //center of the big circle

  //Symmetrically distribute points around the big circle
  for (let i = 0; i < n; ++i) {
    theta = i * 2 * Math.PI / n;
    pts.push([center[0] + r * Math.cos(theta), center[1] + r * Math.sin(theta)])
  }

  segments = [];
  createSegments();
}

function createSegments() {
  /* Each segment is composed of 4 values: segments[strtPtNum][x], [strtPtNum][y], [endPtNum][x], [endPtNum][y]  */
  for (let i = 0; i < pts.length - 1; ++i) {
    for (let j = i + 1; j < pts.length; ++j) {
      segments.push([pts[i][0], pts[i][1], pts[j][0], pts[j][1]]) //start pt of seg and end pt of segment
    }
  }
}

function drawSegments() {
  for (let i = 0; i < segments.length; ++i) {
    line(segments[i][0], segments[i][1], segments[i][2], segments[i][3]); //use P5 line() function
  }
}

