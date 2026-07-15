
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
<p> In order to find regions we must first find intersections of all the lines. 
