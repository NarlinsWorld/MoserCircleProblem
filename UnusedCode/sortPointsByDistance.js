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