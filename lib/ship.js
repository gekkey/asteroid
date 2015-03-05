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
		this.rotation = 0;
		this.thrust = 20;
		this.rotateSpeed = 3;

		this.semimajorAxis = this.body.radius + 1000000;
		this.semiminorAxis = this.body.radius;
		this.periapsis = this.body.radius + 100000;
		this.apoapsis = this.body.radius + 1000000;
		this.orbital_rotation = 45 * Math.PI/180;
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

		this.distance = magnitude([this.x, this.y]);
	}

	Ship.prototype.applyThrust = function(time) {
		this.x_vel += Math.sin(this.rotation) * this.thrust * time / 30;
		this.y_vel += -Math.cos(this.rotation) * this.thrust * time / 30;

		var M = this.body.mass;
		var m = this.mass;
		var Mu = this.body.Mu;

		var Rx = this.x;
		var Ry = this.y;
		var R = Math.sqrt(Rx*Rx + Ry*Ry); // position

		var Vx = this.x_vel;
		var Vy = this.y_vel;
		var V = Math.sqrt(Vx*Vx + Vy*Vy); // velocity

		var H = Rx*Vy - Ry*Vx; // angular momentum

		var Ex = Vy*H/Mu - Rx/R;
		var Ey = Vx*H/Mu - Ry/R;
		var a = 1/(2 / R - V*V / Mu); // semi-major axis
		var q = Rx*Vx + Ry*Vy;
		var Ex = 1 - R / a;
		var Ey = q / Math.sqrt(a * Mu);
		var E = Math.sqrt(Ex*Ex + Ey*Ey); // eccentricity

		var p = H*H / Mu;
		// var E = Math.sqrt(1 - p / a);  // eccentricity
		var b = a * Math.sqrt(1 - E*E); // semi-minor axis
		var f = a * E;				// focus of ellipse
		var W = Math.atan2(Ey, Ex); // argument of periapsis
		if (W<0) {W=2*Math.PI+W}

		var Periapsis = a - f;
		var Apoapsis = a + f;
		var Period = 2 * Math.PI * Math.sqrt((a*a*a / (G*(M + m))));

		this.semimajorAxis = a;
		this.semiminorAxis = b;
		this.argOfPeriapsis = W;
		this.focus = f;

		//console.log(Apoapsis, Periapsis, a, b, E, W);
	}

	Ship.prototype.rotate = function(dir, time) {
		this.rotation += dir * this.rotateSpeed * time * Math.PI/180;
	}
})();
