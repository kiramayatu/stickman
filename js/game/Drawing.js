
function Drawing(context, images) {
  this.context = context;
  this.images = images;
}

Drawing.NAME_FONT = '14px Helvetica';


Drawing.NAME_COLOR = 'black';

Drawing.HP_COLOR = 'green';


Drawing.HP_MISSING_COLOR = 'red';


Drawing.BASE_IMG_URL = '/public/img/';

Drawing.IMG_SRCS = {
  'self_tank': Drawing.BASE_IMG_URL + 'self_tank.png',
  'self_turret': Drawing.BASE_IMG_URL + 'self_turret.png',
  'other_tank': Drawing.BASE_IMG_URL + 'other_tank.png',
  'other_turret': Drawing.BASE_IMG_URL + 'other_turret.png',
  'shield': Drawing.BASE_IMG_URL + 'shield.png',
  'bullet': Drawing.BASE_IMG_URL + 'bullet.png',
  'tile': Drawing.BASE_IMG_URL + 'tile.png'
};

Drawing.TILE_SIZE = 100;
Drawing.create = function(context) {
  var images = {};
  for (var key in Drawing.IMG_SRCS) {
    images[key] = new Image();
    images[key].src = Drawing.IMG_SRCS[key];
  }
  return new Drawing(context, images);
};


Drawing.prototype.clear = function() {
  this.context.clearRect(0, 0, Constants.CANVAS_WIDTH,
                         Constants.CANVAS_HEIGHT);
};


Drawing.prototype.drawTank = function(isSelf, coords, orientation,
                                      turretAngle, name, health,
                                      hasShield) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.textAlign = 'center';
  this.context.font = Drawing.NAME_FONT;
  this.context.fillStyle = Drawing.NAME_COLOR;
  this.context.fillText(name, 0, -50);
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  for (var i = 0; i < 10; i++) {
    if (i < health) {
      this.context.fillStyle = Drawing.HP_COLOR;
      this.context.fillRect(-25 + 5 * i, -42, 5, 4);
    } else {
      this.context.fillStyle = Drawing.HP_MISSING_COLOR;
      this.context.fillRect(-25 + 5 * i, -42, 5, 4);
    }
  }
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var tank = null;
  if (isSelf) {
    tank = this.images['self_tank'];
  } else {
    tank = this.images['other_tank'];
  }
  this.context.drawImage(tank, -tank.width / 2, -tank.height / 2);
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(turretAngle);
  var turret = null;
  if (isSelf) {
    turret = this.images['self_turret'];
  } else {
    turret = this.images['other_turret'];
  }
  this.context.drawImage(turret, -turret.width / 2, -turret.height / 2);
  this.context.restore();

  if (hasShield != null && hasShield != undefined) {
    this.context.save();
    this.context.translate(coords[0], coords[1]);
    var shield = this.images['shield'];
    this.context.drawImage(shield, -shield.width / 2, -shield.height / 2);
    this.context.restore();
  }
};


Drawing.prototype.drawBullet = function(coords, orientation) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var bullet = this.images['bullet'];
  this.context.drawImage(bullet, -bullet.width / 2, -bullet.height / 2);
  this.context.restore();
};


Drawing.prototype.drawPowerup = function(coords, name) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  var powerup = new Image();
  
  powerup.src = Drawing.BASE_IMG_URL + name + '.png';
  this.context.drawImage(powerup, -powerup.width / 2, -powerup.height / 2);
  this.context.restore();
};


Drawing.prototype.drawTiles = function(minX, minY, maxX, maxY) {
  this.context.save();
  var tile = this.images['tile'];
  for (var x = minX; x < maxX; x += Drawing.TILE_SIZE) {
    for (var y = minY; y < maxY; y += Drawing.TILE_SIZE) {
      this.context.drawImage(tile, x, y);
    }
  }
  this.context.restore();
};
