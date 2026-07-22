/* This has not been tested and probably does not work.
A sweep line algorithm to find intersecting segments */
class BentleyOttmann {
    constructor(segments) {
        this.segments = segments.map((seg, index) => ({
            id: index,
            p1: { x: seg[0], y: seg[1] },
            p2: { x: seg[2], y: seg[3] }
        }));
        this.intersections = [];
        this.processedPairs = new Set();
        this.tolerance = 0.0001;
    }

    findIntersections() {
        // Create events for all endpoints
        const events = [];
        this.segments.forEach(seg => {
            if (seg.p1.x < seg.p2.x || (seg.p1.x === seg.p2.x && seg.p1.y < seg.p2.y)) {
                events.push({ x: seg.p1.x, y: seg.p1.y, type: 'start', seg: seg });
                events.push({ x: seg.p2.x, y: seg.p2.y, type: 'end', seg: seg });
            } else {
                events.push({ x: seg.p2.x, y: seg.p2.y, type: 'start', seg: seg });
                events.push({ x: seg.p1.x, y: seg.p1.y, type: 'end', seg: seg });
            }
        });

        // Sort events by x, then y
        events.sort((a, b) => {
            if (Math.abs(a.x - b.x) > this.tolerance) return a.x - b.x;
            return a.y - b.y;
        });

        const status = []; // Ordered list of active segments by y at current x

        let i = 0;
        while (i < events.length) {
            const currentX = events[i].x;
            const eventsAtX = [];
            
            while (i < events.length && Math.abs(events[i].x - currentX) < this.tolerance) {
                eventsAtX.push(events[i]);
                i++;
            }

            // Process events at this x
            this.processEventsAtX(eventsAtX, currentX, status);
        }

        return this.intersections;
    }

    processEventsAtX(eventsAtX, currentX, status) {
        const starts = eventsAtX.filter(e => e.type === 'start');
        const ends = eventsAtX.filter(e => e.type === 'end');

        // Remove ending segments first
        for (const event of ends) {
            const idx = status.findIndex(s => s.id === event.seg.id);
            if (idx !== -1) status.splice(idx, 1);
        }

        // Get all segments that are active at this x
        const activeSegments = [...status];
        for (const event of starts) {
            if (!activeSegments.some(s => s.id === event.seg.id)) {
                activeSegments.push(event.seg);
            }
        }

        // Sort active segments by y at current x
        activeSegments.sort((a, b) => {
            const yA = this.getYAtX(a, currentX);
            const yB = this.getYAtX(b, currentX);
            return yA - yB;
        });

        // Check all pairs that could intersect
        // For each segment, check with segments that are close in y-order
        for (let j = 0; j < activeSegments.length; j++) {
            const segA = activeSegments[j];
            const yA = this.getYAtX(segA, currentX);
            
            // Look ahead up to 10 positions (or until y difference is too large)
            for (let k = 1; k < Math.min(10, activeSegments.length - j); k++) {
                const segB = activeSegments[j + k];
                const yB = this.getYAtX(segB, currentX);
                
                // If y difference is large, break (segments can't intersect)
                if (Math.abs(yA - yB) > 50) break;
                
                this.checkAndRecordIntersection(segA, segB);
            }
        }

        // Insert starting segments into status
        for (const event of starts) {
            if (!status.some(s => s.id === event.seg.id)) {
                const pos = this.findInsertPosition(status, event.seg, currentX);
                status.splice(pos, 0, event.seg);
            }
        }
    }

    findInsertPosition(status, seg, currentX) {
        let low = 0;
        let high = status.length - 1;
        const segY = this.getYAtX(seg, currentX);
        
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const midSeg = status[mid];
            const midY = this.getYAtX(midSeg, currentX);
            
            if (segY < midY || (Math.abs(segY - midY) < this.tolerance && this.getSlope(seg) < this.getSlope(midSeg))) {
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
        
        if (Math.abs(x1 - x2) < this.tolerance) {
            return y1;
        }
        
        const t = (x - x1) / (x2 - x1);
        return y1 + t * (y2 - y1);
    }

    getSlope(seg) {
        const dx = seg.p2.x - seg.p1.x;
        if (Math.abs(dx) < this.tolerance) return Infinity;
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
            
            // Check if this is an endpoint intersection (on the circle)
            const isEndpoint = this.isEndpoint(seg1, point) || this.isEndpoint(seg2, point);
            
            if (!isEndpoint) {
                const roundedX = Math.round(point[0] * 1000) / 1000;
                const roundedY = Math.round(point[1] * 1000) / 1000;
                
                // Check for duplicate
                const duplicate = this.intersections.find(i => 
                    Math.abs(i.point[0] - roundedX) < this.tolerance && 
                    Math.abs(i.point[1] - roundedY) < this.tolerance
                );
                
                if (duplicate) {
                    if (!duplicate.segments.includes(seg1.id)) duplicate.segments.push(seg1.id);
                    if (!duplicate.segments.includes(seg2.id)) duplicate.segments.push(seg2.id);
                    duplicate.segments.sort((a, b) => a - b);
                } else {
                    this.intersections.push({
                        point: [roundedX, roundedY],
                        segments: [seg1.id, seg2.id]
                    });
                }
            }
        }
    }

    isEndpoint(seg, point) {
        return (Math.abs(point[0] - seg.p1.x) < this.tolerance && Math.abs(point[1] - seg.p1.y) < this.tolerance) ||
               (Math.abs(point[0] - seg.p2.x) < this.tolerance && Math.abs(point[1] - seg.p2.y) < this.tolerance);
    }
}

// Test with your 5-point data
const bt = new BentleyOttmann(segments5);
const intersections2 = bt.findIntersections();

console.log(`\nBentley-Ottmann found ${intersections2.length} intersection(s) NOT on the circle:`);
intersections2.forEach((i, idx) => {
    console.log(`${idx + 1}. Point (${i.point[0].toFixed(2)}, ${i.point[1].toFixed(2)}) between segments: ${i.segments.join(', ')}`);
});