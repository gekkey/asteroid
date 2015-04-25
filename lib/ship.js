(function(){
	var App = window.App;

	var Ship = App.Ship = function(body){
		this.body = body;
		this.color = '#888888';
		this.radius = 7;
		this.x = 0;
		this.y = -(this.body.radius + 10);
		this.x_vel = 0;
		this.y_vel = 0;
		this.r_vel = 0;
		this.rotation = 0;
		this.thrust = 20;

		this.calculateOP();
		this.distance = magnitude([this.x, this.y]);
	}

	inherit(Ship, App.MovingBody);

	Ship.prototype.accel = function(x, y, time) {
		this.x_vel += x * time / 30;
		this.y_vel += y * time / 30;
	}

	Ship.prototype.tick = function(time) {
		this.x += this.x_vel * time / 30;
		this.y += this.y_vel * time / 30;
		this.rotation += this.r_vel * Math.PI/180;
		this.r_vel /= 1.1;

		this.distance = magnitude([this.x, this.y]);
	}

	Ship.prototype.applyThrust = function(time) {
		this.x_vel += Math.sin(this.rotation) * this.thrust * time / 30;
		this.y_vel += -Math.cos(this.rotation) * this.thrust * time / 30;
		this.calculateOP()
	}

	Ship.prototype.rotate = function(dir) {
		this.r_vel += dir;
	}

	Ship.prototype.draw = function(ctx, x, y, zoom) {
		ctx.fillStyle = this.color;
		var sin = Math.sin(this.rotation);
		var cos = Math.cos(this.rotation);

		if (zoom < 0.5) {
			zoom = 1;
		}
		ctx.beginPath();
		ctx.moveTo(x + (7 * sin) * zoom, y + (-7 * cos) * zoom)
		ctx.lineTo(x + (-5 * cos + -5 * sin) * zoom, y + (-5 * sin + 5 * cos) * zoom)
		ctx.lineTo(x + (5 * cos + -5 * sin) * zoom, y + (5 * sin + 5 * cos) * zoom)

		ctx.fill();
		ctx.closePath();
	}
})();
