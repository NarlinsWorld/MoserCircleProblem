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

document.getElementById("clearr").addEventListener("click", () => {  //clears Output in Div2
  document.getElementById('Div2').innerHTML = "";

});

document.getElementById("numPts").addEventListener("change", () => {  //sets the number of points
  n = parseFloat(document.getElementById("numPts").value);
  create_n_Points(n);
});

document.getElementById("clrPOINTS").addEventListener("click", () => { //resets pts to zero
  document.getElementById("numPts").value = parseInt(0);
  pts = [];
  n = 0;
});

document.getElementById("listPts").addEventListener("click", () => {
  if (pts.length > 0) {
    for (let i = 0; i < pts.length; ++i) {
      appendHTML("Div2", `(${pts[i][0].toFixed(2)}, ${pts[i][1].toFixed(2)})`)
    }
  }
});

document.getElementById("listSegs").addEventListener("click", () => {
  if (segments.length > 0) {
    appendHTML("Div2", 'Segments')
    for (let i = 0; i < segments.length; ++i) {
      appendHTML("Div2", `${i + 1}.&nbsp; (${segments[i][0].toFixed(1)}, ${segments[i][1].toFixed(1)}, ${segments[i][2].toFixed(1)}, ${segments[i][3].toFixed(1)})`)
    }
  }
});

document.getElementById("listIntersections").addEventListener("click", () => {
  for (let i = 0; i < allIntersections.length; ++i) {
    if (Math.abs(allIntersections[i][0] - allIntersections[i][1]) < 1) {
      console.log(`${i}: (${allIntersections[i][0]} ,${allIntersections[i][1]})`);
    }
  }
  console.log(allIntersections);
});

document.getElementById("listRegions").addEventListener("click", () => {
  // for (let i = 0; i < regions.length; ++i) {
    
  //     console.log(`${i}: (${allIntersections[i][0]} ,${allIntersections[i][1]})`);
    
  // }
  console.log(regions);
});
