
//<button id="listPts">listPts</button>

document.getElementById("listPts").addEventListener("click", () => {
  if (v.length > 0) {
    for (let i = 0; i < v.length; ++i) {
      appendHTML("Div2", `(${v[i].x.toFixed(2)}, ${v[i].y.toFixed(2)})`)
    }
  }
});