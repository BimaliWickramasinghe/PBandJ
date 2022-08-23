var myPawn;
var y=0;

function startGame() {
    myPawn = new gamePiece(50, 50, "red", 10, 25);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
            y=1;
          })
          window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
          })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function gamePiece(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
      }
  }

  function updateGameArea() {
    myGameArea.clear();
    if (myGameArea.key && myGameArea.key == 38 && y==1 && myPawn.y>25) {
        myPawn.y -= 100;
        //myPawn.speedY-=100;
        y=0; }
    if (myGameArea.key && myGameArea.key == 40 && y==1 && myPawn.y<400) {
        myPawn.y += 100; 
       // myPawn.speedY+=100;
        y=0; }
    myPawn.newPos();
    myPawn.update();
  }
  
//   function stopMove() {
//     myPawn.speedX = 0;
//     myPawn.speedY = 0;
//   }
  
  





