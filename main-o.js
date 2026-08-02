/*appendHTML("Div1", `A circle has $n$ points on its perimeter.
  A chord connects every point to every other point. However, the 
  points are arranged such that no three chords ever concur at a point.<br> 
  Three questions.
  <ol>
  <li>How many chords are drawn for $n$ points? $\\binom{n}{2}$</li>
  <li>How many intersecting segments exist inside the circle perimeter? $\\binom{n}{4}$</li>
  <li>How many chord bounded regions exist for $n$ points? $\\binom{n}{4} + \\binom{n}{2} + 1$</li>
  </ol>
  `);
*/

//globals
let r = 350 / 2; //the canvas is 400x400 so this is a radius for the big circle.
let n = parseFloat(document.getElementById("numPts").value); //index.html default is n=3
let theta;
let segments = []; //instance array of class Segment
let v = []; //instance array of class Vertex to hold only original perimeter points
let center;
let allVertices = []; //instance array of class Segment, every unique point in the planar graph
let regions = [];
let epsilon = 10 ** (-5);
let cnt; //keeps up with a count of half edges.
let nextVertexId = 0; //clear this before any new n 

function setup() {
  const cnvs = createCanvas(400, 400);
  cnvs.parent('cvs');
  create_n_Points(n); //When points are created, segments are too.
  change_numPts(); //fills in some blanks in HTML
}


function draw() {
  background(250);
  noFill();
  circle(width / 2, height / 2, 2 * r); //the big circle

  stroke('black');
  strokeWeight(1)
  if (segments.length > 0) {
    drawSegments();  //draw and redraw edges
  }
  
  plotAllVertices();

}


//These are the segments between points on the circle.

function create_n_Points(n) {
  v = [];
  allVertices = [];
  nextVertexId = 0; //this global must be initialized here.
  center = [width / 2, height / 2];
  for (let i = 0; i < n; i++) {
    const theta = i * 2 * Math.PI / n;
    const x = center[0] + r * Math.cos(theta);
    const y = center[1] + r * Math.sin(theta);
    const vertex = new Vertex(nextVertexId++, x, y);
    v.push(vertex);
    allVertices.push(vertex); //accumulate the perimeter points into allVertices
  }
  segments = [];
  createSegments();
}



//These too are the segments between points on the circle.  They are long and there are binom(n,2) of them

function createSegments() {
  segments = [];

  for (let i = 0; i < v.length - 1; i++) {
    for (let j = i + 1; j < v.length; j++) {
      segments.push(new Segment(v[i], v[j]));
    }
  }
}

function drawSegments() {
  for (let i = 0; i < segments.length; ++i) {
    line(segments[i].a.x, segments[i].a.y, segments[i].b.x, segments[i].b.y); //use P5's line()
  }
}

function drawEdges() {
  for (const p of allVertices) {
    for (const e of p.edges) {
      line(e.from.x, e.from.y, e.to.x, e.to.y);
    }
  }
}







