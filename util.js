/* utility function to add text(and latex) content to a named div.  Name and locate the div
in index.html.  For example <div id="Div1"></div>  or <div id="Div2"></div>
Each time the function is called, the stuffToAdd is appended to whatever is alread in the div.
example call:
appendHTML("Div1",`I have much text and some $\\LaTeX$ and a number ${varName}`)
Only difference between this and index.html latex, is the double \\
*/

function appendHTML(myDiv, stuffToAdd) {
  const ele = document.getElementById(myDiv);
  const newDiv = document.createElement("div");
  newDiv.innerHTML = stuffToAdd;
  ele.appendChild(newDiv);
  document.getElementById('Div1').scrollIntoView({ behavior: 'smooth' });
}

/*P is a point P[0],P[1] for x,y.  Q and point likewise
This returns the perpendicular distance for point to line PQ. */
function dist2LinePQ(P, Q, point) {
  let Qx = Q[0];
  let Qy = Q[1];
  let Px = P[0];
  let Py = P[1];
  let x = point[0];
  let y = point[1];
  let ux = Qx - Px; //direction P to Q
  let uy = Qy - Py;
  let upx = -uy; //perpendicular vectors
  let upy = ux;
  //vx and vy are the perpendicular direction vector components
  let vx = upx * (((Px - x) * upx + (Py - y) * upy) / (upx * upx + upy * upy));
  let vy = upy * (((Px - x) * upx + (Py - y) * upy) / (upx * upx + upy * upy));
  return Math.sqrt(vx * vx + vy * vy);
}

document.getElementById("clearr").addEventListener("click", () => {  //clears Output in Div2
  document.getElementById('Div2').innerHTML = "";

});

document.getElementById("numPts").addEventListener("change", () => {  //sets the number of points
  n = parseFloat(document.getElementById("numPts").value);
  intersections=[]; //clear the old intersections
  edgeArray = []; //clear the prior edgeArray
  numEdges = A135565(n);
  document.getElementById("regionalEdges").innerHTML = `Total Regional Edges will be ${numEdges}`;
  create_n_Points(n);
});

document.getElementById("clrPOINTS").addEventListener("click", () => { //resets pts and intersections to zero
  document.getElementById("numPts").value = parseInt(0);
  pts = [];
  intersections = [];
  edgeArray=[];
  n = 0;
});

document.getElementById("listPts").addEventListener("click", () => {
  if (pts.length > 0) {
    for (let i = 0; i < pts.length; ++i) {
      appendHTML("Div2", `(${pts[i][0].toFixed(2)}, ${pts[i][1].toFixed(2)})`)
    }
  }
});

//writes the segments to the output each segment is one row.
document.getElementById("listSegs").addEventListener("click", () => {
  if (segments.length > 0) {
    appendHTML("Div2", 'Segments')
    for (let i = 0; i < segments.length; ++i) {
      appendHTML("Div2", `${i}.&nbsp; (${segments[i][0].toFixed(1)}, ${segments[i][1].toFixed(1)}, ${segments[i][2].toFixed(1)}, ${segments[i][3].toFixed(1)})`)
    }
  }
});

/* Show Intersections Button
This Listener will plot intersection points on the graph
1. Cycle through all segment pairs and ask ?hasIntersection. The return will be true or false
2. If true, Point = intersectionPoint(P1x,P1y,P2x,P2y,Q1x,Q1y,Q2x,Q2y)
3. Save the point into intersections[x,y]
4. if intersections have been shown, they are plotted by draw()
*/
document.getElementById("listIntersections").addEventListener("click", () => {
  document.getElementById('Div2').innerHTML = ""; //clears Div2
  intersections = []; //clear the array first
  appendHTML("Div2","Showing Intersections")
  for (let i = 0; i < segments.length; ++i) {
    for (let j = i + 1; j < segments.length; ++j) {
      let intersectTF = hasIntersect(segments[i], segments[j]);
      if (intersectTF) {
        let IP = intersectionPoint(
          segments[i][0],
          segments[i][1],
          segments[i][2],
          segments[i][3],
          segments[j][0],
          segments[j][1],
          segments[j][2],
          segments[j][3]
        );
        //compute distance IP to circle center
        let x = IP[0];
        let y = IP[1];
        let d = Math.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2);
        //compute distance IP to circle edge
        let close = Math.abs(d - r) //r is a global
        //is close less than epsilon?
        if (close > epsilon) { intersections.push([x, y]) } //this line adds an intersection point
      } //end if
    } //end on for j
  } //end on for i
  /*Go thru the intersections and remove duplicates */
  let uniqueIntersections = [];
  sum=0 // for showing the count of intersection in the output
  intersections.forEach((item) => {
    ++sum;
    appendHTML("Div2", `${sum}  ${item[0]}, ${item[1]}`);
  });

  createEdges();  //since we have intersections, we can have edges

});

document.getElementById("listEdges").addEventListener("click",()=>{
  appendHTML("Div2",`edgeArray`);
  for(let i=0; i<edgeArray.length; ++i){
    appendHTML("Div2",`[${edgeArray[i]}]`)
  }
});

document.getElementById("listRegions").addEventListener("click", () => {
  // for (let i = 0; i < regions.length; ++i) {

  // }
  console.log(regions);
});


