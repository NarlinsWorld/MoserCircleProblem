class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.edges = [];
    }
}
//Addressing Schemes for v= new Vertex(x,y)
/*
  for (let item of v){
  console.log(`item = ${item.x},${item.y}`);
}
  
  v.forEach(item => {
  console.log(`item = ${item.x},${item.y}`);
  });

  for(let i=0; i<v.length; ++i){
    console.log(`v[i]=${v[i].x}, ${v[i].y}`);
  }
    */

class HalfEdge {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.twin = null;
        this.visited = false;
        this.angle = Math.atan2(
            to.y - from.y,
            to.x - from.x
        );
    }
}



//Find the next edge
//When entering a vertex, find the reverse edge and rotate one step.
function nextEdge(edge) {
    const v = edge.to;
    const list = v.edges;
    const twin = edge.twin;
    const i = list.indexOf(twin);
    return list[(i - 1 + list.length) % list.length];
}

//Using -1, walks clockwise
//Using +1, walks ccw
//Only one orientation give interior faces

/* FACE TRAVERSAL */
function traceFace(start) {
    const poly = [];
    let e = start;
    while (!e.visited) {
        e.visited = true;
        poly.push(e.from);
        e = nextEdge(e);
    }
    return poly;
}



/* REMOVE THE EXTERIOR */
function area(poly) {
    let A = 0;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        A += a.x * b.y - b.x * a.y;
    }
    return A / 2;
}

//===================================== not part of any fuction ========
//js
/* SORT NEIGHBORS */
/*
for (const v of vertices) {
    v.edges.sort((a, b) => a.angle - b.angle);
}

// ENUMERATE EVERY FACE 
//Every directed edge belongs to exactly one face, so every face is found exactly once.

const faces = [];
for (const v of vertices) {
    for (const e of v.edges) {
        if (!e.visited) {
            const face = traceFace(e);
            if (face.length >= 3)
                faces.push(face);
        }
    }
}


//js
let outside = 0;
let max = 0;
for (let i = 0; i < faces.length; i++) {
    const a = Math.abs(area(faces[i]));
    if (a > max) {
        max = a;
        outside = i;
    }
}
faces.splice(outside, 1);
console.log(faces.length);
*/