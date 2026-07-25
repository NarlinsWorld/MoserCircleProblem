class SweepLineIntersection {
    constructor(segments) {
        this.segments = segments.map((seg, index) => ({
            id: index,
            points: seg,
            p1: { x: seg[0], y: seg[1] },
            p2: { x: seg[2], y: seg[3] }
        }));
        this.intersectionPoints = new Map();
        this.status = [];
        this.processedPairs = new Set();
    }

    findIntersections() {
        // Create events for all segment endpoints
        const events = [];
        this.segments.forEach(seg => {
            // Use leftmost point as start event
            if (seg.p1.x < seg.p2.x || (seg.p1.x === seg.p2.x && seg.p1.y < seg.p2.y)) {
                events.push({ x: seg.p1.x, type: 'start', seg: seg });
                events.push({ x: seg.p2.x, type: 'end', seg: seg });
            } else {
                events.push({ x: seg.p2.x, type: 'start', seg: seg });
                events.push({ x: seg.p1.x, type: 'end', seg: seg });
            }
        });

        // Sort events by x-coordinate
        events.sort((a, b) => {
            if (a.x !== b.x) return a.x - b.x;
            return 0;
        });

        // Process events grouped by x-coordinate
        let i = 0;
        while (i < events.length) {
            const currentX = events[i].x;
            const eventsAtX = [];
            
            // Collect all events at this x-coordinate
            while (i < events.length && events[i].x === currentX) {
                eventsAtX.push(events[i]);
                i++;
            }
            
            this.processEventsAtX(eventsAtX, currentX);
        }

        // Convert map to array of intersections
        const result = [];
        this.intersectionPoints.forEach((value, key) => {
            const [x, y] = key.split(',').map(Number);
            result.push({
                point: [x, y],
                segments: Array.from(value.segments).sort((a, b) => a - b)
            });
        });

        return result;
    }

    processEventsAtX(eventsAtX, currentX) {
        // Separate events
        const startingSegments = [];
        const endingSegments = [];
        
        for (const event of eventsAtX) {
            if (event.type === 'start') {
                startingSegments.push(event.seg);
            } else {
                endingSegments.push(event.seg);
            }
        }
        
        // Get all segments that are currently in status
        const existingActive = new Set(this.status.map(s => s.id));
        const endingIds = new Set(endingSegments.map(s => s.id));
        
        // Create a complete list of all segments that will be active at this x
        // Include segments that are ending (they still exist at this x)
        const allActiveAtX = new Set([
            ...this.status.filter(s => !endingIds.has(s.id)).map(s => s.id),
            ...startingSegments.map(s => s.id),
            ...endingSegments.map(s => s.id)
        ]);
        
        // Build the full active list for checking intersections at this x
        let activeSegs = [];
        
        // Add existing active segments (excluding those that are ending)
        for (const seg of this.status) {
            if (allActiveAtX.has(seg.id)) {
                activeSegs.push(seg);
            }
        }
        
        // Add starting segments
        for (const seg of startingSegments) {
            if (!activeSegs.some(s => s.id === seg.id)) {
                activeSegs.push(seg);
            }
        }
        
        // Add ending segments
        for (const seg of endingSegments) {
            if (!activeSegs.some(s => s.id === seg.id)) {
                activeSegs.push(seg);
            }
        }
        
        // Sort by y-coordinate at this x
        activeSegs.sort((a, b) => {
            const yA = this.getYAtX(a, currentX);
            const yB = this.getYAtX(b, currentX);
            if (Math.abs(yA - yB) < 0.0001) {
                // Same y, sort by slope
                return this.getSlope(a) - this.getSlope(b);
            }
            return yA - yB;
        });
        
        // Check all adjacent pairs in the sorted order
        for (let j = 0; j < activeSegs.length - 1; j++) {
            // Check if these two segments should be compared
            const segA = activeSegs[j];
            const segB = activeSegs[j + 1];
            
            // Only compare if they're different segments
            if (segA.id !== segB.id) {
                this.checkAndRecordIntersection(segA, segB);
            }
        }
        
        // Also check intersections between segments that are at the same y
        // (this handles the case of multiple segments meeting at the same point)
        for (let j = 0; j < activeSegs.length; j++) {
            for (let k = j + 1; k < activeSegs.length; k++) {
                const segA = activeSegs[j];
                const segB = activeSegs[k];
                const yA = this.getYAtX(segA, currentX);
                const yB = this.getYAtX(segB, currentX);
                
                // If they're at the same y at this x, they might intersect here
                if (Math.abs(yA - yB) < 0.0001) {
                    this.checkAndRecordIntersection(segA, segB);
                }
            }
        }
        
        // Now update the status: remove ending segments
        this.status = this.status.filter(s => !endingIds.has(s.id));
        
        // Add starting segments that aren't already in status
        for (const startSeg of startingSegments) {
            if (!this.status.some(s => s.id === startSeg.id)) {
                const pos = this.findInsertPosition(startSeg);
                this.status.splice(pos, 0, startSeg);
            }
        }
    }

    findInsertPosition(seg) {
        let low = 0;
        let high = this.status.length - 1;
        const currentX = seg.p1.x;
        
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const midSeg = this.status[mid];
            const midY = this.getYAtX(midSeg, currentX);
            const segY = this.getYAtX(seg, currentX);
            
            if (segY < midY || (Math.abs(segY - midY) < 0.0001 && this.getSlope(seg) < this.getSlope(midSeg))) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }

    getYAtX(seg, x) {
        const x1 = seg.p1.x;
        const y1 = seg.p1.y;
        const x2 = seg.p2.x;
        const y2 = seg.p2.y;
        
        if (Math.abs(x1 - x2) < 0.0001) {
            return y1;
        }
        
        const t = (x - x1) / (x2 - x1);
        return y1 + t * (y2 - y1);
    }

    getSlope(seg) {
        const dx = seg.p2.x - seg.p1.x;
        if (Math.abs(dx) < 0.0001) return Infinity;
        return (seg.p2.y - seg.p1.y) / dx;
    }

    checkAndRecordIntersection(seg1, seg2) {
        if (seg1.id === seg2.id) return;
        
        const pairKey = [seg1.id, seg2.id].sort().join(',');
        if (this.processedPairs.has(pairKey)) return;
        this.processedPairs.add(pairKey);
        
        const seg1Points = [seg1.p1.x, seg1.p1.y, seg1.p2.x, seg1.p2.y];
        const seg2Points = [seg2.p1.x, seg2.p1.y, seg2.p2.x, seg2.p2.y];
        
        if (hasIntersect(seg1Points, seg2Points)) {
            const point = intersectionPoint(
                seg1.p1.x, seg1.p1.y, seg1.p2.x, seg1.p2.y,
                seg2.p1.x, seg2.p1.y, seg2.p2.x, seg2.p2.y
            );
            
            const roundedX = Math.round(point[0] * 1000) / 1000;
            const roundedY = Math.round(point[1] * 1000) / 1000;
            const key = `${roundedX},${roundedY}`;
            
            if (!this.intersectionPoints.has(key)) {
                this.intersectionPoints.set(key, {
                    point: [roundedX, roundedY],
                    segments: new Set()
                });
            }
            
            this.intersectionPoints.get(key).segments.add(seg1.id);
            this.intersectionPoints.get(key).segments.add(seg2.id);
        }
    }
}

/* My test segments
const segments = [
    [375.0, 200.0, 200.0, 375.0],
    [375.0, 200.0, 25.0, 200.0],
    [375.0, 200.0, 200.0, 25.0],
    [200.0, 375.0, 25.0, 200.0],
    [200.0, 375.0, 200.0, 25.0],
    [25.0, 200.0, 200.0, 25.0]
];

const sweepLine = new SweepLineIntersection(segments);
const intersections = sweepLine.findIntersections();

console.log('Found intersections:');
intersections.forEach(i => {
    console.log(`Point (${i.point[0].toFixed(2)}, ${i.point[1].toFixed(2)}) contains segments: ${i.segments.join(', ')}`);
});
*/