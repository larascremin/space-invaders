import {
  INITIAL_FRAME,
  PATH_ENGINE_IMG,
  PATH_SPACESHIP_IMG,
  PATH_SPRITES_IMG,
} from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player {
  constructor(canvasWidth, canvasHeight) {
    this.alive = true;
    this.width = 96;
    this.height = 96;
    this.velocity = 8;
    this.position = {
      x: canvasWidth / 2 - this.width / 2,
      y: canvasHeight - this.height - 50,
    };

    this.image = this.getImage(PATH_SPACESHIP_IMG);
    this.engineImage = this.getImage(PATH_ENGINE_IMG);
    this.spriteImage = this.getImage(PATH_SPRITES_IMG);

    this.sx = 0;
    this.framesCounter = INITIAL_FRAME;
  }

  getImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    ctx.drawImage(
      this.spriteImage,
      this.sx,
      0,
      48,
      48,
      this.position.x,
      this.position.y + 6,
      this.width,
      this.height
    );

    ctx.drawImage(
      this.engineImage,
      this.position.x,
      this.position.y + 4,
      this.width,
      this.height
    );

    this.updateSx();
  }

  updateSx() {
    if (this.framesCounter === 0) {
      this.sx = this.sx === 96 ? 0 : this.sx + 48;
      this.framesCounter = INITIAL_FRAME;
    }

    this.framesCounter--;
  }

  shoot(projectiles) {
    const p = new Projectile(
      {
        x: this.position.x + this.width / 2 - 1,
        y: this.position.y + 3,
      },
      -10
    );

    projectiles.push(p);
  }

  moveLeft() {
    this.position.x -= this.velocity;
  }

  moveRight() {
    this.position.x += this.velocity;
  }

  gotHit(projectile) {
    return (
      projectile.position.x >= this.position.x + 20 &&
      projectile.position.x <= this.position.x + 20 + this.width - 38 &&
      projectile.position.y >= this.position.y + 22 &&
      projectile.position.y <= this.position.y + 22 + this.height - 34
    );
  }
}

export default Player;
