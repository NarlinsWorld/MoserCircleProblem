
# Mosers
\[ \sqrt{2} \]
<h2>Moser's Circle Problem</h2>
From Wikipedia: Moser's circle problem asks how many regions a circle can be divided into by choosing $$n$$ points along the circumference of the circle and joining each pair of points by a straight line.
As it happens, if the points are symmetrically spread around the circle, then for all even numbers after 4, three or more lines will intersect in the same point.  But the question asks for the maximum number of regions, so what has to be done is to adjust the points a bit so that they are not symmetrical. 
<a href="https://en.wikipedia.org/wiki/Moser%27s_circle_problem">Wiki link to Moser's</a>

The mathematical answer can be ascertained from many other places.  I will just give it with no explanation. 
$$
\binom{n}{4}+\binom{n}{2}+1
$$  
Just placing points on the circle and connecting them to all other points on the circle basically creates a Complete Graph, neglecting the circle. Furthermore, extending the lines outside the circle and to inifinity, but not having the circle, just expands the inifinite regions without creating any more of them.
<h3>Number of line segments</h3>
Since there is one line segement for every pair of points, then the permutations of points divided by two will give the number of segments. For example, six points numbered {1,2,3,4,5,6} can make pairs as follows:<br>
(1,2),(1,3),(1,4),(1,5),(1,6)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2,3),(2,4),(2,5),(2,6)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3,4),(3,5),(3,6)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(4,5),(4,6)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5,6)<br>
Which, of course is 15 points and is equal to $$\binom{6}{2}$$

The Diagonals of a Regular Polygon have been addressed quite well in this paper by Bjorn Poonen and Michael Rubenstein 1997: <a href="https://math.mit.edu/%7Epoonen/papers/ngon.pdf">Diagonals of A Regular Polygon</a>
<p> In order to find regions we must first find intersections of all the lines.</p>
A General Rule for Odd Polygons: The key result from the analysis by Poonen and Rubinstein is that the maximum number of diagonals that can meet at a single interior point (other than the center) is 2 if n is odd. This explicitly confirms that for all odd n, triple intersections are impossible.</p>

<p>History of the Proof: This wasn't immediately obvious. The problem was originally posed by the mathematician Steinhaus (H. Steinhaus: Problem 225, Colloq. Math. 5 (1958).) specifically for prime n (e.g., 5, 7, 11, 13). He asked if three diagonals could intersect in a regular p-gon when p is prime. The answer was proven to be "no" by Croft and Fowler in 1961.[H. T. Croft and M. Fowler: On a problem of Steinhaus about polygons, Proc. Camb. Phil. Soc. 57 (1961), 686–688.] The result was later extended to all odd n by Heineken. H. Heineken: Regelm¨assige Vielecke und ihre Diagonalen, Enseignement Math. (2), s´er. 8 (1962), 275–278.</p>

<p>Why Even n is Different: The situation is more complex for even-sided polygons. For example, all the longest diagonals (diameters) of a regular hexagon meet at the center, creating an intersection of three or more segments. This is why many sources focus on the odd n case as being the "simple" one.</p>

<p>The Mathematical Consequence: Because no three diagonals meet in an odd n-gon, every intersection point corresponds to a unique set of four vertices. This means the total number of interior intersection points is exactly the number of ways to choose 4 vertices from n, which is the binomial coefficient n choose 4</p> 
