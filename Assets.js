let sprites = {};
let assetsStillLoading = 0;

function assetsLoadingLoop(callback){

  if(assetsStillLoading){
    requestAnimationFrame(assetsLoadingLoop.bind(this, callback));
  }
  else{
    callback();
  }

}

function loadAssets(callback){

  function loadSprite(fileName){
    assetsStillLoading++;

    let spriteImage = new Image();
    spriteImage.src = "./assets/sprites/" + fileName;

    spriteImage.onload = function(){
      assetsStillLoading--;
    }

    return spriteImage;
  }

  sprites.background = loadSprite('spr_background5.png');
  sprites.stick = loadSprite('spr_stick.png');
  sprites.whiteBall = loadSprite('spr_ball2.png');

  assetsLoadingLoop(callback);


}