/*
Segment 1 has endpoints P1x,P1y and P2x,P2y
Segment 2 has endpoints Q1x,Q1y and Q2x,Q2y
*/
function intersectionPoint(P1x,P1y,P2x,P2y,Q1x,Q1y,Q2x,Q2y) {
  let Px = P1x;
  let Py = P1y;
  let Qx = Q1x;
  let Qy = Q1y;
  let ux = P2x-P1x;
  let uy = P2y-P1y;
  let vx = Q2x-Q1x;
  let vy = Q2y-Q1y;

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
function hasIntersect(seg1, seg2){
  let Ax=seg1[0];
  let Ay=seg1[1];
  let Bx=seg1[2];
  let By=seg1[3];
  let Cx=seg2[0];
  let Cy=seg2[1];
  let Dx=seg2[2];
  let Dy=seg2[3];

  //indicate if the lines intersect
  let dM = det3x3(1, Ax, Ay, 1, Bx, By, 1, Cx, Cy);
  let dN = det3x3(1, Ax, Ay, 1, Bx, By, 1, Dx, Dy);
  let dO = det3x3(1, Cx, Cy, 1, Dx, Dy, 1, Ax, Ay);
  let dP = det3x3(1, Cx, Cy, 1, Dx, Dy, 1, Bx, By);
  if (Math.sign(dM) != Math.sign(dN) && Math.sign(dO) != Math.sign(dP)){ans=true} else {ans=false}
  if (Math.sign(dM)==0 && Math.sign(dN)==0 && Math.sign(dO)==0 && Math.sign(dP)==0){ans=false}
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





