const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let gameFrame = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

//Defence
const mainDef = new Image(100, 104);
mainDef.src = "res/defence/main.png";
const mainAudio=new Audio("res/audio/def1.wav");
const DefenceArr = [];
class Defence {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.color = "red";
    this.speed = 5;
    mainAudio.currentTime = 0;
    mainAudio.play();
  }
  update() {
    if (this.x > 0) {
      this.x += this.speed;
    }
    if (this.y > 0) {
      this.y -= this.speed;
    }
  }

  drow() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(mainDef, this.x - 80, this.y - 20);
  }
}

//Player
const copterLeft = new Image(100, 104);
copterLeft.src = "res/copter/copter.png";
const copterRight = new Image();
copterRight.src = "res/copter/copter.png";
class Copter {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = 65;
    this.angle = 0;
  }

  update() {
    let dx = this.x - mouse.x;
    let dy = this.y - mouse.y;

    if (mouse.x != this.x) {
      this.x -= dx / 10;
      this.moving = true;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 10;
      this.moving = true;
    }
  }

  drow() {
    /*ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();*/
    ctx.drawImage(copterLeft, this.x - (100 / 2 + 7), this.y - (104 / 2 - 5));
  }

  trigerDefence() {
    DefenceArr.push(new Defence(this.x + 75, this.y -85));
  }
}

const copter = new Copter();
console.log(copter);
canvas.addEventListener("click", (e) => {
  copter.trigerDefence();
});

function handleCopter() {
  copter.update();
  copter.drow();
}
function handleDefance() {
  if (DefenceArr.length > 0) {
    for (i = 0; i < DefenceArr.length; i++) {
      DefenceArr[i].update();
      DefenceArr[i].drow();
      console.log(DefenceArr[i].y, DefenceArr[i].x);
      if (DefenceArr[i].y <= 0 || DefenceArr[i].x >= window.width) {
        DefenceArr.splice(i, 1);
      }
    }
  }
}

// Enemys
const enemyArray = [];
const enemy = new Image();
class Enemy {
  constructor() {
    this.x = Math.random() * (canvas.width * 2);
    this.y = 0 - 50 - (Math.random() * canvas.height) / 2;
    this.radius = 25;
    this.speed = Math.random() * -5 + -1;
    this.distance;
    this.imageDir = "res/enemy/";
    this.images = ["ast1.png", "ast2.png","ast3.png"];
    this.img =
      this.imageDir +
      this.images[Math.floor(Math.random() * this.images.length)];
    this.frameX = 0;
    this.spriteWidth = 50;
    this.spriteHeight = 50;
  }
  update() {
    this.x += this.speed;
    this.y -= this.speed;
    const dx = this.x - copter.x;
    const dy = this.y - copter.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    /*ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    */
    enemy.src = this.img;
    ctx.drawImage(
      enemy,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 25,
      this.y - 25,
      this.spriteWidth * 1,
      this.spriteHeight * 1
    );
  }
}
function handleEnemy() {
  for (let i = 0; i < enemyArray.length; i++) {
    if (enemyArray[i].y > canvas.height * 2) {
      enemyArray.splice(i, 1);
    }
  }
  for (let i = 0; i < enemyArray.length; i++) {
    if (enemyArray[i].distance < enemyArray[i].radius + copter.radius) {
      enemyArray.splice(i, 1);
    }
  }
  for (let i = 0; i < enemyArray.length; i++) {
    enemyArray[i].update();
    enemyArray[i].draw();
  }
  if (gameFrame % 50 == 0) {
    enemyArray.push(new Enemy());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.fillStyle='rgba(0,0,0,.5)';
  //ctx.fillRect(0,0,canvas.width,canvas.height);
  handleCopter();
  handleEnemy();
  handleDefance();
  gameFrame++;
  //console.log(particleArr.length);
  requestAnimationFrame(animate);
}
animate();
