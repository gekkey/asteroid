function cross_product(vec1, vec2) {
	return vec1[0] * vec2[1] - vec2[0] * vec1[1];
}

function dot_product(vec1, vec1) {
	return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

function magnitude(vec) {
	return Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
}
