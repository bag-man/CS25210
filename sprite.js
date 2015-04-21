function Sprite(options) {
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.speed = options.speed;
  this.minspeed = options.minspeed;
  this.maxspeed = options.maxspeed;
  this.friction = options.friction;
  this.momentum = options.momentum;
  this.color = options.color;
  this.left = options.left;
  this.up = options.up;
  this.right = options.right;
  this.down = options.down;
  this.side = options.side;

  this.lastX = options.x;
  this.lastY = options.y;
  this.velocityX = 0;
  this.velocityY = 10;
}

Sprite.prototype.render = function () {
  if((this.x + this.width) < (HALF)) { 
    // LEFT
    ctx.fillStyle = "#FFF";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if(this.side == "right") {
      this.side = "left";
      addScore();
    }
  } else if((this.x + this.width) > (HALF) && this.x < (HALF)) {          
    // MIDDLE
    ctx.fillStyle = "#FFF";
    ctx.fillRect(this.x, this.y, (HALF - this.x), this.height);
    ctx.fillStyle = "#F00";
    ctx.fillRect(HALF, this.y, this.width - (HALF - this.x), this.height);
  } else {                                           
    // RIGHT
    ctx.fillStyle = "#F00";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if(this.side == "left") {
      this.side = "right";
      addScore();
    }
  }
};
