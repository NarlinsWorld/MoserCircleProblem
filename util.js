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

//this modifies arr in place when it is an array of pairs [[a1,b1],[a2,b2],...]
function sortLexicographically(arr) {
  return arr.sort((a, b) => {
    if (a.x !== b.x) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });
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

document.getElementById("clearr").addEventListener("click", () => {
  document.getElementById('Div2').innerHTML = "";//clears Output in Div2
  document.getElementById('Div1a').innerHTML = "";//clears Special Ouput.

});

//1. Accepts User input for the number of perimeter points.
document.getElementById("numPts").addEventListener("change", change_numPts); //sets the number of points


document.getElementById("toggleTXT").onclick = () => {
  showVertexIds = !showVertexIds;
  updateButton("toggleTXT", showVertexIds);
};

document.getElementById("togglePts").onclick = () => {
  showVertices = !showVertices;
  updateButton("togglePts", showVertices);
};

document.getElementById("toggleColor").addEventListener("click", () => {
  showFaceFill = !showFaceFill;
  updateButton("toggleColor", showFaceFill);
});

document.getElementById("toggleSegs").onclick = () => {
  showSegments = !showSegments;
  updateButton("toggleSegs", showSegments);
};

document.getElementById("toggleFaceIDs").onclick = () => {
  showFaceIDs = !showFaceIDs;
  updateButton("toggleFaceIDs", showFaceIDs);
}

function updateButton(id, state) {
  const b = document.getElementById(id);
  if (state) {
    b.style.backgroundColor = "rgb(1,254,1)";
    b.style.color = "black";
  } else {
    b.style.backgroundColor = "red";
    b.style.color = "white";
  }
}


// document.getElementById("toggleTXT").addEventListener("click", () => {
//   const button = document.getElementById("toggleTXT");
//   if (button.dataset.toggled === "true") {
//     // Turn OFF
//     button.style.backgroundColor = 'rgb(1, 254, 1)';
//     button.style.color = 'black'; // Reset text color
//     button.dataset.toggled = "false";
//     //console.log(`State: OFF`);
//   } else {
//     // Turn ON
//     button.style.backgroundColor = 'red';
//     button.style.color = 'white';
//     button.dataset.toggled = "true";
//     //console.log(`State: ON`);
//   }
// });

// document.getElementById("togglePts").addEventListener("click", () => {
//   const button = document.getElementById("togglePts");

//   if (button.dataset.toggled === "true") {
//     button.style.backgroundColor = 'rgb(0,254,0)';
//     button.style.color = "black";
//     button.dataset.toggled = "false";
//     //console.log(`State: ON`);
//   } else {
//     // Turn ON
//     button.style.backgroundColor = 'red';
//     button.style.color = 'white';
//     button.dataset.toggled = "true";
//     //console.log(`State: OFF`);
//   }
// });

// document.getElementById("toggleColor").addEventListener("click", () => {
//   const button = document.getElementById("toggleColor");

//   if (button.dataset.toggled === "true") {
//     button.style.backgroundColor = 'rgb(0,254,0)';
//     button.style.color = "black";
//     button.dataset.toggled = "false";
//     //console.log(`State: ON`);
//   } else {
//     // Turn ON
//     button.style.backgroundColor = 'red';
//     button.style.color = 'white';
//     button.dataset.toggled = "true";
//     //console.log(`State: OFF`);
//   }
// });

// document.getElementById("toggleSegs").addEventListener("click", () => {
//   const button = document.getElementById("toggleSegs");

//   if (button.dataset.toggled === "true") {
//     button.style.backgroundColor = 'rgb(0,254,0)';
//     button.style.color = "black";
//     button.dataset.toggled = "false";
//     //console.log(`State: ON`);
//   } else {
//     // Turn ON
//     button.style.backgroundColor = 'red';
//     button.style.color = 'white';
//     button.dataset.toggled = "true";
//     //console.log(`State: OFF`);
//   }
// });



/* Show Intersections Button 
The LISTENER: Re-COMPUTES THE INTERSECTION POINTS.
This Listener will plot intersection points on the graph
1. Cycle through all segment pairs and ask ?hasIntersection. The return will be true or false
2. If true, Point = intersectionPoint(seg1,seg2)
3. Save the point into intersections[x,y]
4. if intersections have been shown, they are plotted by draw()
*/
document.getElementById("listIntersections").addEventListener("click", () => {
  let found = false;
  for (const seg of segments) {
    if (seg.intersections.length > 0) { found = true; }
  }
  if (!found) { findIntersections(); }
  document.getElementById('Div2').innerHTML = ""; //clears Div2
  appendHTML("Div2", "Showing Intersections")
  sum = 0; // for showing the count of intersection in the output
  allVertices.forEach((item) => {
    ++sum;
    appendHTML("Div2", `${sum}.  (${parseFloat(item.x.toFixed(1))}, ${parseFloat(item.y.toFixed(1))})`);
  });
});





document.getElementById("listAllVertices").addEventListener("click", () => {
  for (let i = 0; i < allVertices.length; i++) {
    const p = allVertices[i];
    appendHTML(
      "Div2",
      `${i}: (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`
    );
  }
});

document.getElementById("listEdgesByVertex").addEventListener("click", () => {

  let edgecnt = 0; //edge count
  for (const p of allVertices) {
    const degree = p.edges.length;
    appendHTML(
      "Div2",
      `${p.id}. Vertex (${p.x.toFixed(1)}, ${p.y.toFixed(1)}) &nbsp; Graph Degree = ${degree}`
    );

    for (const e of p.edges) {
      ++edgecnt
      appendHTML(
        "Div2",
        `&nbsp;&nbsp;→ (${e.to.id} &nbsp;&nbsp;Angle = ${(e.angle * 180 / Math.PI).toFixed(1)}°`
      );
    }
  }
  appendHTML("Div2", `<br>Total HalfEdges = ${edgecnt}`);
});

document.getElementById("listHighDegreeVertices").addEventListener("click", () => {

  for (const p of allVertices) {

    const degree = p.edges.length;

    if (degree <= 4 ^ p.id < n)
      continue;

    appendHTML(
      "Div2",
      `<b>${p.id}</b> Degree = ${degree}
       &nbsp;&nbsp;(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`
    );
  }

});


//writes the segments to the output including the intersections on that segment.
document.getElementById("listSegs").addEventListener("click", () => {
  if (segments.length > 0) {

    appendHTML("Div2", 'listSegments')
    for (let i = 0; i < segments.length; ++i) {
      appendHTML("Div2", `${i}.&nbsp; (${segments[i].a.x.toFixed(1)}, ${segments[i].a.y.toFixed(1)}, 
      ${segments[i].b.x.toFixed(1)}, ${segments[i].b.y.toFixed(1)})`);
      for (const p of segments[i].intersections) {
        appendHTML("Div2", `&nbsp;&nbsp;&nbsp;&nbsp;(${p.vertex.x.toFixed(1)}, ${p.vertex.y.toFixed(1)},t=${p.t.toFixed(2)})`
        );
      }
    }
  }

});



//makeEdges event listener
document.getElementById("makeEdges").addEventListener("click", makeEdges);





document.getElementById("traceFace").addEventListener("click", () => {

  // Make sure this is a fresh traversal.
  for (const vertex of allVertices) {
    for (const edge of vertex.edges) {
      edge.visited = false;
    }
  }

  reportGraphCounts(); //prints "before call" results


  traceAllFaces();  //This function is in PlanarGraph.js
  let No_Regions = binom(n, 4) + binom(n, 2) + 1; //if used, it is number of faces for odd n

  appendHTML("Div1a", `--- After traceAllFaces ---`)
  appendHTML("Div1a", `Euler Faces found = F = ${faces.length}&nbsp;&nbsp;  1>A007678 would be correct.`);
  appendHTML("Div1a", `A007678 Expected faces = ${A007678(n)}`);
  appendHTML("Div1a", `allVertices length = V = ${allVertices.length}`);
  appendHTML("Div1a", `half edges cnt = ${cnt}`);
  appendHTML("Div1a", `whole edge count = E = ${cnt / 2}`);
  appendHTML("Div1a", `Euler check: V-E+F = ${allVertices.length}-${cnt / 2}+${faces.length} = ${allVertices.length - cnt / 2 + faces.length}`);
  appendHTML("Div1a", "===================================");
  appendHTML("Div1a", `&nbsp;&nbsp;&nbsp;&nbsp;`);
  removeExterior();
  buildDualGraph();
});


function reportGraphCounts() {
  // Number of Vertex objects in the graph
  const vertexCount = allVertices.length;
  // Count the actual HalfEdge objects stored in the vertices.
  let halfEdgeCount = 0;
  // Count undirected edges by counting each HalfEdge/twin pair once.
  const seen = new Set();
  let undirectedEdgeCount = 0;
  for (const vertex of allVertices) {
    for (const edge of vertex.edges) {
      ++halfEdgeCount;
      if (!seen.has(edge)) {
        ++undirectedEdgeCount;
        seen.add(edge);
        if (edge.twin !== null) {
          seen.add(edge.twin);
        }
      }
    }
  }

  appendHTML("Div1a", "========== GRAPH COUNTS ==========");
  appendHTML("Div1a", `n = ${n}`)
  appendHTML("Div1a", `Vertices       V = ${vertexCount} &nbsp;&nbsp;&nbsp;  Compare OEIS007569 = ${A007569(n)}`);
  appendHTML("Div1a", `Half-edges         = ${halfEdgeCount}`);
  appendHTML("Div1a", `Undirected edges E = ${undirectedEdgeCount} &nbsp;&nbsp;&nbsp; Compare OEISA135565= ${A135565(n)}`);
  appendHTML("Div1a", `Global cnt         = ${cnt}`);
  appendHTML("Div1a", `2E                 = ${2 * undirectedEdgeCount}`);
  appendHTML("Div1a", `Sum of degrees     = ${halfEdgeCount}`);
  appendHTML("Div1a", "---------");
}


function writeIndexNumber(x, y, txt) {
  stroke("Black");
  strokeWeight(1);
  text(txt, x + 5, y + 5);
  strokeWeight(5);
  stroke("Red");
}

//Event listener for listAngles
document.getElementById("listAngles").addEventListener("click", logAllEdgeAngles);

function logAllEdgeAngles() {
  //console.log("=== ALL HALF-EDGE ANGLES ===");
  let total = 0;
  for (const vertex of allVertices) {
    for (const edge of vertex.edges) {
      appendHTML(`Div2`,
        // `From (${edge.from.x.toFixed(1)}, ${edge.from.y.toFixed(1)}) → ` +
        // `To (${edge.to.x.toFixed(1)}, ${edge.to.y.toFixed(1)}) | ` +
        // `Angle: ${edge.angle.toFixed(4)} ::: (${(edge.angle * 180 / Math.PI).toFixed(2)}°)`
        `V${edge.from.id} → V${edge.to.id} : ` +
        `${(edge.angle * 180 / Math.PI).toFixed(2)}°`
      );
      total++;
    }
  }
  //console.log(`Total edges: ${total}`);
}

document.getElementById("facePointerVerification").addEventListener("click", () => {
  for (const v of allVertices) {
    for (const e of v.edges) {
      console.log(
        `V${e.from.id} -> V${e.to.id} belongs to Face ${e.face.id}`
      );
    }
  }
});

document.getElementById("showFaceArea").addEventListener("click", () => {
  let minArea = width * height;
  let maxArea = 0
  let fläche
  for (const face of faces) {
    fläche = area(face);
    if (fläche < minArea && fläche > epsilon) { minArea = fläche }
    if (fläche > maxArea) { maxArea = fläche }
    //console.log(face.id, area(face));
  }
  console.log(`min Area = ${minArea}`)
  console.log(`max Area = ${maxArea}`)
  let kreisefläche = Math.PI * r ** 2;
  console.log(`circle area = ${kreisefläche}`);
  let extF = faces.find(face => area(face) < 0);
  if (extF != null) {
    let oberfläche = area(extF);
    console.log(`The exterior face is id: ${extF.id} and has area ${oberfläche}`);
  }
  console.log(`exterior face id and area are ${exteriorFace.id} = ${area(exteriorFace)} sq. units`)
});

document.getElementById("faceVertices").addEventListener("click", () => {
  for (const face of faces) {
    // console.log(             //verification no longer needed.
    //   `Face ${face.id}: `
    //   + `${face.vertices.length} vertices, `
    //   + `${face.edges.length} edges`
    // );
    appendHTML("Div2", `${face.toString()}`);
  }
});

document.getElementById("seeNeighbors").addEventListener("click", () => {

  for (const face of faces) {
    console.log(
      `Face ${face.id}: neighbors = ${face.neighbors.map(f => f.id).join(", ")
      }`
    );
  }
});

document.getElementById("check_isSafe").addEventListener("click", () => {
  for (const face of faces) {
    const safe = isSafe(face, face.graphColor);
    console.log(
      `Face ${face.id}   graphColor = ${face.graphColor}   ${safe ? "SAFE" : "*** CONFLICT ***"}`
    );
    console.log(
      `Face ${face.id}: neighbors = ${face.neighbors.map(n => n.id).join(", ")}`);
  }
});

document.getElementById("colorFaceTester").addEventListener("click", () => {
   recursiveCalls = 0;
  faces.sort(
    (a, b) => b.neighbors.length - a.neighbors.length
);
  colorFace(0);
  console.log(`Total recursive calls = ${recursiveCalls}`);
  for (const face of faces) {
    // console.log(
    //   `Face ${face.id}  color=${face.graphColor}  ${isSafe(face, face.graphColor)
    //     ? "SAFE"
    //     : "CONFLICT"
    //   }`
    // );
  }
});