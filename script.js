var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var animation;
var time;
var leftSquare;
var rightSquare;

canvas.height = 400;
canvas.width = 500;

clearCanvas();

var GRAVITY = 1.05;
var HALF = canvas.width / 2;
 
function Sprite(options) {
  var that = {};
        
  that.x = options.x;
  that.y = options.y;
  that.width = options.width;
  that.height = options.height;
  that.speed = options.speed;
  that.minspeed = options.minspeed;
  that.maxspeed = options.maxspeed;
  that.friction = options.friction;
  that.momentum = options.momentum;
  that.color = options.color;
  that.left = options.left;
  that.up = options.up;
  that.right = options.right;
  that.down = options.down;

  that.lastX = options.x;
  that.lastY = options.y;
  that.velocityX = 0;
  that.velocityY = 10;

  that.render = function () {
    if((that.x + that.width) < (HALF)) { 
      ctx.fillStyle = "#0F0";
      ctx.fillRect(that.x, that.y, that.width, that.height);
    } else if((that.x + that.width) > (HALF) && that.x < (HALF)) { // IN THE MIDDLE
      ctx.fillStyle = "#0F0";
      ctx.fillRect(that.x, that.y, (HALF - that.x), that.height);
      ctx.fillStyle = "#F00";
      ctx.fillRect(HALF, that.y, that.width - (HALF - that.x), that.height);
    } else {
      ctx.fillStyle = "#F00";
      ctx.fillRect(that.x, that.y, that.width, that.height);
    }
  };

  return that;
}
 
var keysDown = {};

window.onload = function() {
  document.getElementById("reset").focus();
};

window.addEventListener('keydown', function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
  keysDown[e.keyCode] = true;
});

window.addEventListener('keyup', function(e) {
  delete keysDown[e.keyCode];
});
 
function update(mod, sprite) {
  
  // Left
  if(sprite.left in keysDown && sprite.x > 0) {
    sprite.x -= sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }
  // Up
  if(sprite.up in keysDown && sprite.y > 0) {
    sprite.y -= sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }
  // Right
  if(sprite.right in keysDown && sprite.x < canvas.width - sprite.width) {
    sprite.x += sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }
  // Down
  if(sprite.down in keysDown && sprite.y < canvas.height - sprite.height) {
    sprite.y += sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }

  if(!(sprite.down in keysDown)) {

    if(sprite.lastX !== sprite.x) {
      sprite.velocityX = (sprite.x - sprite.lastX);
    }

    if(sprite.lastY !== sprite.y) {
      sprite.velocityY = (sprite.y - sprite.lastY);
    }

    sprite.y += sprite.velocityY * mod;
    sprite.x += sprite.velocityX * mod;
    sprite.velocityX *= sprite.friction;

    if(sprite.velocityY < -1){
      sprite.velocityY *= sprite.friction;
    } else if(sprite.velocityY > -1 && sprite.velocityY < 10) {
      sprite.velocityY = 10;
    } else {
      sprite.velocityY *= GRAVITY;
    }

    sprite.lastY = sprite.y;
    sprite.lastX = sprite.x;
    //console.log("X: " + sprite.velocityX + " Y: " + sprite.velocityY);
  }

}

function drawSquare() {
  GRAVITY = document.getElementById("gravity").value;
  clearCanvas();
  leftSquare = Sprite({
    x: 100,
    y: 0,
    width: 50,
    height: 50,
    speed: 10,
    minspeed: 10,
    maxspeed: 1000,
    friction: 0.95,
    momentum: 1.05,
    color: '#000',
    left: 65,
    up: 87,
    right: 68,
    down: 83,
  });
  rightSquare = Sprite({
    x: 350,
    y: 0,
    width: 50,
    height: 50,
    speed: 10,
    minspeed: 10,
    maxspeed: 1000,
    friction: 0.95,
    momentum: 1.05,
    color: '#000',
    left: 37,
    up: 38,
    right: 39,
    down: 40,
  });
  time = Date.now();
  leftSquare.render();
  rightSquare.render();
  animation = setInterval(run, 10);
}

function clearCanvas() {
  canvas.width = canvas.width; 
  ctx.fillStyle = "#F00";
  ctx.fillRect(0, 0, HALF, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.fillRect(HALF, 0, HALF, canvas.height);
  clearInterval(animation);
  leftSquare = null;
  rightSquare = null;
}
 
function run() {
  update((Date.now() - time) / 1000, rightSquare);
  update((Date.now() - time) / 1000, leftSquare);
  ctx.fillStyle = "#F00";
  ctx.fillRect(0, 0, HALF, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.fillRect(HALF, 0, HALF, canvas.height);
  leftSquare.render();
  rightSquare.render();
  time = Date.now();
}
