class Board {
  constructor(size, minesCount) {
    this.size = size;
    this.minesCount = minesCount;
    this.board = this.generateBoard(size, minesCount);
    this.gameOver = false;
  }

  generateBoard(size, minesCount) {
    const board = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        revealed: false,
        flagged: false,
        value: 0,
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (board[x][y].value !== "X") {
        board[x][y].value = "X";
        minesPlaced++;
      }
    }

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (board[x][y].value === "X") continue;

        let mineCount = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (
              nx >= 0 &&
              nx < size &&
              ny >= 0 &&
              ny < size &&
              board[nx][ny].value === "X"
            ) {
              mineCount++;
            }
          }
        }
        board[x][y].value = mineCount;
      }
    }

    return board;
  }

  revealTile(x, y) {
    const tile = this.board[x][y];
    if (tile.revealed || tile.flagged) return;

    tile.revealed = true;

    if (tile.value === "X") {
      this.gameOver = true;
      return;
    }

    if (tile.value === 0) {
      this.revealNeighbors(x, y);
    }
  }

  revealNeighbors(x, y) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const nx = x + i;
        const ny = y + j;
        if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
          const neighbor = this.board[nx][ny];
          if (!neighbor.revealed && !neighbor.flagged) {
            this.revealTile(nx, ny);
          }
        }
      }
    }
  }

  flagsLeft() {
    let flags = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board[x][y].flagged) {
          flags++;
        }
      }
    }
    return this.minesCount - flags;
  }

  toggleFlag(x, y) {
    const tile = this.board[x][y];
    if (tile.revealed) return;
    if(this.flagsLeft == 0) return;
    tile.flagged = !tile.flagged;
  }

  isGameWon() {
    return this.board.every((row) =>
      row.every(
        (tile) =>
          (tile.value === "X" && tile.flagged) ||
          (tile.value !== "X" && tile.revealed)
      )
    );
  }
}

export default Board;
