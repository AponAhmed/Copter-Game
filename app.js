const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//Game Lavel Design
const GameLevel = {
  L1: {
    label: "Lavel 1",
    enemySpeed: 5,
    enemyPerFream: 50,
    copter: "copter1",
    bg: "bg1",
    mainDefSpeed: 5,
  },
  L2: {
    label: "Lavel 2",
    enemySpeed: 7,
    enemyPerFream: 30,
    copter: "copter2",
    bg: "bg2",
    mainDefSpeed: 7,
  },
  L3: {
    label: "Lavel 3",
    enemySpeed: 12,
    enemyPerFream: 10,
    copter: "copter3",
    bg: "bg3",
    mainDefSpeed: 10,
  },
};
var currentLevel = GameLevel.L1;

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
const defenceObjects = [
  { name: "Main Defence", damageCapability: 10, image: "main.png" },
  { name: "Fire Astroyed", damageCapability: 20, image: "def2.png" },
];
const mainDef = new Image(100, 104);
mainDef.src = "res/defence/main.png";
const mainAudio = new Audio("res/audio/def1.wav");
const DefenceArr = [];
class Defence {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.color = "red";
    this.speed = currentLevel.mainDefSpeed;
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
    this.life = 100;
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
    DefenceArr.push(new Defence(this.x + 75, this.y - 85));
  }
}

const copter = new Copter();
//console.log(copter);
canvas.addEventListener("click", (e) => {
  copter.trigerDefence();
});

function handleCopter() {
  copter.update();
  copter.drow();
  console.log(copter.life);
}
function handleDefance() {
  if (DefenceArr.length > 0) {
    for (i = 0; i < DefenceArr.length; i++) {
      DefenceArr[i].update();
      DefenceArr[i].drow();
      //console.log(DefenceArr[i].y, DefenceArr[i].x);
      if (DefenceArr[i].y <= 0 || DefenceArr[i].x >= window.width) {
        DefenceArr.splice(i, 1);
      }
    }
  }
}

// Enemis
const enemyObjects = [
  { name: "Astroyed", damageCapability: 10, image: "ast1.png" },
  { name: "Fire Astroyed", damageCapability: 20, image: "ast2.png" },
  { name: "Small Fire Astroyed", damageCapability: 5, image: "ast3.png" },
];

const enemyArray = [];
const enemy = new Image();
class Enemy {
  constructor() {
    this.x = Math.random() * (canvas.width * 2);
    this.y = 0 - 50 - (Math.random() * canvas.height) / 2;
    this.radius = 25;
    this.speed = Math.random() * -currentLevel.enemySpeed + -1;
    this.distance;
    this.imageDir = "res/enemy/";
    this.type = enemyObjects[Math.floor(Math.random() * enemyObjects.length)];
    //this.img =this.imageDir + this.images[Math.floor(Math.random() * this.images.length)];
    this.img = this.imageDir + this.type.image;
    this.frameX = 0;
    this.spriteWidth = 50;
    this.spriteHeight = 50;
    this.hited = false;
  }
  update() {
    this.x += this.speed;
    this.y -= this.speed;
    const dx = this.x - copter.x;
    const dy = this.y - copter.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
    //console.log(this.distance);
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
    if (enemyArray[i].distance < enemyArray[i].radius + copter.size) {
      //console.log("Hited the Copter");
      if (!enemyArray[i].hited) {
        //Damage Copter Life
        copter.life -= enemyArray[i].type.damageCapability;
        enemyArray[i].hited = true;
      }
      enemyArray.splice(i, 1);
    }
  }
  for (let i = 0; i < enemyArray.length; i++) {
    enemyArray[i].update();
    enemyArray[i].draw();
  }
  if (gameFrame % currentLevel.enemyPerFream == 0) {
    enemyArray.push(new Enemy());
  }
  //console.log(enemyArray.length);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.fillStyle='rgba(0,0,0,.5)';
  //ctx.fillRect(0,0,canvas.width,canvas.height);
  handleCopter();
  handleEnemy();
  handleDefance();
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
