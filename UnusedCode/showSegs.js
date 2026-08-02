function showSegs() {
  stroke(0); // Black lines
  strokeWeight(1);
  line(circles[0].x, circles[0].y, circles[1].x, circles[1].y);
  line(circles[2].x, circles[2].y, circles[3].x, circles[3].y);
  noStroke(); // Reset stroke for other drawing
}