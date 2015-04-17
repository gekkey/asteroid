(function(){
	var App = window.App;

	var Ship = App.Ship = function(body){
		this.body = body;
		this.color = '#888888';
		this.mass = 1;
		this.x = 0;
		this.y = -(this.body.radius + 10);
		this.x_vel = 0;
		this.y_vel = 0;
		this.r_vel = 0;
		this.rotation = 0;
		this.thrust = 20;

		this.semimajorAxis = this.y;
		this.semiminorAxis = 0;
		this.apoapsis = this.y;
		this.periapsis = 0;
		this.eccentricity = 0;
		this.distance = -this.y;
	}

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

	Ship.prototype.calculateOP = function() {
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
		var b = a * Math.sqrt(1 - E*E); // semi-minor axis
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

	Ship.prototype.rotate = function(dir) {
		this.r_vel += dir;
	}
})();
