(function(){
	G = 6.6725985e-11;
	var App = window.App;

	var Game = App.Game = function(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")
		this.earth = new App.Earth();
		this.ship = new App.Ship(this.earth);
		this.asteroid = new App.Asteroid(this.earth);
		this.zoom = 0.001;
		this.time = 1;
		this.bgImage = new Image();
		this.bgImage.src = "images/space.jpg";
		this.bindKeys();
	}

	Game.prototype.start = function() {
		setInterval(function(){
			this.step();
			this.draw();
		}.bind(this), 1000 / 30);
	}

	Game.prototype.draw = function() {
		var ctx = this.ctx;
		var canvas = this.canvas;
		var earth = this.earth;
		var ship = this.ship;
		var asteroid = this.asteroid;
		var zoom = this.zoom;

		var w_offset = canvas.width/2,
			h_offset = canvas.height/2;
		var x = -ship.x * zoom + w_offset,
			y = -ship.y * zoom + h_offset;

		// background
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this.bgImage,
			w_offset - 1280 + ship.x/200000,
			h_offset - 720 + ship.y/200000);

		// atmosphere
		var ir = earth.radius * zoom;
		var or = ir + (ir * 0.1);
		var gradient = ctx.createRadialGradient(x, y, ir, x, y, or);
		gradient.addColorStop(0.2, 'rgba(135, 206, 250, 1)');
		gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
		ctx.fillStyle = gradient;
		ctx.beginPath()
		ctx.arc(x, y, or, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();

		// orbit projection
		ship.drawOrbit(ctx, x, y, zoom);
		asteroid.drawOrbit(ctx, x, y, zoom);

		// objects
		earth.draw(ctx, x, y, zoom);
		asteroid.draw(ctx, x, y, zoom);
		ship.draw(ctx, w_offset, h_offset, zoom);

		// UI
		ctx.font = "14px Sans";
		ctx.fillText("Time Warp: " + this.time + "x", 5, 19)
	}

	Game.prototype.step = function() {
		kd.tick(this.time);

		// apply gravity to ship
		var force = G * (this.earth.mass / Math.pow(this.ship.distance, 2));
		var angle = Math.atan2(this.ship.y, this.ship.x)
		var x = -Math.cos(angle) * force,
			y = -Math.sin(angle) * force;
		this.ship.accel(x, y, this.time);

		// collision detection
		if (this.ship.distance < this.earth.radius + 5) {
			this.ship.x = (this.earth.radius + 5) * Math.cos(angle);
			this.ship.y = (this.earth.radius + 5) * Math.sin(angle);
			this.ship.x_vel = 0;
			this.ship.y_vel = 0;
			this.ship.calculateOP();
		}

		// apply thrust to ship
		if (kd.UP.isDown())
			this.ship.applyThrust(this.time);
		if (kd.LEFT.isDown())
			this.ship.rotate(-1, this.time);
		if (kd.RIGHT.isDown())
			this.ship.rotate(1, this.time);

		// zoom in/out
		if (kd.Q.isDown())
			this.zoom = this.zoom * 1.1;
		if (kd.A.isDown())
			this.zoom = this.zoom / 1.1;

		// apply gravity to asteroid
		var force = G * (this.earth.mass / Math.pow(this.asteroid.distance, 2));
		var angle = Math.atan2(this.asteroid.y, this.asteroid.x)
		var x = -Math.cos(angle) * force,
			y = -Math.sin(angle) * force;
		this.asteroid.accel(x, y, this.time);

		this.ship.tick(this.time);
		this.asteroid.tick(this.time);
	}

	Game.prototype.bindKeys = function() {
		kd.S.press(function() {
			if (this.time > 1)
				this.time = this.time / 2;
		}.bind(this));
		kd.W.press(function() {
			if (this.time < 65536)
				this.time = this.time * 2;
		}.bind(this));
	}
})();
