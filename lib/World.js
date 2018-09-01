var Constants = require('../shared/Constants');
var Util = require('../shared/Util');
function World() {
  throw new Error('World should not be instantiated');
}
World.isInside = function(x, y) {
  return Util.inBound(x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(y, Constants.WORLD_MIN, Constants.WORLD_MAX);
};

World.bound = function(x, y) {
  return [Util.bound(x, Constants.WORLD_MIN, Constants.WORLD_MAX),
          Util.bound(y, Constants.WORLD_MIN, Constants.WORLD_MAX)];
};

World.getRandomPoint = function(padding) {
  if (!padding) {
    padding = Constants.WORLD_PADDING;
  }
  return [Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding),
          Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding)];
};

module.exports = World;
