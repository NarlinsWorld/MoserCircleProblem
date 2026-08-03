class Vertex {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.edges = [];
    }
}
//Addressing Schemes for v= new Vertex(id,x,y)
/*
  for (let item of v){
  console.log(`item = ${item.id}, ${item.x},${item.y}`);
}
  
  v.forEach(item => {
  console.log(`item = ${item.id}, ${item.x},${item.y}`);
  });

  for(let i=0; i<v.length; ++i){
    console.log(`v[i]=${v[i].id}, ${v[i].x}, ${v[i].y}`);
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

    toString() {
        const deg = (this.angle * 180 / Math.PI).toFixed(2);
        return `HalfEdge from (${this.from.x},${this.from.y}) to (${this.to.x},${this.to.y}) [${deg}°]`;
    }
    /*const edge = new HalfEdge(v1, v2);
    console.log(edge.toString()); // readable output */
}

class Segment {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.intersections = [];   // we'll use this later
    }

    addIntersection(v, t) {
        if (!this.intersections.some(item => item.vertex === v)) {
            this.intersections.push(new SegmentPoint(v, t));
        }
    }

    sortIntersections() {
        this.intersections.sort((a, b) => a.t - b.t);
    }

    makeEdges() {
        this.sortIntersections();

        for (let i = 0; i < this.intersections.length - 1; i++) {

            const v1 = this.intersections[i].vertex;
            const v2 = this.intersections[i + 1].vertex;
            //---- debug
            if (dist(v1.x, v1.y, v2.x, v2.y) <= epsilon) {
                console.log(
                    `Degenerate edge on segment ${this.a.id}-${this.b.id} at j=${i}`);

                console.log(
                    `Duplicate consecutive vertex ${v1.id} on segment ${this.a.id}-${this.b.id}`);
            }
            //---- end debug

            // create the two half-edges here
            const e1 = new HalfEdge(v1, v2);
            const e2 = new HalfEdge(v2, v1);
            e1.twin = e2;
            e2.twin = e1;
            v1.edges.push(e1);
            v2.edges.push(e2);
            cnt += 2; //cnt will be global. its a count of half edges
        }

    }

    //not used
    length() {
        return dist(this.a.x, this.a.y,
            this.b.x, this.b.y);
    }
}

class SegmentPoint {
    constructor(vertex, t) {
        this.vertex = vertex;
        this.t = t;
    }
}

class Face {

    constructor(id) {
        this.id = id;
        this.vertices = [];
        this.edges = [];
        this.neighbors = [];
        this.color = -1;
    }

    toString() {
        return `Face ${this.id}: `
            + this.vertices.map(v => `V${v.id}`).join(" → ")
            + ` → V${this.vertices[0].id}`;
    }

    addNeighbor(otherFace) {
        if (otherFace === this)
            return;
        if (!this.neighbors.includes(otherFace))
            this.neighbors.push(otherFace);
    }



    trace(startEdge) {
        let e = startEdge;
        do {
            e.visited = true;
            e.face = this;
            this.vertices.push(e.from);
            this.edges.push(e);
            e = nextEdge(e);
        } while (e !== startEdge);
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
    const face = new Face(nextFaceId++);
    let e = start;
    do {
        e.visited = true;
        e.face = face;  //this line is the face pointer
        face.vertices.push(e.from);
        face.edges.push(e);
        e = nextEdge(e);
    } while (e !== start);
    return face;
}

function traceAllFaces() {
    faces = [];          // clear global array
    nextFaceId = 0;
    for (const vertex of allVertices) {
        for (const edge of vertex.edges) {
            if (!edge.visited) {
                const face = traceFace(edge);
                faces.push(face);
                // console.log(
                //     `Face ${face.id}: ` +
                //     face.vertices.map(v => `V${v.id}`).join(" → ") +
                //     ` → V${face.vertices[0].id}`
                // );
            }
        }
    }
    //return faces;
}



/* REMOVE THE EXTERIOR */

//polygon area per shoeString method
function area(face) {
    let A = 0;
    const poly = face.vertices;
    //console.log(poly);
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        A += a.x * b.y - b.x * a.y;
    }
    return A / 2;
}



//find exterior face
const extFace = () => {
    {
        let fläche
        for (const face of faces) {
            fläche = area(face);
            if (fläche < 0) { return face }
        }
        return null;
    }
}


function buildDualGraph() {
    for (const face of faces) {
        face.neighbors = [];
        for (const edge of face.edges) {
            face.addNeighbor(edge.twin.face);
        }
    }
}

