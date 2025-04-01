import Invader from "./Invader.js";

class Grid {
  constructor(rows, colums) {
    this.rows = rows;
    this.colums = colums;
    this.invadersVelocity = 1;
    this.invadersGrid = this.init();
  }

  init() {
    const invaders = [];

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.colums; col += 1) {
        const invader = new Invader(
          {
            x: col,
            y: row,
          },
          this.invadersVelocity
        );
        invaders.push(invader);
      }
    }
    return invaders;
  }
}

export default Grid;
