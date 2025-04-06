import Invader from "./Invader.js";

class Grid {
  constructor(rows, colums) {
    this.rows = rows;
    this.colums = colums;
    this.direction = "right";
    this.moveDown = false;
    this.invadersVelocity = 10;
    this.invadersGrid = this.init();
  }

  init() {
    const invaders = [];

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.colums; col += 1) {
        const invader = new Invader(
          {
            x: col * 50 + 40,
            y: row * 36 + 120,
          },
          this.invadersVelocity
        );
        invaders.push(invader);
      }
    }
    return invaders;
  }

  draw(ctx) {
    this.invadersGrid.forEach((invader) => invader.draw(ctx));
  }

  update(playerStatus) {
    if (this.reachedRightBorder()) {
      this.direction = "left";
      this.moveDown = true;
    } else if (this.reachedLeftBorder()) {
      this.direction = "right";
      this.moveDown = true;
    }

    if (!playerStatus) this.moveDown = false;

    this.invadersGrid.forEach((invader) => {
      if (this.moveDown) {
        invader.moveDown();
        invader.incrementVelocity(1);
        this.invadersVelocity = invader.velocity;
      }
      if (this.direction === "right") invader.moveRight();
      if (this.direction === "left") invader.moveLeft();
    });
    this.moveDown = false;
  }

  reachedRightBorder() {
    return this.invadersGrid.some(
      (invader) => invader.position.x + invader.width >= window.innerWidth
    );
  }

  reachedLeftBorder() {
    return this.invadersGrid.some((invader) => invader.position.x <= 0);
  }

  getRandominvader() {
    const index = Math.floor(Math.random() * this.invadersGrid.length);
    return this.invadersGrid[index];
  }

  restart() {
    this.invadersGrid = this.init();
    this.direction = "right";
  }
}

export default Grid;
