document.getElementById("listIntersections").addEventListener("click", showIntersections);

function showIntersections() {
  document.getElementById('Div2').innerHTML = ""; //clears Div2

  for (const seg of segments) { //because I am recomputing intersections, not recreating vertices.
    seg.intersections = [];
  }

  appendHTML("Div2", "Showing Intersections")
  for (let i = 0; i < segments.length; ++i) {
    for (let j = i + 1; j < segments.length; ++j) {
      let intersectTF = hasIntersect(segments[i], segments[j]);
      //console.log(`seg1:(${segments[i].a.x},${segments[i].b.y})    seg2:${segments[j].a.x},${segments[j].b.y})`);
      if (intersectTF) {
        intersectionPoint(segments[i], segments[j]);
      }
    }
  }

  const button = document.getElementById('listEdgesByVertex');
  button.style.backgroundColor = 'red';
  button.style.color = 'white';

  sum = 0 // for showing the count of intersection in the output
  allVertices.forEach((item) => {
    ++sum;
    appendHTML("Div2", `${sum}.  (${parseFloat(item.x.toFixed(1))}, ${parseFloat(item.y.toFixed(1))})`);
  });

}