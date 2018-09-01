var Entity = require('./Entity');

function Explosion(x, y, size, duration) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.expires = (new Date()).getTime() + duration;
}
require('../shared/base');
Explosion.inheritsFrom(Entity);


Explosion.DEFAULT_DURATION = 1000;


Explosion.prototype.isExpired = function() {
  return (new Date()).getTime() > this.expires;
};


module.exports = Explosion;
