class Wordle {
  constructor(targetWord, maxGuesses = 6) {
    this.targetWord = targetWord.toUpperCase();
    this.maxGuesses = maxGuesses;
    this.guesses = Array(maxGuesses)
      .fill(null)
      .map(() => "");
    this.currentGuessIndex = 0;
    this.gameOver = false;
    this.won = false;
    this.usedLetters = {}; 
  }

  makeGuess(guess) {
    if (this.gameOver || this.currentGuessIndex >= this.maxGuesses) return;

    const upperCaseGuess = guess.toUpperCase();
    if (upperCaseGuess.length !== this.targetWord.length) return;

    this.guesses[this.currentGuessIndex] = upperCaseGuess;

    if (upperCaseGuess === this.targetWord) {
      this.won = true;
      this.gameOver = true;
    } else if (this.currentGuessIndex === this.maxGuesses - 1) {
      this.gameOver = true;
    }

    this.updateUsedLetters(upperCaseGuess);
    this.currentGuessIndex++;
  }

  getFeedback(guess) {
    const feedback = Array(this.targetWord.length).fill("");

    const targetWordArr = this.targetWord.split("");
    const guessedArr = guess.split("");
    guessedArr.forEach((char, idx) => {
      if (char === targetWordArr[idx]) {
        feedback[idx] = "correct";
        targetWordArr[idx] = null; 
      }
    });

    guessedArr.forEach((char, idx) => {
      if (feedback[idx] === "" && targetWordArr.includes(char)) {
        feedback[idx] = "present";
        targetWordArr[targetWordArr.indexOf(char)] = null; 
      }
    });

    feedback.forEach((status, idx) => {
      if (status === "") feedback[idx] = "absent";
    });

    return feedback;
  }

  updateUsedLetters(guess) {
    const feedback = this.getFeedback(guess);
    guess.split("").forEach((char, idx) => {
      if (!this.usedLetters[char] || this.usedLetters[char] === "present") {
        this.usedLetters[char] = feedback[idx];
      }
    });
  }

  reset(targetWord) {
    this.targetWord = targetWord.toUpperCase();
    this.guesses = Array(this.maxGuesses)
      .fill(null)
      .map(() => "");
    this.currentGuessIndex = 0;
    this.gameOver = false;
    this.won = false;
    this.usedLetters = {};
  }
}

export default Wordle;