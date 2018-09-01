
function Leaderboard(element) {
  this.element = element;
  this.players = [];
}


Leaderboard.create = function(element) {
  return new Leaderboard(element);
};

Leaderboard.prototype.update = function(players) {
  this.players = players;

  while (this.element.firstChild) {
    this.element.removeChild(this.element.firstChild);
  }

  for (var i = 0; i < this.players.length; ++i) {
    var playerElement = document.createElement('li');
    playerElement.appendChild(document.createTextNode(
        this.players[i]['name'] + ' - Kills: ' + this.players[i]['kills'] +
        ' Deaths: ' + this.players[i]['deaths']));
    this.element.appendChild(playerElement);
  }
};
