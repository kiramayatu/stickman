
function ViewPort() {
  this.selfCoords = [];
}

ViewPort.create = function() {
  return new ViewPort();
};

ViewPort.prototype.update = function(position) {
  this.selfCoords = position.slice();
};

ViewPort.prototype.toCanvasX = function(x) {
  return x - (this.selfCoords[0] - Constants.CANVAS_WIDTH / 2);
};

ViewPort.prototype.toCanvasY = function(y) {
  return y - (this.selfCoords[1] - Constants.CANVAS_HEIGHT / 2);
};

ViewPort.prototype.toCanvasCoords = function(object) {
  var translateX = this.selfCoords[0] - Constants.CANVAS_WIDTH / 2;
  var translateY = this.selfCoords[1] - Constants.CANVAS_HEIGHT / 2;
  return [object.position[0] - translateX,
          object.position[1] - translateY];
};
