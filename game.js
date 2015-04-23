/* Global vars */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var animation;
var time;

canvas.height = 400;
canvas.width = 500;

var GRAVITY = 1.05;
var HALF = canvas.width / 2;

var objects = [];

/* Keyboard interaction */
var keysDown = {};

window.onload = function() {
  scoreField = document.getElementById('score');
};

window.addEventListener('keydown', function(e) {
  if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
  if(e.keyCode == 32) {
    startGame();
  }
  keysDown[e.keyCode] = true;
});

window.addEventListener('keyup', function(e) {
  delete keysDown[e.keyCode];
});

/* Handle mouse events */
$('#canvas').click(function (e) {
  var X = e.pageX - this.offsetLeft;
  var Y = e.pageY - this.offsetTop;
  if(X > 412 && Y > 375) {
    startGame();
  }
});

/* Initialise */
function startGame() {
  clearScore();
  GRAVITY = document.getElementById("gravity").value;
  clearCanvas();
  objects.push(new Sprite({
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
    side: "left",
  }));
  objects.push(new Sprite({
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
    side: "right",
  }));
  time = Date.now();
  objects.forEach(function(o) {
    o.render();
  });
  animation = setInterval(run, 10);
}
 
/* Run game */
function run() {
  /* Update position */
  objects.forEach(function(o) {
    update((Date.now() - time) / 1000, o);
  });

  /* Render background */
  ctx.fillStyle = "#F00";
  ctx.fillRect(0, 0, HALF, canvas.height);
  ctx.fillStyle = "#FFF";
  ctx.fillRect(HALF, 0, HALF, canvas.height);

  ctx.fillStyle = "#F00";
  ctx.font = "bold 16px Arial";
  ctx.fillText("RESTART", 415, 390);

  /* Render objects */
  objects.forEach(function(o) {
    o.render();
  });
  time = Date.now();
}

/* Game logic */
function update(mod, sprite) {
  if(sprite.y > canvas.height) {
    alert("GAME OVER!!!");
    clearCanvas();
  }

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
  
  if(colisionDetect(sprite)) {
    sprite.velocityX = 0; 
    sprite.x = sprite.lastX;
  }

  //colisionDetect(sprite);

  sprite.lastY = sprite.y;
  sprite.lastX = sprite.x;
}

function colisionDetect(sprite) {
  for(var i = 0; i < objects.length; i++) {
    if(sprite != objects[i]) {
      if(
        sprite.x >= (objects[i].x + objects[i].width) ||      // RIGHT
        (sprite.x + sprite.width) <= objects[i].x || // LEFT 
        sprite.y >= (objects[i].y + objects[i].height) ||     // DOWN
        (sprite.y + sprite.height) <= objects[i].y   // TOP
      ) {  
        return false;
      } else { 
        // COLLISION
        return true;
      }
    }
  }
}

/* Helpers */
function clearCanvas() {
  keysDown = {};
  objects = [];
  canvas.width = canvas.width; 
  ctx.fillStyle = "#F00";
  ctx.fillRect(0, 0, HALF, canvas.height);
  ctx.fillStyle = "#FFF";
  ctx.fillRect(HALF, 0, HALF, canvas.height);
  clearInterval(animation);
}

function addScore() {
  var score = scoreField.innerHTML;
  score++;
  scoreField.innerHTML = score;
}

function clearScore() {
  var score = scoreField.innerHTML;
  scoreField.innerHTML = 0;
}
 
