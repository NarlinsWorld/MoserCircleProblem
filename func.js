/*
Segment 1 has endpoints P1x,P1y and P2x,P2y
Segment 2 has endpoints Q1x,Q1y and Q2x,Q2y
*/
function intersectionPoint(P1x, P1y, P2x, P2y, Q1x, Q1y, Q2x, Q2y) {
  let Px = P1x;
  let Py = P1y;
  let Qx = Q1x;
  let Qy = Q1y;
  let ux = P2x - P1x;
  let uy = P2y - P1y;
  let vx = Q2x - Q1x;
  let vy = Q2y - Q1y;

  let num = (Px - Qx) * -uy + (Py - Qy) * ux;
  let den = vx * -uy + vy * ux;
  let x = Qx + (num / den) * vx;
  let y = Qy + (num / den) * vy;
  return [x, y];
}

/*Data format: 
 Each segment is composed of 4 values: segments[strtPtNum][x], [strtPtNum][y], [endPtNum][x], [endPtNum][y] 

 seg1: 
 [segments[i][0], segments[i][1], segments[i][2], segments[i][3]] ::: A_x, A_y, B_x, B_y

 seg2:
 [segments[i][0], segments[i][1], segments[i][2], segments[i][3]] ::: C_x, C_y, D_x, D_y

 This returns true for all intersections, including end to end, meaning they intersect on the circle.
 */
function hasIntersect(seg1, seg2) {
  let Ax = seg1[0];
  let Ay = seg1[1];
  let Bx = seg1[2];
  let By = seg1[3];
  let Cx = seg2[0];
  let Cy = seg2[1];
  let Dx = seg2[2];
  let Dy = seg2[3];

  //indicate if the lines intersect
  let dM = det3x3(1, Ax, Ay, 1, Bx, By, 1, Cx, Cy);
  let dN = det3x3(1, Ax, Ay, 1, Bx, By, 1, Dx, Dy);
  let dO = det3x3(1, Cx, Cy, 1, Dx, Dy, 1, Ax, Ay);
  let dP = det3x3(1, Cx, Cy, 1, Dx, Dy, 1, Bx, By);
  if (Math.sign(dM) != Math.sign(dN) && Math.sign(dO) != Math.sign(dP)) { ans = true } else { ans = false }
  if (Math.sign(dM) == 0 && Math.sign(dN) == 0 && Math.sign(dO) == 0 && Math.sign(dP) == 0) { ans = false }
  return ans;
}

function det3x3(a, b, c, d, e, f, g, h, i) {
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}



function showSegs() {
  stroke(0); // Black lines
  strokeWeight(1);
  line(circles[0].x, circles[0].y, circles[1].x, circles[1].y);
  line(circles[2].x, circles[2].y, circles[3].x, circles[3].y);
  noStroke(); // Reset stroke for other drawing
}

function plotIntersections() {
  strokeWeight(5);
  stroke("red")
  for (let i = 0; i < intersections.length; ++i) {
    point(intersections[i][0], intersections[i][1]);
  }
  strokeWeight(1);
  stroke("black")
}

/*tempInts means temporary intersections and is an array
of pairs [[x,y],[x1,y1],[x2,y2],...]
*/
function removeRedundantPairs(tempInts, epsilon = 0.0001) {
  // Snap a coordinate to the epsilon grid.
  const snap = v => Math.round(v / epsilon);
  const seen = new Set();
  const result = [];
  for (const pair of tempInts) {
    const [x1, y1] = pair;
    // Create a string key from the snapped coordinates
    const sx = snap(x1);
    const sy = snap(y1);
    const key = `${sx},${sy}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(pair);   // keep the first occurrence
    }
  }
  return result;
}

const del = (m, n) => +(n % m === 0); //n % m === 0 checks divisibility.Unary + converts true → 1, false → 0.

//terse binomial function
const binom = (n, k) =>
  n < k ? 0 : [...Array(k)].reduce((a, _, i) => (a * (n - i)) / (i + 1), 1);

//console.log(del(1,5));

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

function A007678(n){
  if(n < 3){return 0} else{
   return (n**4 - 6*n**3 + 23*n**2 - 42*n + 24)/24 +
    del(2, n)*(-5*n**3 + 42*n**2 - 40*n - 48)/48 - del(4, n)*(3*n/4) +
    del(6, n)*(-53*n**2 + 310*n)/12 + del(12, n)*(49*n/2) +
    del(18, n)*32*n + del(24, n)*19*n - del(30, n)*36*n -
    del(42, n)*50*n - del(60, n)*190*n - del(84, n)*78*n -
    del(90, n)*48*n - del(120, n)*78*n - del(210, n)*48*n;
  }
}

function A135565(n){
  return A007569(n)+A007678(n)-1
}



