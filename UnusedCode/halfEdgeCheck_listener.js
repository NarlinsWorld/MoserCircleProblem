//<button id="halfEdgeCheck">halfEdgeCheck</button>

document.getElementById("halfEdgeCheck").addEventListener("click", () => {
  const edgeMap = new Map();
  for (const v of allVertices) {
    for (const e of v.edges) {
      const a = Math.min(e.from.id, e.to.id);
      const b = Math.max(e.from.id, e.to.id);
      const key = `${a}-${b}`;
      if (!edgeMap.has(key))
        edgeMap.set(key, []);
      edgeMap.get(key).push(e);
    }
  }
  for (const [key, list] of edgeMap) {
    if (list.length !== 2) {
      console.log(
        `${key} has ${list.length} half-edges`
      );
      for (const e of list)
        console.log(
          `   ${e.from.id} -> ${e.to.id}`
        );
    }
  }
});