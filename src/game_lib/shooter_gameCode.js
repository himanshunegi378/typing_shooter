var ctx;
var keyState;
var keyUp;
var keyDown;
var keyLeft;
var keyRight;
var keyShoot;
var keyStart;
var FPS;
var start;
var score;
var player;
var enemyPlayer;
var pBullets, eBullets;
var enemies, bParticles, w_delay;
var canvas;
var e;
var isAlive = true;
var events = require("events");
e = new events.EventEmitter();

///////////////////////////////////////////////////
// Player Class
class Player {
  hit_delay = 0;
  constructor() {
    // private variables
    var HP = 150;
    var dmg = 1;
    var w_type = 1;
    var cd_factor = 10;

    // private methods
    this.getHP = function() {
      return HP;
    };
    this.getHit = function() {
      HP -= 50;
      this.hit_delay = 50;
    };
    this.getWtype = function() {
      return w_type;
    };
    this.getCD = function() {
      return cd_factor;
    };

    // public properties
    this.active = true;
    this.color = "white";
    this.width = 35;
    this.height = 35;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height;
  }

  draw() {
    if (this.hit_delay > 0) {
      if (Math.sin(this.hit_delay) > 0) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = this.color;
      }
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  shoot(vel, bulletArray) {
    bulletArray.push(
      new Bullet({
        vel: vel,
        x: this.x + this.width / 2,
        y: this.y
      })
    );
  }
}

///////////////////////////////////////////////////

///////////////////////////////////////////////////
// Bullet Class
class Bullet {
  constructor(bullet) {
    this.active = true;
    this.color = "yellow";
    this.yVel = -bullet.vel;
    this.width = 4;
    this.height = 10;
    this.x = bullet.x;
    this.y = bullet.y;
  }

  inBounds() {
    return (
      this.x >= 0 &&
      this.x <= canvas.width &&
      this.y >= 0 &&
      this.y <= canvas.height
    );
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.yVel;
    this.active = this.inBounds() && this.active;
  }

  die() {
    this.active = false;
  }
}

///////////////////////////////////////////////////

///////////////////////////////////////////////////
// Enemy Class
class Enemy {
  constructor() {
    this.active = true;
    this.color = "red";
    this.x = canvas.width * Math.random();
    this.y = 0;
    this.xVel = 0;
    this.yVel = 4;
    this.width = 30;
    this.height = 30;
  }

  inBounds() {
    return (
      this.x >= 0 &&
      this.x <= canvas.width &&
      this.y >= 0 &&
      this.y <= canvas.height
    );
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (Math.abs(player.y - this.y) < 200) {
      if (player.x - this.x > 0) {
        this.xVel = 2;
      } else if (player.x - this.x < 0) {
        this.xVel = -2;
      } else {
        this.xVel = 0;
      }
    }
    this.x += this.xVel;
    this.y += this.yVel;
    this.active = this.active && this.inBounds();
  }

  die() {
    this.active = false;
    score += 10;
  }
}

///////////////////////////////////////////////////

///////////////////////////////////////////////////
// Background particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.xVel = 0;
    this.yVel = 1;
    this.width = 1;
    this.height = 1;
    this.color = "#F2F5A9";
    this.active = true;
  }

  inBounds() {
    return (
      this.x >= 0 &&
      this.x <= canvas.width &&
      this.y >= 0 &&
      this.y <= canvas.height
    );
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.yVel;
    this.active = this.active && this.inBounds();
  }
}

///////////////////////////////////////////////////

function init(_canvas, _ctx) {
  // load canvas

  canvas = _canvas;
  ctx = _ctx;
  canvas.width = 500;
  canvas.height = 500;

  // input setup
  keyState = [];
  keyState.length = 256;
  canvas.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("keyup", onKeyUp);

  // key setup
  keyUp = 87;
  keyDown = 83;
  keyLeft = 65;
  keyRight = 68;
  keyShoot = 32;
  keyStart = 13; // fps
  FPS = 30; // game start?
  start = true; // score
  score = 0; // create player object
  player = new Player(); // storing in-game objects
  enemyPlayer = new Player();
  enemyPlayer.x = canvas.width / 2 - enemyPlayer.width / 2;
  enemyPlayer.y = 0;
  enemyPlayer.color = "red";
  pBullets = []; // weapon delay // player hit delay
  eBullets = [];
  enemies = [];
  bParticles = [];
  w_delay = 0;

  // keydown functions
  function onKeyDown(event) {
    e.emit("key_pressed", event.keyCode);
    keyState[event.keyCode] = true;
    console.log(event.keyCode);
  }

  function onKeyUp(event) {
    keyState[event.keyCode] = false;
  }

  ///////////////////////////////////////////////////
  // collision check & handling
  function collisionCheck(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function collisionOccurs() {
    pBullets.forEach(function(bullet) {
      if (collisionCheck(bullet, enemyPlayer)) {
        bullet.die();
        enemyPlayer.getHit();
      }
    });

    eBullets.forEach(function(bullet) {
      if (collisionCheck(bullet, player)) {
        bullet.die();
        player.getHit();
      }
    });
    pBullets.forEach(function(playerBullet) {
      eBullets.forEach(function(enemyBullet) {
        if (collisionCheck(playerBullet, enemyBullet)) {
          enemyBullet.die();
          playerBullet.die();
          return;
        }
      });
    });
    // pBullets.forEach(function(bullet) {
    //   enemies.forEach(function(enemy) {
    //     if (collisionCheck(bullet, enemy)) {
    //       bullet.die();
    //       enemy.die();
    //     }
    //   });
    // });
    //
    // enemies.forEach(function(enemy) {
    //   if (collisionCheck(enemy, player)) {
    //     if (hit_delay === 0) {
    //       enemy.die();
    //       player.getHit();
    //     }
    //   }
    // });
  }

  ///////////////////////////////////////////////////

  ///////////////////////////////////////////////////
  // interval functions
  setInterval(function() {
    // canvas.focus();
    startGame();
    if (start) {
      if (player.getHP() > 0) update();
      draw();
    }
  }, 1000 / FPS);

  function startGame() {
    if (!start) {
      ctx.font = "30pt Calibri";
      ctx.fillStyle = "white";
      ctx.fillText("Press Enter to Start", 47, 180);
      ctx.font = "20pt Calibri";
      ctx.fillText("WASD - move", 47, 210);
      ctx.fillText("Space - shoot", 47, 240);
    }
  }

  function update() {
    // movements
    if (keyState[keyUp] && player.y > 0) player.y -= 4;
    if (keyState[keyDown] && player.y < canvas.height - player.height)
      player.y += 4;
    if (keyState[keyLeft] && player.x > 0) player.x -= 4;
    if (keyState[keyRight] && player.x < canvas.width - player.width)
      player.x += 4;

    // background particles
    if (Math.random() < 0.04) bParticles.push(new Particle());

    bParticles.forEach(function(particle) {
      particle.update();
    });

    bParticles = bParticles.filter(function(particle) {
      return particle.active;
    });

    // shooting
    // if (keyState[keyShoot]) player.shoot();

    pBullets.forEach(function(bullet) {
      bullet.update();
    });

    pBullets = pBullets.filter(function(bullet) {
      return bullet.active;
    });

    eBullets.forEach(function(bullet) {
      bullet.update();
    });

    eBullets = eBullets.filter(function(bullet) {
      return bullet.active;
    });

    if (w_delay > 0) w_delay -= player.getCD();

    // enemies
    // if(Math.random() < 0.14)
    //   enemies.push(new Enemy());

    // enemies.forEach(function(enemy) {
    //   enemy.update();
    // });

    // enemies = enemies.filter(function(enemy) {
    //   return enemy.active;
    // });

    // collision
    collisionOccurs();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bParticles.forEach(function(particle) {
      particle.draw();
    });

    player.draw();
    enemyPlayer.draw();

    pBullets.forEach(function(bullet) {
      bullet.draw();
    });

    eBullets.forEach(function(bullet) {
      bullet.draw();
    });

    enemies.forEach(function(enemy) {
      enemy.draw();
    });

    // game over
    if ((player.getHP() <= 0) & isAlive) {
      isAlive = !isAlive;
      e.emit("player_died");
      ctx.font = "20pt Calibri";
      ctx.fillStyle = "white";
      ctx.fillText("Game Over", 170, 220);
    }

    // keeping score
    ctx.font = "8pt Calibri";
    ctx.fillStyle = "white";
    ctx.fillText(score, 5, 15);
  }

  ///////////////////////////////////////////////////
}

function shoot() {
  player.shoot(7, pBullets);
}

function enemyShoot() {
  enemyPlayer.shoot(-7, eBullets);
}

e.on("player_shoot", () => shoot());
e.on("enemy_shoot", () => enemyShoot());
e.on("new_game", (canvas, ctx) => {
  init(canvas, ctx);
});

export { e };
