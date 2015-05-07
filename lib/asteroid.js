(function(){
	var App = window.App;

	var Asteroid = App.Asteroid = function(body){
		this.body = body;
		this.color = '#AAAAAA';//'#181E21';
		this.x = 7500000;
		this.y = -7500000;
		this.x_vel = -1200;
		this.y_vel = 1000;
		this.radius = 173700;
		this.semimajorAxis = 0;
		this.semiminorAxis = 0;
		this.argOfPeriapsis = 1.5 * Math.PI;

		this.calculateOP();
		this.super();
		body.enterSOI(this);
	}

	inherit(Asteroid, App.MovingBody);

	Asteroid.prototype.accel = function(x, y, time){
		this.x_vel += x * time / 30;
		this.y_vel += y * time / 30;
	}

	Asteroid.prototype.tick = function(time){
		this.x += this.x_vel * time / 30;
		this.y += this.y_vel * time / 30;
	}

	Asteroid.prototype.draw = function(ctx, x, y, zoom) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(x + this.x * zoom, y + this.y * zoom, this.radius * zoom, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
})();
