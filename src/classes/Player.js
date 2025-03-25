import {
  INITIAL_FRAME,
  PATH_ENGINE_IMG,
  PATH_SPACESHIP_IMG,
  PATH_SPRITES_IMG,
} from "../utils/constants.js";

class Player {
  constructor(canvasWidth, canvasHeight) {
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

  moveLeft() {
    this.position.x -= this.velocity;
  }

  moveRight() {
    this.position.x += this.velocity;
  }
}

export default Player;
