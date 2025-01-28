class Board {
    constructor(player1 = "PLAYER 1 (O)", player2 = "PLAYER 2 (X)") {
      this.player1 = player1;
      this.player2 = player2;
      this.currentPlayer = player1;
      this.board = Array(9).fill("");
      this.winner = null;
      this.winCombo = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8],
      ];
    }
  
    takeTurn(index) {
      if (this.board[index] === "" && !this.winner) {
        this.board[index] = this.currentPlayer === this.player1 ? "O" : "X";
        this.checkWin();
        if (!this.winner) this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
      }
    }
  
    checkWin() {
      this.winCombo.forEach((combo) => {
        const [a, b, c] = combo;
        if (
          this.board[a] &&
          this.board[a] === this.board[b] &&
          this.board[b] === this.board[c]
        ) {
          this.winner = this.currentPlayer;
        }
      });
    }
  
    checkDraw() {
      return this.board.every((cell) => cell !== "") && !this.winner;
    }
  
    reset() {
      this.board = Array(9).fill("");
      this.currentPlayer = this.player1;
      this.winner = null;
    }
  }

  export default Board;