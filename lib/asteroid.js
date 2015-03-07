(function(){
	var App = window.App;

	var Asteroid = App.Asteroid = function(body){
		this.body = body;
		this.color = '#FF0000';//'#181E21';
		this.x = 7500000;
		this.y = -7500000;
		this.x_vel = -1200;
		this.y_vel = 1000;
		this.radius = 10000 + Math.floor(Math.random() * 20000);
		this.distance = magnitude([this.x, this.y]);
		this.semimajorAxis = this.distance;
		this.semiminorAxis = 0;
		this.argOfPeriapsis = 1.5 * Math.PI;
	}

	Asteroid.prototype.accel = function(x, y, time){
		this.x_vel += x * time / 30;
		this.y_vel += y * time / 30;
	}

	Asteroid.prototype.tick = function(time){
		this.x += this.x_vel * time / 30;
		this.y += this.y_vel * time / 30;

		this.distance = magnitude([this.x, this.y]);
	}

})();
