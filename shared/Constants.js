
function Constants() {
  throw new Error('Constants should not be instantiated!');
}


Constants.WORLD_MIN = 0;

Constants.WORLD_MAX = 2500;


Constants.WORLD_PADDING = 30;


Constants.CANVAS_WIDTH = 800;


Constants.CANVAS_HEIGHT = 600;


Constants.VISIBILITY_THRESHOLD_X = 425;


Constants.VISIBILITY_THRESHOLD_Y = 325;

if (typeof module === 'object') {

  module.exports = Constants;
} else {
  
  window.Constants = Constants;
}
