var k=0;function m(){k=(new Date).getTime()};function n(c,d,e){this.b=c;this.l=d;this.a=e}function p(c){c.a.addEventListener("keydown",q(c,function(c){13==c.keyCode&&this.sendMessage()}));c.b.on("chat-server-to-clients",q(c,function(c){var d=c.name,g=c.message,f=document.createElement("li");c.isNotification&&f.setAttribute("class","notification");f.appendChild(document.createTextNode(d+": "+g));this.l.appendChild(f)}))}n.prototype.sendMessage=function(){var c=this.a.value;this.a.value="";this.b.emit("chat-client-to-server",c)};function r(c,d){this.context=c;this.a=d}var t={self_tank:"/public/img/self_tank.png",self_turret:"/public/img/self_turret.png",other_tank:"/public/img/other_tank.png",other_turret:"/public/img/other_turret.png",shield:"/public/img/shield.png",bullet:"/public/img/bullet.png",tile:"/public/img/tile.png"};
function u(c,d,e,g,f,h,l,A){c.context.save();c.context.translate(e[0],e[1]);c.context.textAlign="center";c.context.font="14px Helvetica";c.context.fillStyle="black";c.context.fillText(h,0,-50);c.context.restore();c.context.save();c.context.translate(e[0],e[1]);for(h=0;10>h;h++)c.context.fillStyle=h<l?"green":"red",c.context.fillRect(-25+5*h,-42,5,4);c.context.restore();c.context.save();c.context.translate(e[0],e[1]);c.context.rotate(g);g=d?c.a.self_tank:c.a.other_tank;c.context.drawImage(g,-g.width/
2,-g.height/2);c.context.restore();c.context.save();c.context.translate(e[0],e[1]);c.context.rotate(f);d=d?c.a.self_turret:c.a.other_turret;c.context.drawImage(d,-d.width/2,-d.height/2);c.context.restore();null!=A&&void 0!=A&&(c.context.save(),c.context.translate(e[0],e[1]),e=c.a.shield,c.context.drawImage(e,-e.width/2,-e.height/2),c.context.restore())};function v(c,d,e,g){this.i=c;this.o=d;this.b=e;this.a=g;this.c=null;this.f=[];this.h=[];this.g=[]}function w(c){var d=document.getElementById("canvas"),e=document.getElementById("leaderboard");d.width=800;d.height=600;var d=d.getContext("2d"),e=new x(e),g={},f;for(f in t)g[f]=new Image,g[f].src=t[f];c=new v(c,e,new r(d,g),new y);z(c);return c}
function z(c){c.i.on("update",q(c,function(c){var d=this.o;for(d.a=c.leaderboard;d.b.firstChild;)d.b.removeChild(d.b.firstChild);for(var g=0;g<d.a.length;++g){var f=document.createElement("li");f.appendChild(document.createTextNode(d.a[g].name+" - Kills: "+d.a[g].kills+" Deaths: "+d.a[g].deaths));d.b.appendChild(f)}this.c=c.self;this.f=c.players;this.h=c.projectiles;this.g=c.powerups}))}
v.prototype.j=function(){this.c&&(this.a.a=this.c.position.slice(),this.i.emit("player-action",{keyboardState:{up:B,right:C,down:D,left:E},turretAngle:Math.atan2(F[1]-300,F[0]-400)+Math.PI/2,shot:G,timestamp:(new Date).getTime()}));if(this.c){this.b.context.clearRect(0,0,800,600);var c=this.c.position[0]-400,d=this.c.position[1]-300,e=Math.max(c-c%100,0),g=Math.max(d-d%100,0),d=this.b,f=e-(this.a.a[0]-400),c=g-(this.a.a[1]-300),e=Math.min(e+900,2500)-(this.a.a[0]-400),g=Math.min(g+700,2500)-(this.a.a[1]-
300);d.context.save();for(var h=d.a.tile;f<e;f+=100)for(var l=c;l<g;l+=100)d.context.drawImage(h,f,l);d.context.restore();for(d=0;d<this.h.length;++d)c=this.b,e=H(this.a,this.h[d]),f=this.h[d].orientation,c.context.save(),c.context.translate(e[0],e[1]),c.context.rotate(f),e=c.a.bullet,c.context.drawImage(e,-e.width/2,-e.height/2),c.context.restore();for(d=0;d<this.g.length;++d)c=this.b,f=H(this.a,this.g[d]),e=this.g[d].name,c.context.save(),c.context.translate(f[0],f[1]),f=new Image,f.src="/public/img/"+
e+".png",c.context.drawImage(f,-f.width/2,-f.height/2),c.context.restore();this.c&&u(this.b,!0,H(this.a,this.c),this.c.orientation,this.c.turretAngle,this.c.name,this.c.health,this.c.powerups.shield_powerup);for(d=0;d<this.f.length;++d)u(this.b,!1,H(this.a,this.f[d]),this.f[d].orientation,this.f[d].turretAngle,this.f[d].name,this.f[d].health,this.f[d].powerups.shield_powerup)}window.requestAnimationFrame(q(this,this.j))};var G=!1,F=[],E=!1,B=!1,C=!1,D=!1;function I(c){1==c.which&&(G=!0)}function J(c){1==c.which&&(G=!1)}function K(c){switch(c.keyCode){case 37:case 65:E=!0;break;case 38:case 87:B=!0;break;case 39:case 68:C=!0;break;case 40:case 83:D=!0}}function L(c){switch(c.keyCode){case 37:case 65:E=!1;break;case 38:case 87:B=!1;break;case 39:case 68:C=!1;break;case 40:case 83:D=!1}}
function M(){var c=document.getElementById("canvas");c.setAttribute("tabindex",1);c.addEventListener("mousedown",I);c.addEventListener("mouseup",J);c.addEventListener("keyup",L);c.addEventListener("keydown",K)}function N(){document.getElementById("canvas").addEventListener("mousemove",function(c){F=[c.offsetX,c.offsetY]})};function x(c){this.b=c;this.a=[]};function y(){this.a=[]}function H(c,d){return[d.position[0]-(c.a[0]-400),d.position[1]-(c.a[1]-300)]};function q(c,d){return function(){return d.apply(c,arguments)}};function O(){throw Error("Constants should not be instantiated!");}"object"===typeof module?module.m=O:window.a=O;function P(){throw Error("Util should not be instantiated!");}"object"===typeof module?module.m=P:window.b=P;$(document).ready(function(){function c(){var c=$("#name-input").val();c&&20>c.length?($("#name-prompt-container").empty(),$("#name-prompt-container").append($("<span>").addClass("fa fa-2x fa-spinner fa-pulse")),d.emit("new-player",{name:c},function(){$("#name-prompt-overlay").fadeOut(500);$("#canvas").focus();window.requestAnimationFrame(q(e,e.j))})):window.alert("Your name cannot be blank or over 20 characters.");return!1}var d=io(),e=w(d);p(new n(d,document.getElementById("chat-display"),document.getElementById("chat-input")));
M();N();k=(new Date).getTime();window.addEventListener("click",m);window.addEventListener("mousemove",m);window.addEventListener("keydown",m);window.addEventListener("keyup",m);$("#name-input").focus();$("#name-form").submit(c);$("#name-submit").click(c);setInterval(function(){(new Date).getTime()>k+12E4&&location.reload()},1E3)});
