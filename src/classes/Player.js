class Player {
  constructor(canvasWidth, canvasHeight) {
    this.width = 100;
    this.height = 100;
    this.velocity = 6;
    this.position = {
      x: canvasWidth / 2 - this.width / 2,
      y: canvasHeight - this.height - 50,
    };
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  moveLeft() {
    this.position.x -= this.velocity;
  }

  moveRight() {
    this.position.x += this.velocity;
  }
}

export default Player;
