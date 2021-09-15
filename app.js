const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//
var score = 0;
//Game Lavel Design
const GameLevel = [
  {
    label: "Lavel 1",
    enemySpeed: 2,
    enemyPerFream: 50,
    copter: "copter1",
    bg: "bg1",
    mainDefSpeed: 5,
  },
  {
    label: "Lavel 2",
    enemySpeed: 7,
    enemyPerFream: 30,
    copter: "copter2",
    bg: "bg2",
    mainDefSpeed: 7,
  },
  {
    label: "Lavel 3",
    enemySpeed: 12,
    enemyPerFream: 10,
    copter: "copter3",
    bg: "bg3",
    mainDefSpeed: 10,
  },
];
var currentLevelIndex = 0;
var currentLevel = GameLevel[currentLevelIndex];
let gameFrame = 0;
//Event and size config
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
const defenceObjects = {
  MainDef: {
    name: "Main Defence",
    damageCapability: 5,
    image: "main.png",
    sound: "def1.wav",
  },
  Missile: { name: "Missile", damageCapability: 20, image: "missile.png" },
};
const mainDef = new Image(100, 100);
const mainAudio = new Audio("res/audio/def1.wav");
const DefenceArr = [];
class Defence {
  constructor(x, y, weapon) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.color = "red";
    this.imageDir = "res/defence/";
    this.speed = currentLevel.mainDefSpeed;
    this.weapon = weapon;
    mainAudio.currentTime = 0;
    mainAudio.play();
    this.exe = false;
    this.energy = this.weapon.damageCapability;
  }
  update() {
    if (this.x < canvas.width + 100) {
      this.x += this.speed;
    }
    if (this.y > -100) {
      this.y -= this.speed;
    }
  }

  drow() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    //ctx.fill();
    //ctx.drawImage(mainDef, this.x - 80, this.y - 20);
    let f = 0; //Fream
    mainDef.src = this.imageDir + this.weapon.image;
    ctx.drawImage(
      mainDef,
      f * 100,
      0,
      100,
      100,
      this.x - 80,
      this.y - 20,
      100,
      100
    );
  }
  expl() {
    console.log("defence Died");
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
    this.imgDir = "res/copter/";
    this.size = 50;
    this.angle = 0;
    this.life = 100;
    this.onShield = true;
    this.shieldTime = 50;
    this.shieldCount = 0;
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
    //shield Time
    //console.log(this.shieldTime);
    if (this.onShield) {
      this.shieldTime -= 1;
      if (this.shieldTime <= 0) {
        this.onShield = false;
      }
    } else {
      this.shieldTime = 1000;
    }
  }

  drow() {
    //ctx.fillStyle = "white";

    //ctx.beginPath();
    //ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    //ctx.fill();
    ctx.drawImage(
      copterLeft,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2
    );
    if (this.onShield) {
      this.shield();
    }
  }

  trigerDefence() {
    DefenceArr.push(
      new Defence(this.x + 75, this.y - 85, defenceObjects.MainDef)
    );
  }
  MissileTriger() {
    DefenceArr.push(
      new Defence(this.x + 75, this.y - 85, defenceObjects.Missile)
    );
  }
  shield() {
    const shield = new Image();
    shield.src = this.imgDir + "shield.png";
    let siz = 150;
    ctx.drawImage(shield, this.x - siz / 2, this.y - siz / 2, siz, siz);
  }
}
//void

const copter = new Copter();
//console.log(copter);
canvas.addEventListener("click", (e) => {
  copter.trigerDefence();
});
window.addEventListener("keydown", (e) => {
  e = e || window.event; //Get event
  if (e.code == "KeyS") {
    //S key for Active shield
    if (!copter.onShield) {
      if (copter.shieldCount > 0) {
        copter.onShield = true;
        copter.shieldCount--;
      } else {
        console.log("Not have any shield");
      }
    }
  }
  if (e.code == "KeyM") {
    copter.MissileTriger();
  }
});

function handleCopter() {
  copter.update();
  copter.drow();
  //console.log(copter.shieldCount);
  if (copter.life <= 0) {
    console.log("Game Over");
  }
  //console.log(copter.life);
}

// Enemis
const enemyObjects = [
  { name: "Astroyed", damageCapability: 10, image: "ast1.png", score: 2 },
  { name: "Fire Astroyed", damageCapability: 20, image: "ast2.png", score: 4 },
  {
    name: "Small Fire Astroyed",
    damageCapability: 5,
    image: "ast3.png",
    score: 1,
  },
  { name: "Shield", damageCapability: 0, image: "shield.png" },
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
    this.energy = this.type.damageCapability;
    this.score = this.type.score;
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
  expl() {
    score += this.score;
    //console.log(this.type.damageCapability);
    console.log("Enemy Died");
  }
}
function handleEnemy() {
  for (let i = 0; i < enemyArray.length; i++) {
    //console.log(enemyArray[i].type.damageCapability);

    if (enemyArray[i].y > canvas.height * 2) {
      enemyArray.splice(i, 1);
    }
    if (enemyArray[i].energy <= 0 && enemyArray[i].type.name != "Shield") {
      enemyArray[i].expl(); //
      enemyArray.splice(i, 1);
    }
  }
  if (!copter.onShield) {
    //Colision
    for (let i = 0; i < enemyArray.length; i++) {
      if (enemyArray[i].distance < enemyArray[i].radius + copter.size) {
        //console.log("Hited the Copter");
        if (!enemyArray[i].hited) {
          //Damage Copter Life
          if (enemyArray[i].type.name == "Shield" && copter.shieldCount < 3) {
            copter.shieldCount++;
          }
          if (copter.life > 0) {
            copter.life -= enemyArray[i].energy;
          }
          enemyArray[i].hited = true;
        }
        enemyArray.splice(i, 1);
      }
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

function handleDefance() {
  if (DefenceArr.length > 0) {
    for (i = 0; i < DefenceArr.length; i++) {
      DefenceArr[i].update();
      DefenceArr[i].drow();
      //console.log(DefenceArr[i].y, DefenceArr[i].x);
      for (j = 0; j < enemyArray.length; j++) {
        let DEx = enemyArray[j].x - DefenceArr[i].x;
        let DEy = enemyArray[j].y - DefenceArr[i].y;
        let enD = Math.sqrt(DEx * DEx + DEy * DEy);
        if (enemyArray[j].type.name != "Shield") {
          if (enD < 25) {
            if (!DefenceArr[i].exe) {
              if (enemyArray[j].energy > 0) {
                enemyArray[j].energy -= DefenceArr[i].energy;
              }
              if (DefenceArr[i].energy > 0) {
                DefenceArr[i].energy -= enemyArray[j].energy;
              }
              DefenceArr[i].exe = true;
            }
          }
        }
      }

      if (DefenceArr[i].energy <= 0) {
        DefenceArr[i].expl(); //
      }

      if (
        DefenceArr[i].y <= -100 ||
        DefenceArr[i].x >= window.width + 100 ||
        DefenceArr[i].energy <= 0
      ) {
        DefenceArr.splice(i, 1);
      }
    }
  }
}

function PlayerInfo() {
  let startPoint = canvas.width - 120;
  let life = copter.life;
  ctx.strokeStyle = "green";
  if (life < 30) {
    ctx.strokeStyle = "red";
  } else if (life < 50) {
    ctx.strokeStyle = "yellow";
  }
  let endPoint = startPoint + life;
  ctx.beginPath();
  ctx.moveTo(startPoint, canvas.height - 20);
  ctx.lineWidth = 15;
  //ctx.lineCap = "round";
  ctx.lineTo(endPoint, canvas.height - 20);
  ctx.stroke();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(canvas.width - 122, canvas.height - 30, 104, 20);
  ctx.stroke();
  //Life

  ctx.font = "60px Verdana";
  // Create gradient
  var gradient = ctx.createLinearGradient(0, 0, 100, 0);
  gradient.addColorStop("0", " magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");
  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillText(score, 10, 70);
  if (score > 50) {
    currentLevelIndex++;
    currentLevel = GameLevel[currentLevelIndex];
    score = 0;
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.fillStyle='rgba(0,0,0,.5)';
  //ctx.fillRect(0,0,canvas.width,canvas.height);
  handleCopter();
  handleEnemy();
  handleDefance();
  PlayerInfo();
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
