
function handleMouseMove(evt){

  let x = evt.pageX;
  let y = evt.pageY;

  Mouse.position = new Vector2(x, y);
}

function MouseHandler(){
  this.left = new ButtonState();
  this.middle = new ButtonState();
  this.right = new ButtonState();

  this.position = new Vector2();

  document.onmousemove = handleMouseMove;
  document.onmousedown = handleMouseDown;
  document.onmouseup = handleMouseUp;
}

let Mouse = new MouseHandler();