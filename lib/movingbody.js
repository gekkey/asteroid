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

	MovingBody.prototype.drawOrbit = function(ctx, cam_x, cam_y, zoom) {
		if (this.eccentricity < 1) {
			var sin_f = Math.sin,
				cos_f = Math.cos;
		} else {
			var sin_f = function(x){return -Math.sinh(x);},
				cos_f = function(x){return -Math.cosh(x);};
		}
		var a = -this.semimajorAxis, b = this.semiminorAxis, c = this.periapsis,
			x = a * cos_f(0),
			y = b * sin_f(0),
			sin = Math.sin(this.argOfPeriapsis + Math.PI / 2),
			cos = Math.cos(this.argOfPeriapsis + Math.PI / 2);

		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(cam_x + ((x + a + c) * cos - y * sin) * zoom,
				   cam_y + ((x + a + c) * sin + y * cos) * zoom);
		for (var t = 0; t <= 2 * Math.PI; t += Math.PI / 16) {
			x = a * cos_f(t),
			y = b * sin_f(t);
			ctx.lineTo(cam_x + ((x + a + c) * cos - y * sin) * zoom,
					   cam_y + ((x + a + c) * sin + y * cos) * zoom);
		}
		if (this.eccentricity < 1) {
			x = a * cos_f(0);
			y = b * sin_f(0);
			ctx.lineTo(cam_x + ((x + a + c) * cos - y * sin) * zoom,
					   cam_y + ((x + a + c) * sin + y * cos) * zoom);
		} else {
			for (var t = -2 * Math.PI; t <= Math.PI; t += Math.PI / 16) {
				x = a * cos_f(t),
				y = b * sin_f(t);
				ctx.lineTo(cam_x + ((x + a + c) * cos - y * sin) * zoom,
						   cam_y + ((x + a + c) * sin + y * cos) * zoom);
			}
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

	MovingBody.prototype.collideLoudly = function(other_object, callback) {
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
