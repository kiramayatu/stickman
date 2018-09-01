
var Entity = require('./Entity');
var World = require('./World');

var copy = require('vectors/copy')(2);


function Bullet(position, velocity, orientation, source) {
  this.position = position;
  this.velocity = velocity;
  this.orientation = orientation;
  this.source = source;
  this.damage = Bullet.DEFAULT_DAMAGE;

  this.distanceTraveled = 0;
  this.shouldExist = true;
}
require('../shared/base');
Bullet.inheritsFrom(Entity);


Bullet.VELOCITY_MAGNITUDE = 850;


Bullet.DEFAULT_DAMAGE = 1;


Bullet.MAX_TRAVEL_DISTANCE = 1000;


Bullet.HITBOX_SIZE = 10;

Bullet.create = function(position, direction, source) {
  var vx = Bullet.VELOCITY_MAGNITUDE * Math.cos(direction - Math.PI / 2);
  var vy = Bullet.VELOCITY_MAGNITUDE * Math.sin(direction - Math.PI / 2);
  return new Bullet(copy(position), [vx, vy], direction, source);
};


Bullet.prototype.update = function(clients) {
  this.parent.update.call(this);

  this.distanceTraveled += Bullet.VELOCITY_MAGNITUDE *
      this.updateTimeDifference / 1000;
  if (this.distanceTraveled > Bullet.MAX_TRAVEL_DISTANCE ||
      !World.isInside(this.getX(), this.getY())) {
    this.shouldExist = false;
    return;
  }

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (this.source != players[i].id &&
        players[i].isCollidedWith(this.getX(), this.getY(),
                                  Bullet.HITBOX_SIZE)) {
      players[i].damage(1);
      if (players[i].isDead()) {
        players[i].respawn();
        var killingPlayer = clients.get(this.source);
        killingPlayer.kills++;
      }
      this.shouldExist = false;
      return;
    }
  }
};

module.exports = Bullet;
