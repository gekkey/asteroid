(function(){
	G = 6.6725985e-11;
	var App = window.App;

	var Game = App.Game = function(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")
		this.earth = new App.Earth();
		this.ship = new App.Ship(this.earth);
		this.asteroids = [];
		this.zoom = 0.001;
		this.time = 1;
		this.bindKeys();
	}

	Game.prototype.start = function() {
		setInterval(function(){
			this.draw();
		}.bind(this), 1000 / 60);

		setInterval(function(){
			this.step();
		}.bind(this), 1000 / 30);
	}

	Game.prototype.draw = function() {
		var ctx = this.ctx;
		var canvas = this.canvas;
		var earth = this.earth;
		var ship = this.ship;
		var zoom = this.zoom;
		var x, y;

		var w_offset = canvas.width/2,
			h_offset = canvas.height/2;
		var camera_x = ship.x,
			camera_y = ship.y;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// draw earth
		ctx.fillStyle = earth.color;
		ctx.beginPath();
		x = -camera_x * zoom + w_offset;
		y = -camera_y * zoom + h_offset;

		ctx.arc(x, y, earth.radius * zoom, 0, 2 * Math.PI);

		ctx.fill();
		ctx.closePath();

		// draw orbit projection
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		var origin = ship.focus;
		var sin = Math.sin(ship.argOfPeriapsis);
		var cos = Math.cos(ship.argOfPeriapsis);

		ctx.ellipse(x + (origin * sin) * zoom,
					y + (-origin * cos) * zoom,
					ship.semiminorAxis * zoom,
					ship.semimajorAxis * zoom,
					ship.argOfPeriapsis,
					0, 2 * Math.PI, false)
		ctx.stroke();

		ctx.closePath();

		// draw ship
		ctx.fillStyle = ship.color;
		var sin = Math.sin(ship.rotation);
		var cos = Math.cos(ship.rotation);
		x = w_offset;
		y = h_offset;

		if (zoom < 0.5) {
			zoom = 2;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#000000";
			ctx.arc(x, y, 20, 20, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.beginPath();
		ctx.moveTo(x + (7 * sin) * zoom, y + (-7 * cos) * zoom)
		ctx.lineTo(x + (-5 * cos + -5 * sin) * zoom, y + (-5 * sin + 5 * cos) * zoom)
		ctx.lineTo(x + (5 * cos + -5 * sin) * zoom, y + (5 * sin + 5 * cos) * zoom)

		ctx.fill();
		ctx.closePath();

		// Draw UI
		ctx.font = "14px Sans";
		ctx.fillText("Time Warp: " + this.time + "x", 10, 10)
	}

	Game.prototype.step = function() {
		kd.tick(this.time);

		var force = G * (this.earth.mass / Math.pow(this.ship.distance, 2));
		var angle = Math.atan2(this.ship.y, this.ship.x)
		var x = -Math.cos(angle) * force,
			y = -Math.sin(angle) * force;
		this.ship.accel(x, y, this.time);

		if (kd.UP.isDown())
			this.ship.applyThrust(this.time);
		if (kd.LEFT.isDown())
			this.ship.rotate(-1, this.time);
		if (kd.RIGHT.isDown())
			this.ship.rotate(1, this.time);
		if (kd.I.isDown())
			this.zoom = this.zoom * 1.1;
		if (kd.O.isDown())
			this.zoom = this.zoom / 1.1;

		this.ship.tick(this.time);
	}

	Game.prototype.bindKeys = function() {
		kd.S.press(function() {
			if (this.time > 1)
				this.time = this.time / 2;
		}.bind(this));
		kd.W.press(function() {
			if (this.time < 256)
				this.time = this.time * 2;
		}.bind(this));
	}
})();
