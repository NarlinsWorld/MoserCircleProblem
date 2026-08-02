function intersectionPoint(seg1, seg2) {

    const P  = seg1.a;
    const P2 = seg1.b;

    const Q  = seg2.a;
    const Q2 = seg2.b;

    const ux = P2.x - P.x;
    const uy = P2.y - P.y;

    const vx = Q2.x - Q.x;
    const vy = Q2.y - Q.y;

    const den = ux * (-vy) + uy * vx;

    // Parallel (or essentially parallel)
    if (Math.abs(den) < epsilon)
        return null;

    const num = (P.x - Q.x) * (-uy)
              + (P.y - Q.y) * ux;

    const s = num / den;

    const x = Q.x + s * vx;
    const y = Q.y + s * vy;

    // Parameter on segment P
    const t =
        ((x - P.x) * ux + (y - P.y) * uy) /
        (ux * ux + uy * uy);

    // Reject if outside either segment.
    if (t < -epsilon || t > 1 + epsilon)
        return null;

    if (s < -epsilon || s > 1 + epsilon)
        return null;

    const vtemp = findOrCreateVertex(x, y);

    seg1.addIntersection(vtemp, t);
    seg2.addIntersection(vtemp, s);

    return vtemp;
}