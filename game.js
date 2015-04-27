/* Global vars */
var range = document.getElementById("gravity");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var score = 0;
var seconds = "00";
var minutes = "00";
var ding = new Audio('ding.mp3'); // http://soundjax.com/reddo/74421%5EDing.mp3
var loss = new Audio('loss.mp3'); // http://soundbible.com/1830-Sad-Trombone.html
var helpText = new Image();
helpText.src = "help.png";

canvas.height = 400;
canvas.width = 500;

var GRAVITY = 1.03;
var HALF = canvas.width / 2;

var animation;
var difficulty;
var timer;
var time;
var objects = [];
var keysDown = {};

window.onload = function() {
  ctx.fillStyle = "#F00";
  ctx.font = "bold 16px Arial";
  ctx.drawImage(helpText, 50, 50);
  ctx.fillText("PRESS SPACE TO START", 150, 300);
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
  if(X < 55 && Y < 23) {
    help();
  }
  if(X > 412 && Y > 375) {
    startGame();
  }
  if(X < 121 && Y > 375) {
    highscores();
  }
});

function createObjects() {
  objects = [];
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
    moved: false,
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
    moved: false,
  }));
}

/* Initialise */
function startGame() {
  over = false;
  resetGame();
  createObjects();
  time = Date.now();
  objects.forEach(function(o) {
    o.render();
  });
  animation = setInterval(run, 10);
  difficulty = setInterval(function() {
    range.value = parseFloat(range.value) + 0.01;
    GRAVITY = range.value;
    if (range.value > 1.1) {
      clearInterval(difficulty);
    }
  }, 10000);
  timer = setInterval(function() {
    seconds = parseInt(seconds) + 1;
    if(seconds < 10) {
      seconds = "0" + seconds;
    }
    if(seconds > 60) {
      seconds = "00";
      minutes = parseInt(minutes) + 1;
    }
  }, 1000);
}
 
/* Run game */
function run() {
  /* Update position */
  objects.forEach(function(sprite) {
    update((Date.now() - time) / 1000, sprite);
  });

  /* Do scoring */
  // Bit of a hack 
  if(objects[0].moved && objects[1].moved) {
    score++;
    objects[0].moved = false;
    objects[1].moved = false;
  }

  if(!over) {
    /* Render background */
    ctx.fillStyle = "#F00";
    ctx.fillRect(0, 0, HALF, canvas.height);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(HALF, 0, HALF, canvas.height);

    ctx.fillStyle = "#FFF";
    ctx.fillRect(HALF-10, 300, 10, 20);
    ctx.fillRect(HALF-10, 350, 10, 20);
    ctx.font = "bold 72px Arial";
    ctx.fillText(minutes, 150, 360);

    ctx.fillStyle = "#F00";
    ctx.fillRect(HALF, 300, 10, 20);
    ctx.fillRect(HALF, 350, 10, 20);
    ctx.font = "bold 72px Arial";
    ctx.fillText(seconds, 270, 360);

    ctx.fillStyle = "#FFF";
    ctx.font = "bold 16px Arial";
    ctx.fillText("HIGHSCORES", 10, 390);
    ctx.fillText("HELP", 10, 20);
  }

  ctx.fillStyle = "#F00";
  ctx.font = "bold 16px Arial";
  ctx.fillText("RESTART", 415, 390);
  ctx.fillText("SCORE: ", 405, 20);
  ctx.fillText(score, 470, 20);

  if(over) {
    ctx.fillStyle = "#F00";
    ctx.font = "bold 16px Arial";
    ctx.fillText("HIGHSCORES", 10, 390);
  }

  if(!over) {
    /* Render objects */
    objects.forEach(function(o) {
      o.render();
    });
  }

  time = Date.now();
}

/* Game logic */
function update(mod, sprite) {
  if(sprite.y > canvas.height) {
    if(!over) {
      gameOver();
    }
  }

  // Left
  if(sprite.left in keysDown && sprite.x > 0) {
    sprite.x -= sprite.speed * mod;
    if((sprite.speed * sprite.momentum) < sprite.maxspeed) {
      sprite.speed *= sprite.momentum;
    }
  }
  // Bouncy
  if(sprite.up in keysDown && sprite.y <= 0) {
    var tmpKey = sprite.up;
    sprite.up = null;
    setTimeout(function() { sprite.up = tmpKey; }, 1500);
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

    // if horizontal clash
    sprite.velocityX = 0; 
    sprite.x = sprite.lastX;
      
    // if vertical clash
    sprite.velocityY = 0; 
    sprite.y = sprite.lastY;

    ding.play();
  }

  sprite.lastY = sprite.y;
  sprite.lastX = sprite.x;
}

function colisionDetect(sprite) {
  for(var i = 0; i < objects.length; i++) {
    if(sprite != objects[i]) {
      if(
        sprite.x >= (objects[i].x + objects[i].width) ||      // RIGHT
        (sprite.x + sprite.width) <= objects[i].x ||          // LEFT 
        sprite.y >= (objects[i].y + objects[i].height) ||     // DOWN
        (sprite.y + sprite.height) <= objects[i].y            // TOP
      ) {  
        return false;
      } else { 
        // COLLISION
        return true;
      }
    }
  }
}

function help() {
  resetGame();
  over = true;
  ctx.fillStyle = "#F00";
  ctx.font = "bold 16px Arial";
  ctx.drawImage(helpText, 50, 50);
  ctx.fillText("RESTART", 415, 390);
  ctx.fillText("HIGHSCORES", 10, 390);
}

function highscores() {
  resetGame();
  over = true;
  ctx.fillStyle = "#F00";
  ctx.font = "bold 16px Arial";
  ctx.fillText("HIGHSCORES", 200, 75);
  ctx.fillText("RESTART", 415, 390);
  ctx.fillText("HELP", 10, 20);

  var start = 100;
  var scores = [];
  for (var i = 0; i < localStorage.length; i++){
    var score = localStorage.getItem(localStorage.key(i));
    var date = localStorage.key(i);
    scores.push({"time": date, "score": parseInt(score)});
  }

  scores.sort(compare);
  for (var j in scores){
    ctx.fillText(scores[j].time + " " + scores[j].score, 170, start);
    start += 25;
    if(j == 10) break;
  }
}

function compare(a,b) {
  if (a.score < b.score)
     return 1;
  if (a.score > b.score)
    return -1;
  return 0;
}

function gameOver() {
  loss.play();
  var rightNow = new Date();
  var res = rightNow.toISOString().slice(0,19).replace(/T/g," ");
  localStorage.setItem(res, score);
  resetGame();
  over = true;

  ctx.fillStyle = "#F00";
  ctx.font = "bold 16px Arial";
  ctx.fillText("GAME OVER", 200, 200);
  ctx.fillText("PRESS SPACE TO RESTART", 140, 300);
  ctx.fillText("HELP", 10, 20);
}

function resetGame() {
  clearInterval(animation);
  clearInterval(difficulty);
  clearInterval(timer);
  keysDown = {};
  GRAVITY = 1.03;
  range.value = GRAVITY;
  canvas.width = canvas.width; 
  score = 0;
  minutes = "00";
  seconds = "00";

}
