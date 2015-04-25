function cross_product(vec1, vec2) {
	return vec1[0] * vec2[1] - vec2[0] * vec1[1];
}

function dot_product(vec1, vec1) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

function magnitude(vec) {
	return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
}

function hyperbola(x, a, b) {
	return a * Math.sqrt(b*b + x*x) / b;
}

function hyperbolaPrime(x, a, b)  {
	return (a * x) / (b * Math.sqrt(b*b + x*x))
}

function ellipse(x, a, b) {
	return a * Math.sqrt(b*b - x*x) / b;
}

function inherit(childClass, parentClass){
	function Surrogate() {};
	Surrogate.prototype = parentClass.prototype;
	childClass.prototype = new Surrogate();
	childClass.prototype.constructor = childClass;
}
