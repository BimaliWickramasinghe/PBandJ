var myGamePiece;
var myObstacles = [];
var myCollectables = [];
var myScore;
var myBackground;

var newScore = 0;
var y=0;

localStorage.setItem("highestScore", "0");

function startGame() {
    
    myGamePiece = new component(75, 75, "left.png", 50, 125, "image");
    myBackground = new component(800, 600, "background.png", 0, 0, "background");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    
    
    hideElement();
    
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.canvas.setAttribute("id","myCanvas");
        this.context = this.canvas.getContext("2d");
        
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);

        

        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
            y=1;
            if (myGameArea.key==38){
                moveup();
            }
            if (myGameArea.key==40){
                movedown();
            }
          })
          window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
          })

        },
        
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
      }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
          } else if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
              ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
          }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;  
        if (this.type == "background") {
            if (this.x == -(this.width)) {
              this.x = 0;
            }
          }     
    }    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.crashWithMe = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = false;
        if (myright == otherleft && (mytop < othertop) && (mybottom > otherbottom) ) {
            crash = true;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y, z;
    myScore.text = "SCORE: " + newScore;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            
            return;
        } 
    }
    for (i = 0; i < myCollectables.length; i += 1) {
        if (myGamePiece.crashWithMe(myCollectables[i])) {
            newScore += 1;
            myScore.text = "SCORE: " + newScore;
            youLoseScreen();
        } 
        if (i==2){
            const highScore = localStorage.getItem("highestScore");
            if (newScore > highScore){
                localStorage.removeItem("highestScore");
                localStorage.setItem("higestScore", newScore);
                localStorage.getItem("highestScore");
                alert("Highest Score is " + newScore);
            }else{
                alert("Highest Score is " + highScore);
            }
            myGameArea.stop();
            endLevelOne();
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
        changePlayer();
        myBackground.speedX = -1;
        myBackground.newPos();
  myBackground.update();
    if (myGameArea.frameNo == 5 || everyinterval(250)) {
        x = myGameArea.canvas.width;
        z = getRndInteger(0,4)
        y = myGameArea.canvas.height - z;
        myObstacles.push(new component(50, 70, "pleft.png", x, y, "image"));
    }
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        z = getRndInteger(0,4)
        y = myGameArea.canvas.height - z;
        myCollectables.push(new component(60, 60, "jleft.png", x, y, "image"));
        
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
        changePepper(myObstacles[i]);
    }
    for (i = 0; i < myCollectables.length; i += 1) {
        myCollectables[i].x += -1;
        myCollectables[i].update();
        changeJam(myCollectables[i]);
    }
    
    
    
    
  myScore.update();
    myGamePiece.newPos();    
    myGamePiece.update();
    myCollectables.newPos();
    myCollectables.update();   
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup() {
    if (y==1 && myGamePiece.y>125) {
        myGamePiece.y -= 100;
        y=0; }

}

function movedown() {
    if (y==1 && myGamePiece.y<500) {
        myGamePiece.y += 100;
        y=0; }
}

function getRndInteger(min, max) {
    return ((Math.floor(Math.random() * (max - min + 1) ) + min)+0.75)*100;
}

function hideElement() {
    var x = document.getElementById("homePage");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }


  function endLevelOne() {
    var x = document.getElementById("levelOneComplete");

    let canvas = document.getElementById("myCanvas");
    let hidden = canvas.getAttribute("hidden");

    if (hidden) {
       canvas.removeAttribute("hidden");
    } else {
       canvas.setAttribute("hidden", "hidden");
       if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }
  }

  function youLoseScreen() {
    var x = document.getElementById("retryLevel");

    let canvas = document.getElementById("myCanvas");
    let hidden = canvas.getAttribute("hidden");

    if (hidden) {
       canvas.removeAttribute("hidden");
    } else {
       canvas.setAttribute("hidden", "hidden");
       if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }
  }

  function changePlayer(){
    if(everyinterval(10)){
        myGamePiece.image.src = "right.png";
    }if(everyinterval(15)){
        myGamePiece.image.src = "left.png";
    }
}

    function changeJam(x){
        if(everyinterval(10)){
            x.image.src = "jright.png";
        }if(everyinterval(15)){
            x.image.src = "jleft.png";
        }
   
  }

  function changePepper(x){
    if(everyinterval(10)){
        x.image.src = "pleft.png";
    }if(everyinterval(15)){
        x.image.src = "pright.png";
    }

}