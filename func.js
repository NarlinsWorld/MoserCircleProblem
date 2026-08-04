function change_numPts() {
  //clear stuff first
  n = parseFloat(document.getElementById("numPts").value);
  if(n<=2){
    appendHTML("Div1",`<span style=color:red;>Too Few Points to calculate</span>`);
    return
  }
  allVertices = []; //clear the old intersections
  if (n > 2) {
    // let No_Regions = binom(n, 4) + binom(n, 2) + 1;
    // document.getElementById("cntRegions").innerHTML = No_Regions;
  }
  v = []; //clears my point array, an instance of class Vector
  document.getElementById("numchords").innerHTML = binom(n, 2);
  document.getElementById("a7569").innerHTML = A007569(n);
  document.getElementById("a7678").innerHTML = A007678(n);
  document.getElementById("a7678plusn").innerHTML = parseInt(A007678(n) + n);
  document.getElementById("currentn").innerHTML = n;
  numEdges = A135565(n);
  document.getElementById("regionalEdges").innerHTML = `Polygon Regional Edges will be ${numEdges}. `;
  document.getElementById("halfEdgeCnt").innerHTML = " Half Edge Count is none";
  create_n_Points(n);
  findIntersections(); //basically, the real place where we make intersections
  makeEdges();
  traceAllFaces();  //This function is in PlanarGraph.js   
  removeExterior();
  buildDualGraph();
}

/* this is called from "change_numPts." 
This is "the routine" that calls intersectionPoint
Why? This exists because function intersectionPoint() has to be called for each segment.
*/
function findIntersections() {
  for (const seg of segments) { //because I am recomputing intersections, not recreating vertices.
    seg.intersections = [];
  }
  for (let i = 0; i < segments.length; ++i) {
    for (let j = i + 1; j < segments.length; ++j) {
      intersectionPoint(segments[i], segments[j]);
    }
  }
}


function intersectionPoint(seg1, seg2) {

  const P = seg1.a;
  const P2 = seg1.b;

  const Q = seg2.a;
  const Q2 = seg2.b;

  let ux = P2.x - P.x;
  let uy = P2.y - P.y;

  let vx = Q2.x - Q.x;
  let vy = Q2.y - Q.y;

  let num = (P.x - Q.x) * -uy +
    (P.y - Q.y) * ux;

  let den = vx * -uy +
    vy * ux;

  // Parallel or coincident lines
  if (Math.abs(den) < epsilon)
    return null;

  let x = Q.x + (num / den) * vx;
  let y = Q.y + (num / den) * vy;

  // Parametric distances along the two segments
  const t =
    ((x - P.x) * ux + (y - P.y) * uy) /
    (ux * ux + uy * uy);

  const s =
    ((x - Q.x) * vx + (y - Q.y) * vy) /
    (vx * vx + vy * vy);

  // Reject if the intersection is not actually on BOTH segments.
  if (t < -epsilon || t > 1 + epsilon)
    return null;

  if (s < -epsilon || s > 1 + epsilon)
    return null;

  const vtemp = findOrCreateVertex(x, y);

  seg1.addIntersection(vtemp, t);
  seg2.addIntersection(vtemp, s);

  return vtemp;
}

function findOrCreateVertex(x, y) {
  for (const v of allVertices) {
    if (dist(v.x, v.y, x, y) < epsilon) {
      return v;            // Reuse the existing vertex
    }
  }

  const v = new Vertex(nextVertexId++, x, y);
  allVertices.push(v);
  return v;
}

/*Data format: 
 Each segment is composed of 4 values: segments.a.x, segments.a.y, segments.b.x, segments.b.y 
 seg1: 
 [seg1.a.x, seg1.a.y, seg1.b.x, seg1.b.y ::: A_x, A_y, B_x, B_y
 seg2:
 [seg2.a.x, seg2.a.y, seg2.b.x, seg2.b.y ::: C_x, C_y, D_x, D_y
 */
function hasIntersect(seg1, seg2) {
  let Ax = seg1.a.x; //a is one end of seg1 
  let Ay = seg1.a.y; //
  let Bx = seg1.b.x; //b is the other end of seg1
  let By = seg1.b.y;
  let Cx = seg2.a.x;
  let Cy = seg2.a.y;
  let Dx = seg2.b.x;
  let Dy = seg2.b.y;

  //indicate if the lines intersect
  let dM = det3x3(1, Ax, Ay, 1, Bx, By, 1, Cx, Cy);
  let dN = det3x3(1, Ax, Ay, 1, Bx, By, 1, Dx, Dy);
  let dO = det3x3(1, Cx, Cy, 1, Dx, Dy, 1, Ax, Ay);
  let dP = det3x3(1, Cx, Cy, 1, Dx, Dy, 1, Bx, By);
  if (Math.sign(dM) != sign(dN, epsilon) && sign(dO, epsilon) != sign(dP, epsilon)) { ans = true } else { ans = false }
  if (Math.sign(dM, epsilon) == 0 && sign(dN, epsilon) == 0 && sign(dO, epsilon) == 0 && sign(dP, epsilon) == 0) { ans = false }
  return ans;
}

function det3x3(a, b, c, d, e, f, g, h, i) {
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

function sign(x, epsilon = 0.0001) {
  if (Math.abs(x) < epsilon)
    return 0;
  return Math.sign(x);
}

/* func makeEdges along with helper sortAllVertexEdges and the makeEdges method of PlanarGraph.js 
creates and counts half edges.
*/
function makeEdges() {
  // Clear all vertex edges first
  for (const vertex of allVertices) {
    vertex.edges = [];
  }
  cnt = 0;

  // Then create new edges
  for (const seg of segments) {
    seg.makeEdges(); // No clearing needed inside
  }
  sortAllVertexEdges(); //sorts all of the edges by angle

  document.getElementById("halfEdgeCnt").innerHTML = `Half Edge Count = ${cnt}.`;
}

//helper for edge sorting
function sortAllVertexEdges() {
  for (const v of allVertices) {
    v.edges.sort((a, b) => a.angle - b.angle);
  }
}

function plotAllVertices() {
  strokeWeight(5);
  stroke("red");
  for (const v of allVertices) {
    if (showVertices) {
      point(v.x, v.y);
    }
    if (showVertexIds) {
      writeIndexNumber(v.x, v.y, v.id);
    }
  }
  strokeWeight(1);
  stroke("black")
}

//needed for the 3 A007569(n),A007678(n), A135565(n)
const del = (m, n) => +(n % m === 0); //n % m === 0 checks divisibility.Unary + converts true → 1, false → 0.

//terse binomial function
const binom = (n, k) =>
  n < k ? 0 : [...Array(k)].reduce((a, _, i) => (a * (n - i)) / (i + 1), 1);

//console.log(del(1,5));
// A007569 Number of nodes in regular n-gon with all diagonals drawn. 
function A007569(n) {
  if (n < 4) {
    return n;
  } else {
    return (
      n +
      binom(n, 4) +
      del(2, n) * (-5 * n ** 3 + 45 * n ** 2 - 70 * n + 24) / 24 -
      del(4, n) * ((3 * n) / 2) +
      (del(6, n) * (-45 * n ** 2 + 262 * n)) / 6 +
      del(12, n) * 42 * n +
      del(18, n) * 60 * n +
      del(24, n) * 35 * n -
      del(30, n) * 38 * n -
      del(42, n) * 82 * n -
      del(60, n) * 330 * n -
      del(84, n) * 144 * n -
      del(90, n) * 96 * n -
      del(120, n) * 144 * n -
      del(210, n) * 96 * n
    );
  }
}

//A007678 is the Number of regions in regular n-gon with all diagonals drawn. 
function A007678(n) {
  if (n < 3) { return 0 } else {
    return (n ** 4 - 6 * n ** 3 + 23 * n ** 2 - 42 * n + 24) / 24 +
      del(2, n) * (-5 * n ** 3 + 42 * n ** 2 - 40 * n - 48) / 48 - del(4, n) * (3 * n / 4) +
      del(6, n) * (-53 * n ** 2 + 310 * n) / 12 + del(12, n) * (49 * n / 2) +
      del(18, n) * 32 * n + del(24, n) * 19 * n - del(30, n) * 36 * n -
      del(42, n) * 50 * n - del(60, n) * 190 * n - del(84, n) * 78 * n -
      del(90, n) * 48 * n - del(120, n) * 78 * n - del(210, n) * 48 * n;
  }
}

// A135565 Number of line segments 
// (or edges) in regular n-gon with all diagonals drawn. 
function A135565(n) {
  return A007569(n) + A007678(n) - 1
}



