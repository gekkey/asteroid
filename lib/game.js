(function(){
	G = 6.6725985e-11;
	var App = window.App;

	var Game = App.Game = function(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")
		this.objects = [];
		this.zoom = 1;
		this.time = 1;
		this.bgImage = new Image();
		this.bgImage.src = "images/space.jpg";
		this.bindKeys();
	}

	Game.prototype.start = function() {
		var earth = new App.Earth(),
			ship = new App.Ship(earth),
			asteroid = new App.Asteroid(earth);
		this.objects = [earth, ship, asteroid];
		this.focus = ship;
		ship.collideQuietly(earth);
		setInterval(function(){
			this.step();
			this.draw();
		}.bind(this), 1000 / 30);
	}

	Game.prototype.draw = function() {
		var ctx = this.ctx;
		var canvas = this.canvas;
		var zoom = this.zoom;

		var w_offset = canvas.width/2,
			h_offset = canvas.height/2;
		var x = -this.focus.x * zoom + w_offset,
			y = -this.focus.y * zoom + h_offset;

		// background
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this.bgImage,
			w_offset - 1280 + this.focus.x/800000,
			h_offset - 720 + this.focus.y/800000);

		// objects
		this.objects.forEach(function(obj) {
			obj.drawBackground && obj.drawBackground(ctx, x, y, zoom);
		});
		this.objects.forEach(function(obj) {
			obj.drawOrbit && obj.drawOrbit(ctx, x, y, zoom);
		});
		this.objects.forEach(function(obj) {
			obj.draw && obj.draw(ctx, x, y, zoom);
		});

		// UI
		ctx.font = "14px Sans";
		ctx.fillText("Time Warp: " + this.time + "x", 5, 19)
	}

	Game.prototype.step = function() {
		kd.tick(this.time);
		this.objects.forEach((function(body){
			body.tick(this.time);
		}).bind(this));

		// zoom in/out
		if (kd.Q.isDown())
			this.zoom = this.zoom * 1.1;
		if (kd.A.isDown())
			this.zoom = this.zoom / 1.1;
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
