class PlanarGraph {
    constructor() {
        this.vertices = []; // [{x, y, edges: []}]
        this.edges = []; // [{v1, v2, face: null, visited: false}]
        this.faces = []; // [{vertices: [], edges: [], isOuter: false}]
        this.vertexMap = new Map(); // key: "x,y" -> vertex index
    }

    addVertex(x, y) {
        const key = `${Math.round(x*1000)/1000},${Math.round(y*1000)/1000}`;
        if (this.vertexMap.has(key)) {
            return this.vertexMap.get(key);
        }
        const index = this.vertices.length;
        this.vertices.push({ x, y, edges: [] });
        this.vertexMap.set(key, index);
        return index;
    }

    addEdge(v1Index, v2Index) {
        // Check if edge already exists
        for (const edge of this.edges) {
            if ((edge.v1 === v1Index && edge.v2 === v2Index) ||
                (edge.v1 === v2Index && edge.v2 === v1Index)) {
                return edge;
            }
        }
        
        const edge = {
            v1: v1Index,
            v2: v2Index,
            face: null,
            visited: false,
            opposite: null // Will store the opposite direction edge
        };
        this.edges.push(edge);
        
        // Add to vertex adjacency lists
        this.vertices[v1Index].edges.push(this.edges.length - 1);
        this.vertices[v2Index].edges.push(this.edges.length - 1);
        
        return edge;
    }

    // Build the graph from segments and intersection points
    buildFromSegmentsAndIntersections(segments, intersections) {
        // First, add all intersection points as vertices
        const intersectionVertices = [];
        for (const inter of intersections) {
            const vIdx = this.addVertex(inter.point[0], inter.point[1]);
            intersectionVertices.push(vIdx);
        }

        // Add all segment endpoints as vertices
        for (const seg of segments) {
            this.addVertex(seg[0], seg[1]);
            this.addVertex(seg[2], seg[3]);
        }

        // For each original segment, split it at intersection points
        for (let segIdx = 0; segIdx < segments.length; segIdx++) {
            const seg = segments[segIdx];
            const p1 = { x: seg[0], y: seg[1] };
            const p2 = { x: seg[2], y: seg[3] };
            
            // Find all intersection points on this segment
            const pointsOnSegment = [];
            
            // Add endpoints
            pointsOnSegment.push({ x: p1.x, y: p1.y, isEndpoint: true });
            
            // Add intersection points
            for (const inter of intersections) {
                if (this.isPointOnSegment(inter.point, seg)) {
                    // Check if this point is not an endpoint
                    const isEndpoint = (Math.abs(inter.point[0] - p1.x) < 0.001 && Math.abs(inter.point[1] - p1.y) < 0.001) ||
                                      (Math.abs(inter.point[0] - p2.x) < 0.001 && Math.abs(inter.point[1] - p2.y) < 0.001);
                    if (!isEndpoint) {
                        pointsOnSegment.push({ x: inter.point[0], y: inter.point[1], isEndpoint: false });
                    }
                }
            }
            
            pointsOnSegment.push({ x: p2.x, y: p2.y, isEndpoint: true });
            
            // Sort points along the segment
            pointsOnSegment.sort((a, b) => {
                const distA = Math.sqrt((a.x - p1.x)**2 + (a.y - p1.y)**2);
                const distB = Math.sqrt((b.x - p1.x)**2 + (b.y - p1.y)**2);
                return distA - distB;
            });
            
            // Create edges between consecutive points
            for (let i = 0; i < pointsOnSegment.length - 1; i++) {
                const v1 = this.addVertex(pointsOnSegment[i].x, pointsOnSegment[i].y);
                const v2 = this.addVertex(pointsOnSegment[i+1].x, pointsOnSegment[i+1].y);
                this.addEdge(v1, v2);
            }
        }
    }

    isPointOnSegment(point, seg) {
        const eps = 0.001;
        const x1 = seg[0], y1 = seg[1];
        const x2 = seg[2], y2 = seg[3];
        const x = point[0], y = point[1];
        
        const cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
        if (Math.abs(cross) > eps) return false;
        
        const dot = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
        if (dot < 0) return false;
        
        const len2 = (x2 - x1)**2 + (y2 - y1)**2;
        if (dot > len2) return false;
        
        return true;
    }

    // Find all faces using half-edge traversal
    findFaces() {
        // For each edge, create both directions as half-edges
        const halfEdges = [];
        for (let i = 0; i < this.edges.length; i++) {
            const edge = this.edges[i];
            // Forward direction
            halfEdges.push({
                id: halfEdges.length,
                edgeIdx: i,
                from: edge.v1,
                to: edge.v2,
                face: null,
                visited: false,
                twin: null
            });
            // Backward direction
            halfEdges.push({
                id: halfEdges.length,
                edgeIdx: i,
                from: edge.v2,
                to: edge.v1,
                face: null,
                visited: false,
                twin: null
            });
        }
        
        // Set twin pointers
        for (let i = 0; i < halfEdges.length; i += 2) {
            halfEdges[i].twin = halfEdges[i+1];
            halfEdges[i+1].twin = halfEdges[i];
        }

        // Sort half-edges around each vertex by angle
        const vertexHalfEdges = new Map();
        for (const he of halfEdges) {
            if (!vertexHalfEdges.has(he.from)) {
                vertexHalfEdges.set(he.from, []);
            }
            vertexHalfEdges.get(he.from).push(he);
        }

        // Sort half-edges around each vertex by angle
        for (const [vIdx, hes] of vertexHalfEdges) {
            const v = this.vertices[vIdx];
            hes.sort((a, b) => {
                const angleA = Math.atan2(
                    this.vertices[a.to].y - v.y,
                    this.vertices[a.to].x - v.x
                );
                const angleB = Math.atan2(
                    this.vertices[b.to].y - v.y,
                    this.vertices[b.to].x - v.x
                );
                return angleA - angleB;
            });
        }

        // Find faces by traversing half-edges
        let faceCount = 0;
        const unvisited = new Set(halfEdges.map(he => he.id));
        
        while (unvisited.size > 0) {
            // Start with any unvisited half-edge
            const startId = unvisited.values().next().value;
            const start = halfEdges[startId];
            
            if (start.visited) {
                unvisited.delete(startId);
                continue;
            }
            
            // Create a new face
            const face = {
                id: faceCount++,
                halfEdges: [],
                vertices: [],
                edges: [],
                isOuter: false
            };
            
            // Traverse the face
            let current = start;
            let area = 0;
            const faceHalfEdges = [];
            
            do {
                current.visited = true;
                unvisited.delete(current.id);
                faceHalfEdges.push(current);
                face.vertices.push(current.from);
                
                // Add to area calculation
                const v1 = this.vertices[current.from];
                const v2 = this.vertices[current.to];
                area += v1.x * v2.y - v2.x * v1.y;
                
                // Find the next half-edge (the one just before the twin in CCW order)
                const nextVertex = current.to;
                const outgoing = vertexHalfEdges.get(nextVertex) || [];
                const twinId = current.twin.id;
                
                // Find the twin in the sorted list
                let twinIndex = -1;
                for (let i = 0; i < outgoing.length; i++) {
                    if (outgoing[i].id === twinId) {
                        twinIndex = i;
                        break;
                    }
                }
                
                // Next is the one before twin (CCW)
                const nextIndex = (twinIndex - 1 + outgoing.length) % outgoing.length;
                current = outgoing[nextIndex];
                
            } while (current.id !== start.id);
            
            // Determine if this is the outer face (clockwise traversal has negative area)
            face.isOuter = area < 0;
            face.halfEdges = faceHalfEdges;
            
            // Remove duplicate vertices (the last one is the same as the first)
            face.vertices = [...new Set(face.vertices)];
            
            // Get unique edges
            const edgeIds = new Set(faceHalfEdges.map(he => he.edgeIdx));
            face.edges = Array.from(edgeIds);
            
            this.faces.push(face);
        }

        // Filter out the outer face if we want only interior regions
        return this.faces.filter(f => !f.isOuter);
    }

    // Get faces as polygons for visualization
    getFacePolygons() {
        const polygons = [];
        for (const face of this.faces) {
            if (face.isOuter) continue;
            
            // Get vertices in order
            const polygon = [];
            for (const he of face.halfEdges) {
                polygon.push({
                    x: this.vertices[he.from].x,
                    y: this.vertices[he.from].y
                });
            }
            polygons.push(polygon);
        }
        return polygons;
    }

    // Calculate area of a face
    calculateFaceArea(face) {
        let area = 0;
        for (const he of face.halfEdges) {
            const v1 = this.vertices[he.from];
            const v2 = this.vertices[he.to];
            area += v1.x * v2.y - v2.x * v1.y;
        }
        return Math.abs(area) / 2;
    }
}

// Example usage with your segments
function findRegions(segments, intersections) {
    const graph = new PlanarGraph();
    graph.buildFromSegmentsAndIntersections(segments, intersections);
    const faces = graph.findFaces();
    
    // Calculate areas and sort
    const regions = faces.map(face => ({
        id: face.id,
        vertices: face.vertices.map(vIdx => graph.vertices[vIdx]),
        edges: face.edges.map(eIdx => graph.edges[eIdx]),
        area: graph.calculateFaceArea(face),
        polygon: graph.getFacePolygons()[face.id]
    }));
    
    // Sort by area (descending) - larger regions first
    regions.sort((a, b) => b.area - a.area);
    
    return regions;
}

// Your segments and intersections (from previous work)
const segments = [
    [375.0, 200.0, 200.0, 375.0],
    [375.0, 200.0, 25.0, 200.0],
    [375.0, 200.0, 200.0, 25.0],
    [200.0, 375.0, 25.0, 200.0],
    [200.0, 375.0, 200.0, 25.0],
    [25.0, 200.0, 200.0, 25.0]
];

// Your intersections (from earlier)
const intersections = [
    { point: [25.0, 200.0], segments: [1, 3, 5] },
    { point: [200.0, 25.0], segments: [2, 4, 5] },
    { point: [375.0, 200.0], segments: [0, 1, 2] },
    { point: [200.0, 375.0], segments: [0, 3, 4] },
    { point: [200.0, 200.0], segments: [1, 4] }
];

const regions = findRegions(segments, intersections);

console.log(`Found ${regions.length} regions:`);
regions.forEach((region, idx) => {
    console.log(`\nRegion ${idx + 1}:`);
    console.log(`  Area: ${region.area.toFixed(2)}`);
    console.log(`  Vertices:`);
    region.vertices.forEach(v => {
        console.log(`    (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
    });
});