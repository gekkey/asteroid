(function(){
	var App = window.App;

	var MovingBody = App.MovingBody = function(){
		this.quiet_collisions = [];
		this.loud_collisions = [];
	}

	MovingBody.prototype.calculateOP = function() {
		var Mu = this.body.Mu;

		var Rx = this.x;
		var Ry = this.y;
		var R = Math.sqrt(Rx*Rx + Ry*Ry); // position

		var Vx = this.x_vel;
		var Vy = this.y_vel;
		var V = Math.sqrt(Vx*Vx + Vy*Vy); // velocity

		var h = Rx*Vx + Ry*Vy; // specific relative angular momentum

		var Ex = V*V*Rx/Mu - h*Vx/Mu - Rx/R;
		var Ey = V*V*Ry/Mu - h*Vy/Mu - Ry/R;
		var E = Math.sqrt(Ex*Ex + Ey*Ey); // eccentricity

		var a = 1/(2 / R - V*V / Mu); // semi-major axis
		var b = a * Math.sqrt(E < 1 ? 1 - E*E : E*E - 1); // semi-minor axis
		var f = a * E;				// focus of ellipse
		var W = Math.atan2(Ey, Ex) - Math.PI/2; // argument of periapsis

		this.periapsis = a - f;
		this.apoapsis = a + f;
		this.semimajorAxis = a;
		this.semiminorAxis = b;
		this.argOfPeriapsis = W;
		this.eccentricity = E;
		this.focus = f;
	}

	MovingBody.prototype.drawOrbit = function(ctx, x, y, zoom) {
		var sin = Math.sin(this.argOfPeriapsis),
			cos = Math.cos(this.argOfPeriapsis),
			edge = magnitude([this.x, this.y]) + magnitude([ctx.canvas.width, ctx.canvas.height]) / zoom, // always greater than farthest point visible
			a = -this.semimajorAxis, b = this.semiminorAxis, c = this.periapsis,
			shape, last;
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.color;

		if (this.eccentricity < 1) {
			shape = ellipse;
		} else {
			shape = hyperbola;
		}

		ctx.beginPath();
		x1 = -edge, y1 = shape(x1, a, b);
		ctx.moveTo(x + (x1 * cos - (y1 + a + c) * sin) * zoom,
				   y + (x1 * sin + (y1 + a + c) * cos) * zoom);
		for (x1 += 10 / zoom; x1 <= edge; x1 += 10 / zoom) {
			y1 = shape(x1, a, b);
			ctx.lineTo(x + (x1 * cos - (y1 + a + c) * sin) * zoom,
					   y + (x1 * sin + (y1 + a + c) * cos) * zoom);
			if (y1 && !last) {
				last = [x1, y1];
			}
		}

		if (this.eccentricity < 1) {
			for (x1; x1 >= -edge; x1 -= 10 / zoom) {
				y1 = -shape(x1, a, b);
				ctx.lineTo(x + (x1 * cos - (y1 + a + c) * sin) * zoom,
						   y + (x1 * sin + (y1 + a + c) * cos) * zoom);
			}
			if (last) x1 = last[0], y1 = last[1];
			ctx.lineTo(x + (x1 * cos - (y1 + a + c) * sin) * zoom,
					   y + (x1 * sin + (y1 + a + c) * cos) * zoom);
		}
		ctx.stroke();
		ctx.closePath();
	}

	MovingBody.prototype.accel = function(x, y) {
		this.x_vel += x / 30;
		this.y_vel += y / 30;
	}

	MovingBody.prototype.collideQuietly = function(other_object) {
		this.quiet_collisions.push(other_object);
	}

	MovingBody.prototype.collideLoudly = function(other_body, callback) {
		this.loud_collisions.push([other_object, callback]);
	}

	MovingBody.prototype.checkCollisions = function() {
		var other_body, angle;
		// if collides quietly, stop this
		for (var i = this.quiet_collisions.length - 1; i >= 0; i--) {
			other_body = this.quiet_collisions[i];
			if (magnitude([this.x - other_body.x, this.y - other_body.y])
				< (this.radius + other_body.radius)) {
				angle = Math.atan2(this.x - other_body.x,
								   this.y - other_body.y)
				this.x = (this.radius + other_body.radius) * Math.sin(angle);
				this.y = (this.radius + other_body.radius) * Math.cos(angle);
				// TODO replace with vector rejection
				this.x_vel = other_body.x_vel;
				this.y_vel = other_body.y_vel;
				this.calculateOP();
			}
		}
		// if collides loudly, call callback passing other body, x and y of collision, and angle
		for (var i = this.loud_collisions.length - 1; i >= 0; i--) {
			other_body = this.loud_collisions[i][0];
			callback = this.loud_collisions[i][1];
			if (magnitude([this.x - other_body.x, this.y - other_body.y])
					< (this.radius + other_body.radius)) {
				angle = Math.atan2(this.x - other_body.x,
								   this.y - other_body.y)
				callback(other_body,
						 other_body.radius * Math.cos(angle),
						 other_body.radius * Math.sin(angle),
						 angle);
			}
		}
	}
})();
