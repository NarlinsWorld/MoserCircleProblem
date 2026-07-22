function findCircleChordIntersections(segments) {
    // Group segments by their endpoints to identify all points on the circle
    const endpoints = new Map();
    segments.forEach((seg, idx) => {
        const p1 = `${seg[0]},${seg[1]}`;
        const p2 = `${seg[2]},${seg[3]}`;
        if (!endpoints.has(p1)) endpoints.set(p1, new Set());
        if (!endpoints.has(p2)) endpoints.set(p2, new Set());
        endpoints.get(p1).add(idx);
        endpoints.get(p2).add(idx);
    });
    
    // Get all unique circle points
    const circlePoints = Array.from(endpoints.keys()).map(p => {
        const [x, y] = p.split(',').map(Number);
        return { x, y, segments: Array.from(endpoints.get(p)) };
    });
    
    // Sort circle points by angle around center
    // First find center (average of all points)
    const center = { x: 0, y: 0 };
    circlePoints.forEach(p => { center.x += p.x; center.y += p.y; });
    center.x /= circlePoints.length;
    center.y /= circlePoints.length;
    
    // Sort by angle
    circlePoints.sort((a, b) => {
        const angleA = Math.atan2(a.y - center.y, a.x - center.x);
        const angleB = Math.atan2(b.y - center.y, b.x - center.x);
        return angleA - angleB;
    });
    
    // For each pair of segments, check if they intersect
    const intersections = [];
    const processedPairs = new Set();
    
    for (let i = 0; i < segments.length; i++) {
        for (let j = i + 1; j < segments.length; j++) {
            const pairKey = `${i},${j}`;
            if (processedPairs.has(pairKey)) continue;
            processedPairs.add(pairKey);
            
            if (hasIntersect(segments[i], segments[j])) {
                const point = intersectionPoint(
                    segments[i][0], segments[i][1], segments[i][2], segments[i][3],
                    segments[j][0], segments[j][1], segments[j][2], segments[j][3]
                );
                
                // Check if this point is on the circle (at an endpoint)
                const isOnCircle = isPointOnCircle(point, circlePoints);
                
                if (!isOnCircle) {
                    const roundedX = Math.round(point[0] * 1000) / 1000;
                    const roundedY = Math.round(point[1] * 1000) / 1000;
                    
                    // Check for duplicate intersections
                    const duplicate = intersections.find(i => 
                        Math.abs(i.point[0] - roundedX) < 0.001 && 
                        Math.abs(i.point[1] - roundedY) < 0.001
                    );
                    
                    if (duplicate) {
                        if (!duplicate.segments.includes(i)) duplicate.segments.push(i);
                        if (!duplicate.segments.includes(j)) duplicate.segments.push(j);
                        duplicate.segments.sort((a, b) => a - b);
                    } else {
                        intersections.push({
                            point: [roundedX, roundedY],
                            segments: [i, j]
                        });
                    }
                }
            }
        }
    }
    
    return intersections;
}

function isPointOnCircle(point, circlePoints) {
    const eps = 0.001;
    return circlePoints.some(p => 
        Math.abs(point[0] - p.x) < eps && Math.abs(point[1] - p.y) < eps
    );
}

/* Test with your 5-point data
const segments5 = [
    [375.0, 200.0, 254.1, 366.4],
    [375.0, 200.0, 58.4, 302.9],
    [375.0, 200.0, 58.4, 97.1],
    [375.0, 200.0, 254.1, 33.6],
    [254.1, 366.4, 58.4, 302.9],
    [254.1, 366.4, 58.4, 97.1],
    [254.1, 366.4, 254.1, 33.6],
    [58.4, 302.9, 58.4, 97.1],
    [58.4, 302.9, 254.1, 33.6],
    [58.4, 97.1, 254.1, 33.6]
];

const sweepLine = new SweepLineCircleIntersections(segments5);
const intersections = sweepLine.findIntersections();

console.log(`Found ${intersections.length} intersection(s) NOT on the circle:`);
intersections.forEach((i, idx) => {
    console.log(`${idx + 1}. Point (${i.point[0].toFixed(2)}, ${i.point[1].toFixed(2)}) between segments: ${i.segments.join(', ')}`);
});
*/