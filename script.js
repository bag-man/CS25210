var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var animation;
var time;
var square;

canvas.height = 400;
canvas.width = 500;
 
function Sprite(options) {
  var that = {};
        
  that.width = options.width;
  that.height = options.height;
  that.x = options.x;
  that.y = options.y;
  that.speed = options.speed;
  that.color = options.color;
  that.basespeed = options.basespeed;
  that.friction = options.friction;
  that.momentum = options.momentum;
  that.dx = options.dx;
  that.dy = options.dy;

  that.render = function () {
    ctx.fillStyle = square.color;
    ctx.fillRect(that.x, that.y, that.width, that.height);
  };

  return that;
}
 
var keysDown = {};

window.addEventListener('keydown', function(e) {
  keysDown[e.keyCode] = true;
  //console.log(e.keyCode); view keypresses
});

window.addEventListener('keyup', function(e) {
  delete keysDown[e.keyCode];
});
 
function update(mod, sprite) {
  // Left
  if(65 in keysDown && sprite.x > 0) {
    sprite.x -= sprite.speed * mod;
    sprite.speed *= sprite.momentum;
  }
  // Up
  if(87 in keysDown && sprite.y > 0) {
    sprite.y -= sprite.speed * mod;
    sprite.speed *= sprite.momentum;
  }
  // Right
  if(68 in keysDown && sprite.x < canvas.width - sprite.width) {
    sprite.x += sprite.speed * mod;
    sprite.speed *= sprite.momentum;
  }
  // Down
  if(83 in keysDown && sprite.y < canvas.height - sprite.height) {
    sprite.y += sprite.speed * mod;
    sprite.speed *= sprite.momentum;
  }

  //console.log("START: " + startX + ":" + startY); // UNDEFINED?!
  if(!Object.keys(keysDown).length) {
    if(sprite.y < canvas.height - sprite.height) {
      sprite.y += sprite.speed * mod;
      sprite.speed *= sprite.momentum;
    } else {
      sprite.speed = sprite.basespeed;
    }
  }
}

function drawSquare() {
  square = Sprite({
    dx: 0,
    dy: 0,
    x: 225,
    y: 0,
    width: 50,
    height: 50,
    speed: 10,
    basespeed: 10,
    friction: 0.95,
    momentum: 1.05,
    color: '#000'
  });
  time = Date.now();
  square.render();
  animation = setInterval(run, 10);
}

function clearCanvas() {
  canvas.width = canvas.width; 
  clearInterval(animation);
  square = null;
}
 
function run() {
  update((Date.now() - time) / 1000, square);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  square.render();
  time = Date.now();
}
 
