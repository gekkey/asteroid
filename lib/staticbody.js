(function(){
	var App = window.App;

	var StaticBody = App.StaticBody = function(){
		this.objects = [];
	}

	StaticBody.prototype.enterSOI = function(other_body){
		this.objects.push(other_body);
	}

	StaticBody.prototype.tick = function(time){
		this.objects.forEach((function(body) {
			var vec_x = body.x - this.x,
				vec_y = body.y - this.y,
				distance = magnitude([vec_x, vec_y]),
				force = G * (this.mass / (distance*distance)),
				angle = Math.atan2(vec_x, vec_y),
				y = -Math.cos(angle) * force * time,
				x = -Math.sin(angle) * force * time;
			body.accel(x, y);
		}).bind(this));
	}
})();
