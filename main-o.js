/*appendHTML("Div1", `A circle has $n$ points on its perimeter.
  A chord connects every point to every other point. However, the 
  points are arranged such that no three chords ever concur at a point.<br> 
  Three questions.
  <ol>
  <li>How many chords are drawn for $n$ points? $\\binom{n}{2}$</li>
  <li>How many intersecting segments exist inside the circle perimeter? $\\binom{n}{4}$</li>
  <li>How many chord bounded regions exist for $n$ points? $\\binom{n}{4} + \\binom{n}{2} + 1$</li>
  </ol>
  `);
*/ 

//globals
let r = 350 / 2; //the canvas is 400x400 so this is a radius for the big circle.
let n = parseFloat(document.getElementById("numPts").value); //index.html default is n=2
let theta;
let segments = [];
let edgeArray = [];
//let pts = [];
let v = []; //data structure vertex
let center;
let intersections = [];
let regions = [];
let epsilon = 0.0001

function setup() {
  const cnvs = createCanvas(400, 400);
  cnvs.parent('cvs');

  create_n_Points(n);
}

function draw() {
  background(250);
  noFill();
  circle(width / 2, height / 2, 2 * r); //the big circle

  //This loop Draws tiny circles to represent points on the big circle.
  noStroke();
  fill('blue');
  // for (let i = 0; i < pts.length; ++i) {
  //   circle(pts[i][0], pts[i][1], 5);
  // }
  for (const i of v) {
    circle(i.x, i.y, 5);
    stroke("black");
  }

  //When points were created, segments were also created.
  if (segments.length > 0) {
    drawSegments();
    if (intersections.length > 0) { plotIntersections(); }
  }

  //drawEdges
  if (edgeArray.length > 0) {
    stroke("green");
    for (let k = 0; k < edgeArray.length; ++k) {
      let Ax = edgeArray[k][0];
      let Ay = edgeArray[k][1];
      let Bx = edgeArray[k][2];
      let By = edgeArray[k][3];
      line(Ax, Ay, Bx, By);
    }
    stroke("black");
  }
}

//These are the segments between points on the circle.

function create_n_Points(n) {
    v = [];
    center = [width / 2, height / 2];
    for (let i = 0; i < n; i++) {
        const theta = i * 2 * Math.PI / n;
        const x = center[0] + r * Math.cos(theta);
        const y = center[1] + r * Math.sin(theta);
        v.push(new Vertex(x, y));
    }
    segments = [];
    createSegments();
}



//These too are the segments between points on the circle.  They are long and there are binom(n,2) of them

function createSegments() {
    segments = [];

    for (let i = 0; i < v.length - 1; i++) {
        for (let j = i + 1; j < v.length; j++) {
            segments.push([
                v[i].x, v[i].y,
                v[j].x, v[j].y
            ]);
        }
    }
}

function drawSegments() {
  for (let i = 0; i < segments.length; ++i) {
    line(segments[i][0], segments[i][1], segments[i][2], segments[i][3]); //use P5 line() function
  }
}

//Find all segments along line PQ. Given that the intersections array and segments array is not empty.

function createEdges() {
  edgeArray = []; //start with it empty
  //First find all of the intersections that are on segment[i]
  for (let i = 0; i < segments.length; ++i) {
    let tempInts = []; //will hold just those intersections that are on segment i
    let P = [segments[i][0], segments[i][1]];
    let Q = [segments[i][2], segments[i][3]];
    for (j = 0; j < intersections.length; ++j) {
      // console.log(`d=${dist2LinePQ(P,Q,intersections[j])}, ${epsilon}`);
      // console.log(`intersection[${j}]=${intersections[j]}`);
      // console.log("P",P);
      if (dist2LinePQ(P, Q, intersections[j]) < epsilon) {
        print_ints(i, j);
        tempInts.push(intersections[j]);
        let dist2P = Math.sqrt((P[0] - intersections[j][0]) ** 2 + (P[1] - intersections[j][1]) ** 2);
        tempInts.push(dist2P);
      } //end if
    } //end for j
    tempInts = sortPointsByDistance(tempInts);//sort the tempInts that are on segment i by distance to P
    //if (tempInts.length > 0) { console.log(`tempInts:`, tempInts); }
    //tempInts has some points that are identical up to epsilon. We need to remove those.
    tempInts = removeRedundantPairs(tempInts);
    



    /* At this spot in the code, tempInts is a set of points along segment[i] from P to Q.
    It is ready to be cut up into edges. We want the number of edges in a regular n-gon with all diagonals
    drawn. An edge is considered to end when any intersection point or perimeter point is encountered.
    Suppose there are n intersection points along segment PQ, then n points in tempInts, means a total
    of n+1 edges counting from a perimeter point to a perimeter point.  At the end, there are still exactly n additional
    edges between each adjacent perimeter point. 
    
    When n is even and >4, we have a problem with symmetry and we are creating some redundant edges. To resolve
    that, I would just like to remove redundant edges, but they are likely to be something like
    edgeA = (Px,Py, Qx,Qy) and edgeB = (Qx,Qy,Px,Py) and since they are floats, comparisons have to be
    made such that points are equal if they are within epsilon of each other. Also, of course, I need to keep
    one of each redundant edge.
    */

    if (tempInts.length > 0) {    
      tempInts.unshift(P); //adds P to the beginning of tempInts.
      tempInts.push(Q); //adds Q to the end of tempInts
      for (let k = 0; k < tempInts.length - 1; ++k) {
        edgeArray.push([tempInts[k][0], tempInts[k][1], tempInts[k + 1][0], tempInts[k + 1][1]]);
      }
      //console.log(`edgeArray.length is ${edgeArray.length}`); // & expected is ${}
      //console.log(edgeArray);

    }
    //console.log(""); //separate the segments  
  }
  //-----add the circular egdes
  for (let k = 0; k < v.length - 1; ++k) {
    edgeArray.push([v[k].x, v[k].y, v[k + 1].x, v[k + 1].y]);
  }
  //add the last circular edge.
  edgeArray.push([v[v.length - 1].x, v[v.length - 1].y, v[0].x, v[0].y]);
  //-----
  console.log(`Final edge count = ${edgeArray.length}`);
  console.log(edgeArray);
};


function print_ints(i, j) {
  console.log(`This intersect,(${intersections[j][0].toFixed(0)}, ${intersections[j][1].toFixed(0)})
is on segment[${segments[i][0].toFixed(0)},${segments[i][1].toFixed(0)},${segments[i][2].toFixed(0)},${segments[i][3].toFixed(0)}]`)
}

function sortPointsByDistance(data) {
  // Check if array has even length
  if (data.length % 2 !== 0) {
    throw new Error("Array must have an even number of elements");
  }
  // Create pairs of [point, distance]
  const pairs = [];
  for (let i = 0; i < data.length; i += 2) {
    pairs.push({
      point: data[i],
      distance: data[i + 1]
    });
  }
  // Sort by distance (ascending)
  pairs.sort((a, b) => a.distance - b.distance);

  // Return only the points
  return pairs.map(pair => pair.point);
}