/* This works fine, but has an older style point input.
Segment 1 has endpoints P1x,P1y and P2x,P2y
Segment 2 has endpoints Q1x,Q1y and Q2x,Q2y
*/
// function intersectionPoint(P1x, P1y, P2x, P2y, Q1x, Q1y, Q2x, Q2y) {
//   let Px = P1x;
//   let Py = P1y;
//   let Qx = Q1x;
//   let Qy = Q1y;
//   let ux = P2x - P1x;
//   let uy = P2y - P1y;
//   let vx = Q2x - Q1x;
//   let vy = Q2y - Q1y;

//   let num = (Px - Qx) * -uy + (Py - Qy) * ux;
//   let den = vx * -uy + vy * ux;
//   let x = Qx + (num / den) * vx;
//   let y = Qy + (num / den) * vy;
//   return [x, y];
// }