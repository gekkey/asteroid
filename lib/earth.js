(function(){
	var App = window.App;

	Earth = App.Earth = function() {
		this.color = '#19B500'
		this.radius = 637810;
		this.mass = 5.97378250603408e+22;
		this.x = 0;
		this.y = 0;
		this.x_vel = 0;
		this.y_vel = 0;
		this.Mu = G * this.mass;
	}

	Earth.prototype.draw = function(ctx, x, y, zoom) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(x, y, this.radius * zoom, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
})();
