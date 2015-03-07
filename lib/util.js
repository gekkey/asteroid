function cross_product(vec1, vec2) {
	return vec1[0] * vec2[1] - vec2[0] * vec1[1];
}

function dot_product(vec1, vec1) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

function magnitude(vec) {
	return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
}
