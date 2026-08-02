//<button id="clrPOINTS">Clear Pts</button> <!-- Clears the Canvas Points -->

document.getElementById("clrPOINTS").addEventListener("click", () => { //resets pts and intersections to zero
  document.getElementById("numPts").value = parseInt(0);
  v = [];
  allVertices = [];
  n = 0;
  document.getElementById("regionalEdges").innerHTML = `Total Regional Edges will be ${0}. `;
  document.getElementById("halfEdgeCnt").innerHTML = " Half Edge Count is none";
  // const button = document.getElementById('listEdgesByVertex');
  // button.style.backgroundColor = 'red';
  // button.style.color = 'white';
  // const button1 = document.getElementById('listAngles');
  // button.style.backgroundColor = 'red';
  // button1.style.color = 'white';

});