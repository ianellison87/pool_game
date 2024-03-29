
const BALL_ORIGIN = new Vector2(25, 25);
const BALL_DIAMETER = 38;
const BALL_RADIUS = BALL_DIAMETER/2;

function Ball(position, color){
  this.position = position;
  this.velocity = new Vector2();
  this.moving = false;
  this.sprite = getBallSpriteByColor(color);
  this.visible = true;
}

Ball.prototype.update = function(delta){

  if(!this.visible){
    return;
  }

  this.position.addTo(this.velocity.mult(delta));

  // apply friction
  this.velocity = this.velocity.mult(0.984);

  if(this.velocity.length() < 5){
    this.velocity = new Vector2();
    this.moving = false;
  }
}

Ball.prototype.draw = function(){

  if (!this.visible) {
    return;
  }

  Canvas.drawImage(this.sprite, this.position, BALL_ORIGIN);
}

Ball.prototype.shoot = function(power, rotation){

  this.velocity = new Vector2(power * Math.cos(rotation), power * Math.sin(rotation))
  this.moving = true;
}

Ball.prototype.collideWithBall = function(ball){

  if(!this.visible || !ball.visible){
    return;
  }

  // find a normal vector
  const n = this.position.subtract(ball.position);

  //find distance
  const dist = n.length();

  if (dist > BALL_DIAMETER) {
    return;
  }

  // find min trans distance
  const mtd = n.mult((BALL_DIAMETER - dist) / dist);

  // push - pull bals apart
  this.position = this.position.add(mtd.mult(1 / 2));
  ball.position = ball.position.subtract(mtd.mult(1 / 2));

  // find unit normal vector
  const un = n.mult(1 / n.length());

  // find unit tangent vector
  const ut = new Vector2(-un.y, un.x);

  // project velovity onto the unit normal and unit tangetnt vectors
  const v1n = un.dot(this.velocity);
  const v1t = ut.dot(this.velocity);
  const v2n = un.dot(ball.velocity);
  const v2t = ut.dot(ball.velocity);

  // find new normal velocities
  let v1nTag = v2n;
  let v2nTag = v1n;

  // convert the scalar normal and the tangential velocities into vectors
  v1nTag = un.mult(v1nTag);
  const v1tTag = ut.mult(v1t);
  v2nTag = un.mult(v2nTag);
  const v2tTag = ut.mult(v2t);

  // update velocities
  this.velocity = v1nTag.add(v1tTag);
  ball.velocity = v2nTag.add(v2tTag);

  this.moving = true;
  ball.moving = true;
}

Ball.prototype.handleBallInPocket = function(){

  if(!this.visible){
    return;
  }

  let inPocket = CONSTANTS.pockets.some(pocket => {
    return this.position.distFrom(pocket) < CONSTANTS.pocketRadius;
  });

  if(!inPocket){
    return;
  }

  this.visible = false;
  this.moving = false;
}

Ball.prototype.collideWithTable = function(table){

  if(!this.moving || !this.visible){
    return;
  }

  let collided = false;

  if(this.position.y <= table.TopY + BALL_RADIUS){
    this.position.y = table.TopY + BALL_RADIUS;
    this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
    collided = true;
  }
  if(this.position.x >= table.RightX - BALL_RADIUS){
    this.position.x = table.RightX - BALL_RADIUS;
    this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
    collided = true;
  }
  if(this.position.y >= table.BottomY - BALL_RADIUS){
    this.position.y = table.BottomY - BALL_RADIUS;
    this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
    collided = true;
  }
  if(this.position.x <= table.LeftX + BALL_RADIUS){
    this.position.x = table.LeftX + BALL_RADIUS;
    this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
    collided = true;
  }

  if(collided){
    this.velocity = this.velocity.mult(0.98);
  }
}

Ball.prototype.collideWith = function(object){

  if(object instanceof Ball){
    this.collideWithBall(object);
  }
  else{
    this.collideWithTable(object)
  }
}