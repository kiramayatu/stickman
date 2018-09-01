var Bullet = require('./Bullet');
var Entity = require('./Entity');
var Powerup = require('./Powerup');
var World = require('./World');

var Util = require('../shared/Util');


function Player(position, orientation, name, id) {
  this.position = position;
  this.velocity = [0, 0];
  this.acceleration = [0, 0];

  this.orientation = orientation;
  this.turretAngle = orientation;
  this.name = name;
  this.id = id;

  this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE;
  this.turnRate = 0;
  this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
  this.lastShotTime = 0;
  this.health = Player.MAX_HEALTH;
  /**
   * this.powerups is a JSON Object of the format:
   * { 'powerup' : { 'name' : name,
   *                 'data' : data,
   *                 'expirationTime' : expirationTime },
   *   'powerup' : { 'name' : name,
   *                 'data' : data,
   *                 'expirationTime' : expirationTime }
   * }
   */
  this.powerups = {};
  this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;

  this.kills = 0;
  this.deaths = 0;
}
require('../shared/base');
Player.inheritsFrom(Entity);
Player.TURN_RATE = 0.005;
Player.DEFAULT_VELOCITY_MAGNITUDE = 300;
Player.DEFAULT_SHOT_COOLDOWN = 800;
Player.DEFAULT_HITBOX_SIZE = 20;
Player.SHIELD_HITBOX_SIZE = 45;

Player.MAX_HEALTH = 10;
Player.MINIMUM_RESPAWN_BUFFER = 1000;

Player.generateNewPlayer = function(name, id) {
  var point = World.getRandomPoint();
  var orientation = Util.randRange(0, 2 * Math.PI);
  return new Player(point, orientation, name, id);
};

Player.prototype.updateOnInput = function(keyboardState, turretAngle) {
  if (keyboardState.up) {
    this.velocity = [this.vmag * Math.sin(this.orientation),
                     -this.vmag * Math.cos(this.orientation)];
  }
  if (keyboardState.down) {
    this.velocity = [this.vmag * -Math.sin(this.orientation),
                     -this.vmag * Math.cos(this.orientation)];
  }
  if (!keyboardState.up && !keyboardState.down) {
    this.velocity = [0, 0];
  }
  if (keyboardState.right) {
    this.turnRate = Player.TURN_RATE;
  }
  if (keyboardState.left) {
    this.turnRate = -Player.TURN_RATE;
  }
  if (!keyboardState.right && !keyboardState.left) {
    this.turnRate = 0;
  }
  this.turretAngle = turretAngle;
};

Player.prototype.update = function() {
  this.parent.update.call(this);
  this.orientation += this.turnRate * this.updateTimeDifference;

  var boundedPosition = World.bound(this.getX(), this.getY());
  this.position = boundedPosition;

  for (var powerup in this.powerups) {
    switch (powerup) {
      case Powerup.HEALTHPACK:
        this.health = Math.min(this.health + this.powerups[powerup].data,
                               Player.MAX_HEALTH);
        delete this.powerups[powerup];
        continue;
      case Powerup.SHOTGUN:
        break;
      case Powerup.RAPIDFIRE:
        this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN /
                            this.powerups[powerup].data;
        break;
      case Powerup.SPEEDBOOST:
        this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE *
            this.powerups[powerup].data;
        break;
      case Powerup.SHIELD:
        this.hitboxSize = Player.SHIELD_HITBOX_SIZE;
        if (this.powerups[powerup].data <= 0) {
          delete this.powerups[powerup];
          this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;
          continue;
        }
        break;
    }
    if ((new Date()).getTime() > this.powerups[powerup].expirationTime) {
      switch (powerup) {
        case Powerup.HEALTHPACK:
          break;
        case Powerup.SHOTGUN:
          break;
        case Powerup.RAPIDFIRE:
          this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
          break;
        case Powerup.SPEEDBOOST:
          this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE;
          break;
        case Powerup.SHIELD:
          this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;
          break;
      }
      delete this.powerups[powerup];
    }
  }
};

Player.prototype.applyPowerup = function(name, powerup) {
  this.powerups[name] = powerup;
};

Player.prototype.canShoot = function() {
  return (new Date()).getTime() > this.lastShotTime + this.shotCooldown;
};

Player.prototype.getProjectilesShot = function() {
  var bullets = [Bullet.create(this.position, this.turretAngle, this.id)];
  if (this.powerups[Powerup.SHOTGUN]) {
    for (var i = 1; i < this.powerups[Powerup.SHOTGUN].data + 1; ++i) {
      bullets.push(
          Bullet.create(this.position, this.turretAngle - (i * Math.PI / 9),
                        this.id));
      bullets.push(
          Bullet.create(this.position, this.turretAngle + (i * Math.PI / 9),
                        this.id));
    }
  }
  this.lastShotTime = (new Date()).getTime();
  return bullets;
};

Player.prototype.isCollidedWith = function(x, y, hitboxSize) {
  var minDistance = this.hitboxSize + hitboxSize;
  return Util.getEuclideanDistance2(this.getX(), this.getY(), x, y) <
      (minDistance * minDistance);
};

Player.prototype.isDead = function() {
  return this.health <= 0;
};

Player.prototype.damage = function(amount) {
  if (this.powerups[Powerup.SHIELD]) {
    this.powerups[Powerup.SHIELD].data -= 1;
  } else {
    this.health -= amount;
  }
};

Player.prototype.respawn = function(players) {
  this.position = World.getRandomPoint();
  this.health = Player.MAX_HEALTH;
  this.deaths++;
};

module.exports = Player;
