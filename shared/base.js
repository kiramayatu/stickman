
Function.prototype.inheritsFrom = function(parent) {
  this.prototype = new parent();
  this.prototype.constructor = this;
  this.prototype.parent = parent.prototype;
  return this;
};


function bind(context, method) {
  return function() {
    return method.apply(context, arguments);
  };
}
