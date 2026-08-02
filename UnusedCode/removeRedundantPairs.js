function removeRedundantPairs(tempInts, epsilon = 0.0001) {
  // Snap a coordinate to the epsilon grid.
  const snap = v => Math.round(v / epsilon);
  const seen = new Set();
  const result = [];
  for (const pair of tempInts) {
    const [x1, y1] = pair;
    // Create a string key from the snapped coordinates
    const sx = snap(x1);
    const sy = snap(y1);
    const key = `${sx},${sy}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(pair);   // keep the first occurrence
    }
  }
  return result;
}