var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var animation;
var time;
var square;

canvas.height = 400;
canvas.width = 500;

var GRAVITY = 1.05;
 
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

  that.lastX = options.x;
  that.lastY = options.y;
  that.velocityX = 0;
  that.velocityY = 10;

  that.render = function () {
    ctx.fillStyle = square.color;
    ctx.fillRect(that.x, that.y, that.width, that.height);
  };

  return that;
}
 
var keysDown = {};

window.onload = function() {
  document.getElementById("reset").focus();
};

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
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }
  // Up
  if(87 in keysDown && sprite.y > 0) {
    sprite.y -= sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }
  // Right
  if(68 in keysDown && sprite.x < canvas.width - sprite.width) {
    sprite.x += sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }
  // Down
  if(83 in keysDown && sprite.y < canvas.height - sprite.height) {
    sprite.y += sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }

  if(!(87 in keysDown)) {

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
  console.log(GRAVITY);
  clearCanvas();
  square = Sprite({
    x: 225,
    y: 0,
    width: 50,
    height: 50,
    speed: 10,
    minspeed: 10,
    maxspeed: 1000,
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
