appendHTML("Div1", `A circle has $n$ points on its perimeter.
  A chord connects every point to every other point. However, the 
  points are arranged such that no three chords ever concur at a point.<br> 
  Three questions.
  <ol>
  <li>How many chords are drawn for $n$ points? $\\binom{n}{2}$</li>
  <li>How many intersecting segments exist inside the circle perimeter? $\\binom{n}{4}$</li>
  <li>How many chord bounded regions exist for $n$ points</li>
  </ol>
  `);

//globals
let r = 350 / 2;
let n = parseFloat(document.getElementById("numPts").value);
let theta;
let segments = [];
let pts = [];
let firstTime = true;
let center;
let allIntersections = [];
let regions = [];

function setup() {
  const cnvs = createCanvas(400, 400);
  cnvs.parent('cvs');

  create_n_Points(n);
  if (pts.length > 0 && firstTime) {
    firstTime = false;
  }
}

function draw() {
  background(250);
  
  // Draw the circle
  noFill();
  stroke(0);
  strokeWeight(1);
  circle(width / 2, height / 2, 2 * r);
  
  // Draw and color regions
  if (regions.length > 0) {
    drawRegions();
  }
  
  // Draw segment outlines on top
  if(segments.length > 0){
    drawSegments();
  }
  
  // Draw points on top
  for (let i = 0; i < pts.length; ++i) {
    fill(0);
    noStroke();
    circle(pts[i][0], pts[i][1], 5);
  }
}

function create_n_Points(n) {
  pts = [];
  center = [width / 2, height / 2];
  for (let i = 0; i < n; ++i) {
    theta = i * 2 * Math.PI / n;
    pts.push([center[0] + r * Math.cos(theta), center[1] + r * Math.sin(theta)])
  }
  segments = [];
  createSegments();
  findAllIntersections();
  findRegions();
  colorRegions();
}

function createSegments() {
  for (let i = 0; i < pts.length - 1; ++i) {
    for (let j = i + 1; j < pts.length; ++j) {
      segments.push([pts[i][0], pts[i][1], pts[j][0], pts[j][1]])
    }
  }
}

function drawSegments(){
  stroke(0, 0, 0, 80);
  strokeWeight(0.5);
  for(let i=0; i<segments.length; ++i){
    line(segments[i][0], segments[i][1], segments[i][2], segments[i][3]);
  }
}

// Find intersection point of two line segments
function findIntersection(s1, s2) {
  const x1 = s1[0], y1 = s1[1], x2 = s1[2], y2 = s1[3];
  const x3 = s2[0], y3 = s2[1], x4 = s2[2], y4 = s2[3];
  
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-10) return null;
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  
  if (t > 1e-10 && t < 1 - 1e-10 && u > 1e-10 && u < 1 - 1e-10) {
    const px = x1 + t * (x2 - x1);
    const py = y1 + t * (y2 - y1);
    const dist1 = dist(px, py, center[0], center[1]);
    if (dist1 < r - 0.1) {
      return [px, py];
    }
  }
  return null;
}

// Find all intersections
function findAllIntersections() {
  allIntersections = [];
  const eps = 0.01;
  
  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      const inter = findIntersection(segments[i], segments[j]);
      if (inter) {
        let duplicate = false;
        for (let k = 0; k < allIntersections.length; k++) {
          if (dist(allIntersections[k][0], allIntersections[k][1], inter[0], inter[1]) < eps) {
            duplicate = true;
            break;
          }
        }
        if (!duplicate) {
          allIntersections.push(inter);
        }
      }
    }
  }
}

function findRegions() {
  regions = [];
  
  // Handle special cases: n=2 (one chord splits circle into 2 regions)
  if (n === 2) {
    // Create two semicircle regions
    const angle1 = Math.atan2(pts[0][1] - center[1], pts[0][0] - center[0]);
    const angle2 = Math.atan2(pts[1][1] - center[1], pts[1][0] - center[0]);
    
    // Make sure we go the right way around
    let startAngle = angle1;
    let endAngle = angle2;
    if (startAngle > endAngle) {
      [startAngle, endAngle] = [endAngle, startAngle];
    }
    
    // Region 1: from angle1 to angle2 going clockwise
    const points1 = [];
    const numPoints = 20;
    // Add the two endpoints
    points1.push({x: pts[0][0], y: pts[0][1]});
    points1.push({x: pts[1][0], y: pts[1][1]});
    // Add arc points
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const angle = startAngle + t * (endAngle - startAngle);
      points1.push({
        x: center[0] + (r - 0.5) * Math.cos(angle),
        y: center[1] + (r - 0.5) * Math.sin(angle)
      });
    }
    
    // Region 2: from angle2 to angle1 going clockwise
    const points2 = [];
    points2.push({x: pts[1][0], y: pts[1][1]});
    points2.push({x: pts[0][0], y: pts[0][1]});
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const angle = endAngle + t * (2 * Math.PI - (endAngle - startAngle));
      points2.push({
        x: center[0] + (r - 0.5) * Math.cos(angle),
        y: center[1] + (r - 0.5) * Math.sin(angle)
      });
    }
    
    regions.push({
      points: points1,
      neighbors: new Set([1]),
      color: -1
    });
    regions.push({
      points: points2,
      neighbors: new Set([0]),
      color: -1
    });
    return;
  }
  
  // Handle n=3 (triangle splits circle into 4 regions - 3 arc regions + 1 central triangle)
  if (n === 3) {
    // First, find the central triangle (formed by the 3 chords)
    const centerTriangle = [
      {x: pts[0][0], y: pts[0][1]},
      {x: pts[1][0], y: pts[1][1]},
      {x: pts[2][0], y: pts[2][1]}
    ];
    
    // Create 4 regions: 1 central triangle + 3 arc regions
    const regionsList = [];
    
    // Central triangle
    regionsList.push({
      points: centerTriangle.slice(),
      neighbors: new Set([1, 2, 3]),
      color: -1
    });
    
    // Arc regions (between two circle points and the arc)
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3;
      const k = (i + 2) % 3;
      
      const arcPoints = [];
      arcPoints.push({x: pts[i][0], y: pts[i][1]});
      arcPoints.push({x: pts[j][0], y: pts[j][1]});
      
      // Add the arc
      const startAngle = Math.atan2(pts[i][1] - center[1], pts[i][0] - center[0]);
      const endAngle = Math.atan2(pts[j][1] - center[1], pts[j][0] - center[0]);
      
      let sA = startAngle;
      let eA = endAngle;
      let diff = eA - sA;
      if (diff < 0) diff += 2 * Math.PI;
      
      // Find the arc that doesn't contain the third point
      const thirdAngle = Math.atan2(pts[k][1] - center[1], pts[k][0] - center[0]);
      let containsThird = false;
      let testAngle = sA;
      while (testAngle < sA + diff) {
        if (Math.abs(testAngle - thirdAngle) < 0.01) {
          containsThird = true;
          break;
        }
        testAngle += 0.01;
      }
      
      if (containsThird) {
        // Use the other arc
        const temp = sA;
        sA = eA;
        eA = temp + 2 * Math.PI;
      }
      
      const numArcPoints = 20;
      for (let t = 0; t <= numArcPoints; t++) {
        const frac = t / numArcPoints;
        const angle = sA + frac * (eA - sA);
        arcPoints.push({
          x: center[0] + (r - 0.5) * Math.cos(angle),
          y: center[1] + (r - 0.5) * Math.sin(angle)
        });
      }
      
      const neighbors = new Set([0]); // adjacent to central triangle
      // Also adjacent to other arc regions
      for (let m = 1; m <= 3; m++) {
        if (m !== i + 1) {
          neighbors.add(m);
        }
      }
      
      regionsList.push({
        points: arcPoints,
        neighbors: neighbors,
        color: -1
      });
    }
    
    regions = regionsList;
    return;
  }
  
  // For n >= 4, use the graph traversal method
  // Build planar graph with all nodes and edges
  const eps = 0.01;
  const nodes = [];
  
  // Add all unique points (intersections + circle points)
  const allPoints = [...allIntersections, ...pts];
  for (let p of allPoints) {
    nodes.push({x: p[0], y: p[1], type: 'point'});
  }
  
  // For each segment, find all nodes on it and create edges
  const edges = [];
  for (let seg of segments) {
    const pointsOnSeg = [];
    
    for (let i = 0; i < nodes.length; i++) {
      if (isPointOnSegment(nodes[i].x, nodes[i].y, seg[0], seg[1], seg[2], seg[3], eps)) {
        const dx = seg[2] - seg[0];
        const dy = seg[3] - seg[1];
        const t = ((nodes[i].x - seg[0]) * dx + (nodes[i].y - seg[1]) * dy) / (dx*dx + dy*dy);
        pointsOnSeg.push({
          nodeIdx: i,
          x: nodes[i].x,
          y: nodes[i].y,
          t: t
        });
      }
    }
    
    pointsOnSeg.sort((a, b) => a.t - b.t);
    
    for (let i = 0; i < pointsOnSeg.length - 1; i++) {
      const p1 = pointsOnSeg[i];
      const p2 = pointsOnSeg[i+1];
      if (dist(p1.x, p1.y, p2.x, p2.y) > eps) {
        edges.push({
          from: p1.nodeIdx,
          to: p2.nodeIdx,
          fromX: p1.x, fromY: p1.y,
          toX: p2.x, toY: p2.y
        });
      }
    }
  }
  
  // Create adjacency list for the graph
  const adj = {};
  for (let i = 0; i < nodes.length; i++) {
    adj[i] = [];
  }
  for (let edge of edges) {
    adj[edge.from].push({to: edge.to, x: edge.toX, y: edge.toY});
    adj[edge.to].push({to: edge.from, x: edge.fromX, y: edge.fromY});
  }
  
  // Find all faces using face traversal
  const visitedEdges = new Set();
  
  for (let startNode = 0; startNode < nodes.length; startNode++) {
    for (let neighbor of adj[startNode]) {
      const dirKey = `${startNode},${neighbor.to}`;
      
      if (visitedEdges.has(dirKey)) continue;
      
      // Traverse face
      const face = [];
      let current = startNode;
      let next = neighbor.to;
      let startEdge = `${current},${next}`;
      let isValid = true;
      
      do {
        visitedEdges.add(`${current},${next}`);
        face.push({x: nodes[current].x, y: nodes[current].y});
        
        // Find the next edge: at node 'next', take the rightmost turn
        const nextNode = next;
        const currentNode = current;
        
        // Get all neighbors of nextNode except current
        const options = [];
        for (let n of adj[nextNode]) {
          if (n.to === currentNode) continue;
          options.push(n);
        }
        
        if (options.length === 0) {
          isValid = false;
          break;
        }
        
        // Calculate angles and choose the one that makes the smallest right turn
        const angleFrom = Math.atan2(nodes[currentNode].y - nodes[nextNode].y, 
                                     nodes[currentNode].x - nodes[nextNode].x);
        
        let bestOption = options[0];
        let bestAngle = Infinity;
        
        for (let opt of options) {
          const angleTo = Math.atan2(nodes[opt.to].y - nodes[nextNode].y,
                                     nodes[opt.to].x - nodes[nextNode].x);
          let angleDiff = angleTo - angleFrom;
          while (angleDiff <= 0) angleDiff += 2 * Math.PI;
          
          if (angleDiff < bestAngle) {
            bestAngle = angleDiff;
            bestOption = opt;
          }
        }
        
        current = next;
        next = bestOption.to;
        
        // Check if we're going outside the circle
        if (dist(nodes[next].x, nodes[next].y, center[0], center[1]) > r + 1) {
          isValid = false;
          break;
        }
        
      } while (`${current},${next}` !== startEdge && visitedEdges.size < edges.length * 2);
      
      // Only add face if it's valid (at least 3 vertices and inside circle)
      if (isValid && face.length >= 3) {
        // Check if centroid is inside circle
        let cx = 0, cy = 0;
        for (let p of face) { cx += p.x; cy += p.y; }
        cx /= face.length; cy /= face.length;
        
        if (dist(cx, cy, center[0], center[1]) < r - 0.5) {
          // Remove duplicate points
          const uniqueFace = [];
          for (let p of face) {
            let dup = false;
            for (let u of uniqueFace) {
              if (dist(p.x, p.y, u.x, u.y) < eps) {
                dup = true;
                break;
              }
            }
            if (!dup) uniqueFace.push(p);
          }
          
          if (uniqueFace.length >= 3) {
            regions.push({
              points: uniqueFace,
              neighbors: new Set(),
              color: -1
            });
          }
        }
      }
    }
  }
  
  // Build neighbor relationships
  for (let i = 0; i < regions.length; i++) {
    for (let j = i + 1; j < regions.length; j++) {
      if (shareEdge(regions[i].points, regions[j].points, eps)) {
        regions[i].neighbors.add(j);
        regions[j].neighbors.add(i);
      }
    }
  }
}

function isPointOnSegment(px, py, x1, y1, x2, y2, eps) {
  const d1 = dist(px, py, x1, y1);
  const d2 = dist(px, py, x2, y2);
  const d3 = dist(x1, y1, x2, y2);
  return Math.abs(d1 + d2 - d3) < eps;
}

function shareEdge(points1, points2, eps) {
  let common = 0;
  for (let p1 of points1) {
    for (let p2 of points2) {
      if (dist(p1.x, p1.y, p2.x, p2.y) < eps) {
        common++;
        break;
      }
    }
  }
  return common >= 2;
}

function colorRegions() {
  const colors = [
    [255, 80, 80],    // Red
    [80, 255, 80],    // Green
    [80, 80, 255],    // Blue
    [255, 255, 80],   // Yellow
    [255, 80, 255],   // Magenta
    [80, 255, 255]    // Cyan
  ];
  
  // Improved coloring with more color variety
  // First, sort regions by number of neighbors (most constrained first)
  const sortedIndices = regions.map((_, i) => i);
  sortedIndices.sort((a, b) => regions[b].neighbors.size - regions[a].neighbors.size);
  
  for (let idx of sortedIndices) {
    const usedColors = new Set();
    for (let neighborIdx of regions[idx].neighbors) {
      if (neighborIdx < regions.length && regions[neighborIdx].color >= 0) {
        usedColors.add(regions[neighborIdx].color);
      }
    }
    
    // Try to use all 6 colors evenly
    let colorIdx = -1;
    
    // First, try to find a color that's not used by neighbors and least used overall
    const colorUsage = new Array(colors.length).fill(0);
    for (let region of regions) {
      if (region.color >= 0) {
        colorUsage[region.color]++;
      }
    }
    
    // Try colors in order of least used first
    const colorOrder = Array.from({length: colors.length}, (_, i) => i);
    colorOrder.sort((a, b) => colorUsage[a] - colorUsage[b]);
    
    for (let c of colorOrder) {
      if (!usedColors.has(c)) {
        colorIdx = c;
        break;
      }
    }
    
    // If all colors are used by neighbors, use the least used color overall
    if (colorIdx === -1) {
      let minUsage = Infinity;
      for (let c = 0; c < colors.length; c++) {
        if (colorUsage[c] < minUsage) {
          minUsage = colorUsage[c];
          colorIdx = c;
        }
      }
    }
    
    regions[idx].color = colorIdx % colors.length;
  }
}

function drawRegions() {
  const colors = [
    [255, 0, 0],    // Red
    [0, 255, 0],    // Green
    [0, 0, 255],    // Blue
    [255, 255, 0],   // Yellow
    [255, 0, 255],   // Magenta
    [0, 255, 255]    // Cyan
  ];
  
  for (let region of regions) {
    if (region.points && region.points.length >= 3 && region.color >= 0) {
      const col = colors[region.color % colors.length];
      fill(col[0], col[1], col[2], 0);
      noStroke();
      beginShape();
      for (let p of region.points) {
        vertex(p.x, p.y);
      }
      endShape(CLOSE);
    }
  }
}