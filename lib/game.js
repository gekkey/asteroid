(function(){
	G = 6.6725985e-11;
	var App = window.App;

	var Game = App.Game = function(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")
		this.bgImage = new Image();
		this.bgImage.src = "images/space.jpg";
		this.objects = [];
		this.uiElements = [];
		this.zoom = 1;
		this.time = 1;
		this.score = 0;
		this.bindKeys();
		this.createUI();
		this.createObjects();
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

	Game.prototype.createUI = function() {
		this.uiElements.push((function(ctx) {
			ctx.font = "14px Sans";
			ctx.fillText("Time Warp: " + this.time + "x", 5, 19);
		}).bind(this));
		this.uiElements.push((function(ctx) {
			var score = Math.floor(this.score),
				x = ctx.canvas.width - (score.toString().length + 7) * 8.3;
			ctx.font = "14px Sans";
			ctx.fillText("Score: " + score, x, 19);
		}).bind(this));
	}

	Game.prototype.createObjects = function() {
		var earth = new App.Earth(),
			ship = new App.Ship(earth),
			asteroid = new App.Asteroid(earth);
		this.objects = [earth, ship, asteroid];
		this.focus = ship;

		// register collisions
		ship.collideQuietly(earth);
		asteroid.collideLoudly(earth, (function(earth, x, y, angle) {
			asteroid.loud_collisions = [];
			this.end();
		}).bind(this));
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
		this.uiElements.forEach(function(cb){ cb(ctx); });
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
		this.score += this.time / 30;
	}

	Game.prototype.end = function() {
		this.time = 0;
		this.uiElements.push((function(ctx) {
			var x = ctx.canvas.height / 2,
				y = ctx.canvas.width / 2;

			ctx.fillStyle = "#BB2222";
			ctx.font = "36px Sans";
			ctx.fillText("YOU LOSE", 5, y)
			ctx.fillText("Score: " + Math.floor(this.score), 5, y + 40)
		}).bind(this));
	}
})();
