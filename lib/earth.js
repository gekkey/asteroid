(function(){
	var App = window.App;

	Earth = App.Earth = function() {
		this.color = '#19B500'
		this.radius = 637100;
		this.atmosphere = 70000;
		this.mass = 5.97378250603408e+22;
		this.x = 0;
		this.y = 0;
		this.x_vel = 0;
		this.y_vel = 0;
		this.Mu = G * this.mass;
		this.super();
	}

	inherit(Earth, App.StaticBody);

	Earth.prototype.drawBackground = function(ctx, x, y, zoom) {
		var ir = this.radius * zoom;
		var or = ir + (this.atmosphere * zoom);
		var gradient = ctx.createRadialGradient(x, y, ir, x, y, or);
		gradient.addColorStop(0.2, 'rgba(135, 206, 250, 1)');
		gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
		ctx.fillStyle = gradient;
		ctx.beginPath()
		ctx.arc(x, y, or, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}

	Earth.prototype.draw = function(ctx, x, y, zoom) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(x, y, this.radius * zoom, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
})();
