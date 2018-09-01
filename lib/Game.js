var HashMap = require('hashmap');
var Player = require('./Player');
var Bullet = require('./Bullet');
var Powerup = require('./Powerup');
var Explosion = require('./Explosion');

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');


function Game() {
  this.clients = new HashMap();
  this.players = new HashMap();
  this.projectiles = [];
  this.powerups = [];
  this.explosions = [];
}

Game.MAX_MAP_POWERUPS = 10;

Game.prototype.addNewPlayer = function(name, socket) {
  this.clients.set(socket.id, {
    socket: socket,
    latency: 0
  });
  this.players.set(socket.id, Player.generateNewPlayer(name, socket.id));
};

Game.prototype.removePlayer = function(id) {
  if (this.clients.has(id)) {
    this.clients.remove(id);
  }
  var player = {};
  if (this.players.has(id)) {
    player = this.players.get(id);
    // todo: Finish Explosion class
    this.explosions.push(new Explosion(player.x, player.y,
                                       100, 1000));
    this.players.remove(id);
  }
  return player.name;
};

Game.prototype.getPlayerNameBySocketId = function(id) {
  var player = this.players.get(id);
  if (player) {
    return player.name;
  }
  return null;
};

Game.prototype.updatePlayer = function(id, keyboardState, turretAngle,
                                       shot, timestamp) {
  var player = this.players.get(id);
  var client = this.clients.get(id);
  if (player) {
    player.updateOnInput(keyboardState, turretAngle);
    if (shot && player.canShoot()) {
      this.projectiles = this.projectiles.concat(
          player.getProjectilesShot());
    }
  }
  if (client) {
    client.latency = (new Date()).getTime() - timestamp;
  }
};

Game.prototype.addExplosion = function(explosion) {
  this.explosions.push(explosion);
};

Game.prototype.getPlayers = function() {
  return this.players.values();
};

Game.prototype.update = function() {
  // Update all the players.
  var players = this.getPlayers();
  for (var i = 0; i < players.length; ++i) {
    players[i].update();
  }

  for (var i = 0; i < this.projectiles.length; ++i) {
    if (this.projectiles[i].shouldExist) {
      this.projectiles[i].update(this.players);
    } else {
      var removedProjectile = this.projectiles.splice(i, 1);
      this.addExplosion(new Explosion(removedProjectile.x,
                                      removedProjectile.y,
                                      100, 1000));
      i--;
    }
  }

  while (this.powerups.length < Game.MAX_MAP_POWERUPS) {
    this.powerups.push(Powerup.generateRandomPowerup());
  }
  for (var i = 0; i < this.powerups.length; ++i) {
    if (this.powerups[i].shouldExist) {
      this.powerups[i].update(this.getPlayers());
    } else {
      this.powerups.splice(i, 1);
      i--;
    }
  }


  for (var i = 0; i < this.explosions.length; ++i) {
    if (this.explosions[i].isExpired()) {
      this.explosions.splice(i, 1);
      i--;
    }
  }
};


Game.prototype.sendState = function() {
  var leaderboard = this.players.values().map(function(player) {
    return {
      name: player.name,
      kills: player.kills,
      deaths: player.deaths,
    };
  }).sort(function(a, b) {
    return b.kills - a.kills;
  }).slice(0, 10);

  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    var currentPlayer = this.players.get(ids[i]);
    var currentClient = this.clients.get(ids[i]);
    currentClient.socket.emit('update', {
      leaderboard: leaderboard,
      self: currentPlayer,
      players: this.players.values().filter(function(player) {

        if (player.id == currentPlayer.id) {
          return false;
        }
        return player.isVisibleTo(currentPlayer);
      }),
      projectiles: this.projectiles.filter(function(projectile) {
        return projectile.isVisibleTo(currentPlayer);
      }),
      powerups: this.powerups.filter(function(powerup) {
        return powerup.isVisibleTo(currentPlayer);
      }),
      explosions: this.explosions.filter(function(explosion) {
        return explosion.isVisibleTo(currentPlayer);
      }),
      latency: currentClient.latency
    });
  }
};

module.exports = Game;
