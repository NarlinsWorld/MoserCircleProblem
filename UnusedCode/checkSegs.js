document.getElementById("checkSegs").addEventListener("click", () => {
  appendHTML("Div2", "<b>Segment Edge Check</b>");
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    // Number of vertices on this segment (including endpoints)
    const k = seg.intersections.length;
    // Number of undirected edges that SHOULD have been created
    const expectedEdges = k - 1;
    // Count actual half-edges lying on this segment
    let actualHalfEdges = 0;
    for (const sp of seg.intersections) {
      const v = sp.vertex;
      for (const e of v.edges) {
        // Count only edges whose destination is the next
        // vertex along THIS segment.
        for (let j = 0; j < k - 1; j++) {
          const v1 = seg.intersections[j].vertex;
          const v2 = seg.intersections[j + 1].vertex;
          if (e.from === v1 && e.to === v2)
            actualHalfEdges++;
        }
      }
    }

    appendHTML(
      "Div2",
      `Segment ${i}: V${seg.a.id}-V${seg.b.id}`
    );

    let chain = "";

    for (const sp of seg.intersections) {
      chain += `V${sp.vertex.id} `;
    }

    appendHTML("Div2", chain);

    appendHTML(
      "Div2",
      `&nbsp;&nbsp;intersection points = ${k}`
    );

    appendHTML(
      "Div2",
      `&nbsp;&nbsp;expected edges = ${expectedEdges}`
    );

    appendHTML(
      "Div2",
      `&nbsp;&nbsp;actual half-edges = ${actualHalfEdges}`
    );

    if (actualHalfEdges !== expectedEdges) {
      appendHTML(
        "Div2",
        `<span style="color:red">&nbsp;&nbsp;*** MISMATCH ***</span>`
      );
    }
  }
});