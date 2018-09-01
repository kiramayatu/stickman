
var Entity = require('./Entity');
var Player = require('./Player');
var World = require('./World');
var Util = require('../shared/Util');

function Powerup(position, name, data, duration) {
  this.position = position;
  this.name = name;
  this.data = data;
  this.duration = duration;

  this.shouldExist = true;
}
require('../shared/base');
Powerup.inheritsFrom(Entity);
Powerup.HITBOX_SIZE = 10;
Powerup.HEALTHPACK = 'healthpack_powerup';
Powerup.HEALTHPACK_MIN_HEAL = 1;
Powerup.HEALTHPACK_MAX_HEAL = 4;

Powerup.SHOTGUN = 'shotgun_powerup';

Powerup.SHOTGUN_MIN_BONUS_SHELLS = 1;
Powerup.SHOTGUN_MAX_BONUS_SHELLS = 2;
Powerup.RAPIDFIRE = 'rapidfire_powerup';

Powerup.RAPIDFIRE_MIN_MULTIPLIER = 2.0;
Powerup.RAPIDFIRE_MAX_MULTIPLIER = 3.5;
Powerup.SPEEDBOOST = 'speedboost_powerup';
Powerup.SPEEDBOOST_MIN_MULTIPLIER = 1.2;
Powerup.SPEEDBOOST_MAX_MULTIPLIER = 1.8;
Powerup.SHIELD = 'shield_powerup';
Powerup.SHIELD_MIN_STRENGTH = 1;
Powerup.SHIELD_MAX_STRENGTH = 3;
Powerup.POWERUPS = [Powerup.HEALTHPACK,
                    Powerup.SHOTGUN,
                    Powerup.RAPIDFIRE,
                    Powerup.SPEEDBOOST,
                    Powerup.SHIELD];

Powerup.MIN_DURATION = 5000;
Powerup.MAX_DURATION = 15000;

Powerup.generateRandomPowerup = function() {
  var point = World.getRandomPoint();
  var name = Util.choiceArray(Powerup.POWERUPS);
  var data = null;
  switch (name) {
    case Powerup.HEALTHPACK:
      data = Util.randRangeInt(Powerup.HEALTHPACK_MIN_HEAL,
                               Powerup.HEALTHPACK_MAX_HEAL + 1);
      break;
    case Powerup.SHOTGUN:
      data = Util.randRangeInt(Powerup.SHOTGUN_MIN_BONUS_SHELLS,
                               Powerup.SHOTGUN_MAX_BONUS_SHELLS + 1);
      break;
    case Powerup.RAPIDFIRE:
      data = Util.randRange(Powerup.RAPIDFIRE_MIN_MULTIPLIER,
                            Powerup.RAPIDFIRE_MAX_MULTIPLIER);
      break;
    case Powerup.SPEEDBOOST:
      data = Util.randRange(Powerup.SPEEDBOOST_MIN_MULTIPLIER,
                            Powerup.SPEEDBOOST_MAX_MULTIPLIER);
      break;
    case Powerup.SHIELD:
      data = Util.randRangeInt(Powerup.SHIELD_MIN_STRENGTH,
                               Powerup.SHIELD_MAX_STRENGTH + 1);
      break;
  }
  var duration = Util.randRange(Powerup.MIN_DURATION,
                                Powerup.MAX_DURATION);
  return new Powerup(point, name, data, duration);
};

Powerup.prototype.getAppliedObject = function() {
  return {
    name: this.name,
    data: this.data,
    expirationTime: (new Date()).getTime() + this.duration
  };
};

Powerup.prototype.update = function(players) {
  for (var i = 0; i < players.length; ++i) {
    if (players[i].isCollidedWith(this.x, this.y,
                                  Powerup.HITBOX_SIZE)) {
      players[i].applyPowerup(this.name, this.getAppliedObject());
      this.shouldExist = false;
      return;
    }
  }
};
module.exports = Powerup;
