// init canvas
var canvas,
    context;

var images = {},
    imageWidth = {}, 
    imageHeight = {};

var sticker;
                  
// drag and drop init var 
var startX,
    startY,
    startX2  = 0,
    startY2  = 0,
    dragImageStatus = false,
    touch = [];
var moveNow = 0;
var touchDistance  = 0;

var TouchAble = 'ontouchstart' in window;


// sprite init position 
var SpriteX= [511,716,992,514,775,1033,556,798,1079];
var SpriteY= [320,313,282,475,480,521,668,646,669];

var stickerHeight = [],
    stickerWidth = [];


function prepareCanvas(canvasDiv, canvasWidth, canvasHeight, canvasID)
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	canvas = document.createElement('canvas');
	// canvas.setAttribute('width', canvasWidth);
	// canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', canvasID);
	canvasDiv.appendChild(canvas);
  offsetX = document.getElementById("game").offsetLeft;
  offsetY = document.getElementById("game").offsetTop;
	context = canvas.getContext("2d"); // Grab the 2d canvas context	
	
  // load the sprite 

  loadImage('pic');   
	loadImage('sticker');		
  LoadSprite('images/Sprite.png');

}

function loadImage(name) {

  images[name] = new Image();
  images[name].onload = function() {  
  resourceLoaded();
  imageWidth[name] = images[name].width;
  imageHeight[name] = images[name].height;
  }
  images[name].src = "images/"+name+".png";
}

function resourceLoaded() {
    window.requestAnimationFrame(resourceLoaded);
   	drawStage();
}

function drawStage() {
				
  canvas.width = canvas.width;       // clears the canvas

  drawPhoto("pic"); 
  context.drawImage(images["sticker"], SpriteX[1], SpriteY[1] ,imageHeight["sticker"], imageWidth["sticker"]);
  sticker.update();
  sticker.draw();
  drawTouch();
}

function drawPhoto(Name) {
    context.drawImage(images[Name],0,0);
}


// init var related function  (or config var )
function getRandomInt(min, max) { // random int between min(include) and max(exclude)
	return Math.floor(Math.random()*(max-min)) +min;
}



// the drag part game control via the postion 
// add the mouse event tothe canvas and redraw the canvs 

// handle the touch related function 
function handleTheTouchDown(event) {

   if(TouchAble) {
     event.preventDefault();
     touch = event.targetTouches;
     if(event.targetTouches.length == 1 ) {
       var tempTouch = event.targetTouches[0];
     } else {
       var tempTouch = event.targetTouches[0];
       var tempTouch2 = event.targetTouches[1];
       startX2 = parseInt(tempTouch2.pageX - offsetX);
       startY2 = parseInt(tempTouch2.pageY - offsetY); 
       // console.log(touch2.pageX);
     }
     startX = parseInt(tempTouch.pageX - offsetX);
     startY = parseInt(tempTouch.pageY - offsetY); 
     if(event.targetTouches.length > 1) {
      touchDistance = Distance(startX , startY , startX2 , startY2) ;
      //console.log(touchDistance);
     }      
   } else {
     startX = parseInt(event.clientX - offsetX);
     startY = parseInt(event.clientY - offsetY);  
   }

   if(hitImage(startX,startY,imageWidth["sticker"],imageHeight["sticker"],SpriteX[1],SpriteY[1])) {
      dragImageStatus = true;
      moveNow = 1 ;
   }
   if(hitImage(startX,startY,stickerWidth[0],stickerHeight[0],SpriteX[0],SpriteY[0])) {
      dragImageStatus = true;
      moveNow = 0 ;
   }

}

function handleTheTouchUp(event) {
   if(TouchAble) {
     event.preventDefault();   
     touch = event.targetTouches; 
   }

    // alert("detectmouseup");
   dragImageStatus = false;
}

function handleTheTouchMove(event) {
   if(dragImageStatus == true) {
     if(TouchAble) {
      event.preventDefault();
      touch = event.targetTouches;
      var tempTouch = event.touches[0];
      mouseX = parseInt(tempTouch.pageX - offsetX);
      mouseY = parseInt(tempTouch.pageY - offsetY);      
     } else {
      mouseX = parseInt(event.clientX - offsetX);
      mouseY = parseInt(event.clientY - offsetY); 
     } 
      
      // move the image
      switch (moveNow) {
        case 0:
        updatePosition(mouseX,mouseY,SpriteX,SpriteY,moveNow);
        break;
        case 1:
        updatePosition(mouseX,mouseY,SpriteX,SpriteY,moveNow);
        break;
      }

      if(touch.length > 1 ) {
        var tempTouch2  = event.touches[1];
        var tempmouseX2 = parseInt(tempTouch2.pageX - offsetX);
        var tempmouseY2 = parseInt(tempTouch2.pageY - offsetY);

        switch (moveNow) {
          case 0:
          updateImageSize(mouseX , tempmouseX2, mouseY , tempmouseY2 , images['sticker'] );
          break;
          case 1:
          updateImageSize(mouseX , tempmouseX2, mouseY , tempmouseY2 , images['sticker'] );
          break;
        }
      }
      //redraw the image 
      drawStage();

   }
}


// ======================Update Image function=========================
function updateImageAngle(touchx1 , touchx2 , touchy1, touchy2) {
   var tempAngle = AngleDeg(touchx1 , touchy1 , touchx2 , touchy2);
}


function updateImageSize(touchx1 , touchx2 , touchy1, touchy2 , image) {
   var tempDistance = (touchx1 , touchy1, touchx2, touchy2);
   var tempHeight = stickerHeight[0];
   var tempWidth = stickerWidth[0];
   
   var sum = tempDistance - touchDistance ;

   if (sum < 0 ) {
      //console.log("zoomin" + sum);
      tempHeight += 2;
      tempWidth += 2;
   } else {
      //console.log("zoomout" + sum);
      tempHeight -= 2;
      tempWidth -= 2;
   }
   if(tempHeight < 80 ) {
        tempHeight = 80;
        tempWidth = 80;
   } else if( tempHeight > 300) {
        tempHeight = 300 ;
        tempWidth = 300;
   }

   stickerHeight[0] = tempHeight;
   stickerWidth[0] = tempWidth ;

   touchDistance = tempDistance;
}



function updatePosition(mouseX,mouseY,X,Y,moveNow) {
     var dx = mouseX - startX ;
     var dy = mouseY - startY ; 
     X[moveNow] += dx;
     Y[moveNow] += dy;
      // reset the  startXY coordinate
      startX = mouseX;
      startY = mouseY;  
}


// ======== draw function  =========

function LoadSprite(src) {
  var config = new Config({
      width:528/4,
      height:291/3,
      frameSpeed:1
     });

  var stickerSprite = new SpriteSheet(src,config.width, config.height);
  sticker  = new Animation(stickerSprite, 10, 0,11,0,0); 
}

function drawTouch() {
  
  //context.clearRect(0,0,canvas.width, canvas.height); 
  
  if(TouchAble) {
    for(var j=0; j < touch.length; j++)
    {
      var t = touch[j]; 
      context.beginPath(); 
      context.fillStyle = "white";
      context.fillText("touch id : "+t.identifier+" x:"+t.clientX+" y:"+t.clientY, t.clientX+30, t.clientY-30); 

      context.beginPath(); 
      context.strokeStyle = "cyan";
      context.lineWidth = "6";
      context.arc(t.clientX, t.clientY, 40, 0, Math.PI*2, true); 
      context.stroke();
    }
  }
  
}
//============Sprite object Module ============

var Config = function(obj) {
  this.width = obj.width;
  this.height = obj.height;
  this.num = obj.num;
  this.frameSpeed = obj.frameSpeed;
}


function SpriteSheet(path, frameWidth, frameHeight) {
  this.image = new Image();
  this.frameWidth = frameWidth;
  this.frameHeight = frameHeight;
 
  // calculate the number of frames in a row after the image loads
  var self = this;
  this.image.onload = function() {
    self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
  };
  this.image.src = path;
}


// sprite obejct
var Animation  = function(spritesheet, frameSpeed, startFrame, endFrame,dx, dy) {
  
  // init Animation object
  this.animationSequence = [];  // array holding the order of the animation
  this.currentFrame = 0;        // the current frame to draw
  this.counter = 0;             // keep track of frame rate
  this.spritesheet = spritesheet ;
  this.frameSpeed = frameSpeed ;
  this.startFrame = startFrame || 0;
  this.endFrame = endFrame || 0;
  this.dx = dx;
  this.dy = dy;

  stickerWidth[0] = this.spritesheet.frameWidth;
  stickerHeight[0] = this.spritesheet.frameHeight;

  for (var frameNumber = this.startFrame; frameNumber <= this.endFrame; frameNumber++) {
     this.animationSequence.push(frameNumber);  
  }
}

Animation.prototype.update = function() {

    // update to the next frame if it is time
    if (this.counter == (this.frameSpeed - 1))
      this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
 
    // update the counter
    this.counter = (this.counter + 1) % this.frameSpeed;
}

Animation.prototype.draw = function() {
      // get the row and col of the frame
    var row = Math.floor(this.animationSequence[this.currentFrame] / this.spritesheet.framesPerRow);
    var col = Math.floor(this.animationSequence[this.currentFrame] % this.spritesheet.framesPerRow);
    
    context.drawImage(
      this.spritesheet.image,
      col * this.spritesheet.frameWidth, 
      row * this.spritesheet.frameHeight,
      this.spritesheet.frameWidth, 
      this.spritesheet.frameHeight,
      SpriteX[0], 
      SpriteY[0],
      stickerWidth[0], 
      stickerHeight[0]
  );
}


// ============ Math  libs =============

function Distance (x1 ,y1 , x2 ,y2) {
  return parseInt( Math.sqrt((x1 - x2) * (x1 - x2) + (y1- y2) * (y1 - y2)) );
}

function AngleRadians(x1 , y1 , x2 , y2) {
  return Math.atan2(y2 - y1 , x2 - x1) ; 
}

function AngleDeg(x1 , y1 , x2 , y2) {
  return Math.atan2(y2 - y1 , x2 - x1) *180 / Math.PI
}


// check the mouse if hit the image 
function hitImage(mouseX,mouseY,width,height,x,y) {
  return (mouseX>x&& mouseX<x + width && mouseY>y && mouseY<y + height);
}
// check if the cloth hit the character's body
function hitCharacter(targetX, targetY,x,y,CoffsetX , CoffsetY) {
     return (x>=targetX- CoffsetX && x<targetX+CoffsetX && y >= targetY - CoffsetY && y<=targetY +CoffsetY);
   // return true;
}
