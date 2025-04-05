import Grid from "./classes/Grid.js";
import Invader from "./classes/Invader.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";
import { GameState } from "./utils/constants.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

let currentState = GameState.PLAYING;

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);
const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

const initObstacles = () => {
  const x = canvas.width / 2 - 50;
  const y = canvas.height / 2 - 250;
  const offset = canvas.width * 0.15;
  const color = "crimson";

  const obst1 = new Obstacle({ x: x - offset, y }, 100, 20, color);
  const obst2 = new Obstacle({ x: x + offset, y }, 100, 20, color);

  obstacles.push(obst1);
  obstacles.push(obst2);
};

initObstacles();

const keys = {
  left: false,
  right: false,
  shoot: {
    pressed: false,
    released: true,
  },
};

const drawObstacles = () => {
  obstacles.forEach((obstacle) => obstacle.draw(ctx));
};

const drawProjectiles = () => {
  const projectiles = [...playerProjectiles, ...invaderProjectiles];

  projectiles.forEach((projectile) => {
    projectile.draw(ctx);
    projectile.updateDraw();
  });
};

const drawParticles = () => {
  particles.forEach((particle) => {
    particle.draw(ctx);
    particle.update();
  });
};

const clearProjectiles = () => {
  playerProjectiles.forEach((projectile, index) => {
    if (projectile.position.y <= 0) {
      playerProjectiles.splice(index, 1);
    }
  });
};

const clearParticles = () => {
  particles.forEach((particle, i) => {
    if (particle.opacity <= 0) {
      particles.splice(i, 1);
    }
  });
};

const createExplosion = (position, size, color) => {
  for (let i = 0; i < size; i += 1) {
    const particle = new Particle(
      {
        x: position.x,
        y: position.y,
      },
      {
        x: Math.random() - 0.5 * 2,
        y: Math.random() - 0.5 * 2,
      },
      2,
      color
    );

    particles.push(particle);
  }
};

const shootPlayer = () => {
  invaderProjectiles.some((projectile, projectileIndex) => {
    if (player.gotHit(projectile)) {
      invaderProjectiles.splice(projectileIndex, 1);
      gameOver();
    }
  });
};

const shootInvaders = () => {
  grid.invadersGrid.forEach((invader, invaderIndex) => {
    playerProjectiles.some((projectile, projectileIndex) => {
      if (invader.gotHit(projectile)) {
        createExplosion(
          {
            x: invader.position.x + invader.width / 2,
            y: invader.position.y + invader.height / 2,
          },
          10,
          "#941CFF"
        );
        grid.invadersGrid.splice(invaderIndex, 1);
        playerProjectiles.splice(projectileIndex, 1);
      }
    });
  });
};

const shootObstacle = () => {
  obstacles.forEach((obstacle) => {
    playerProjectiles.some((projectile, projectileIndex) => {
      if (obstacle.gotHit(projectile)) {
        playerProjectiles.splice(projectileIndex, 1);
      }
    });

    invaderProjectiles.some((projectile, projectileIndex) => {
      if (obstacle.gotHit(projectile)) {
        invaderProjectiles.splice(projectileIndex, 1);
      }
    });
  });
};

const spawnGrid = () => {
  if (grid.invadersGrid.length === 0) {
    grid.rows = Math.round(Math.random * 9 + 1);
    grid.colums = Math.round(Math.random * 9 + 1);
    grid.restart();
  }
};

const gameOver = () => {
  createExplosion(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2,
    },
    10,
    "white"
  );

  createExplosion(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2,
    },
    10,
    "#4D9BE6"
  );

  createExplosion(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2,
    },
    10,
    "crimson"
  );

  currentState = GameState.GAME_OVER;
  player.alive = false;
};

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentState == GameState.PLAYING) {
    spawnGrid();

    drawProjectiles();
    drawParticles();
    drawObstacles();

    clearProjectiles();
    clearParticles();

    shootPlayer();
    shootInvaders();
    shootObstacle();

    grid.draw(ctx);
    grid.update(player.alive);

    ctx.save();

    ctx.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );

    if (keys.shoot.pressed && keys.shoot.released) {
      player.shoot(playerProjectiles);
      keys.shoot.released = false;
    }

    if (keys.left && player.position.x >= 0) {
      player.moveLeft();
      ctx.rotate(-0.15);
    }
    if (keys.right && player.position.x <= canvas.width - 100) {
      player.moveRight();
      ctx.rotate(0.15);
    }

    ctx.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    player.draw(ctx);
    ctx.restore();
  }

  if (currentState == GameState.GAME_OVER) {
    drawParticles();
    drawProjectiles();
    drawObstacles();

    shootObstacle();

    clearProjectiles();
    clearParticles();

    grid.draw(ctx);
    grid.update(player.alive);
  }

  requestAnimationFrame(gameLoop);
};

addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a") keys.left = true;
  if (key === "d") keys.right = true;
  if (key === "enter") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a") keys.left = false;
  if (key === "d") keys.right = false;
  if (key === "enter") {
    keys.shoot.pressed = false;
    keys.shoot.released = true;
  }
});

setInterval(() => {
  const invader = grid.getRandominvader();
  if (invader) {
    invader.shoot(invaderProjectiles);
  }
}, 2000);

gameLoop();
