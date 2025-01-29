import React, { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import Wordle from "@/helpers/wordle";

const WordleGame = () => {
  // TODO: Fetch a random word from the wordle api
  const targetWord = "REACT";

  const wordLength = targetWord.length;
  const [wordle, setWordle] = useState(new Wordle(targetWord));
  const [currentInput, setCurrentInput] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= wordLength) {
      setCurrentInput(value);
    }
  };

  const handleSubmitGuess = () => {
    // TODO: Check if the entered word is valid or not using the wordle api
    if (currentInput.length === wordLength) {
      const newWordle = Object.assign(
        Object.create(Object.getPrototypeOf(wordle)),
        wordle
      );
      newWordle.makeGuess(currentInput);
      setWordle(newWordle);
      setCurrentInput("");
    }
  };

  const handleReset = () => {
    const newWordle = new Wordle(targetWord);
    setWordle(newWordle);
    setCurrentInput("");
  };

  const renderKeyboard = () => {
    const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

    return keyboardRows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center gap-1 mb-2">
        {row.split("").map((letter) => (
          <button
            key={letter}
            className={`p-2 rounded-md w-10 h-10 font-bold text-white text-center 
              ${wordle.usedLetters[letter] === "correct" ? "bg-green-500" : ""}
              ${wordle.usedLetters[letter] === "present" ? "bg-yellow-500" : ""}
              ${wordle.usedLetters[letter] === "absent" ? "bg-gray-600" : "bg-gray-400"}
            `}
            disabled
          >
            {letter}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <GameLayout>
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-rows-6 gap-2">
          {wordle.guesses.map((guess, index) => (
            <div key={index} className="grid grid-cols-5 gap-1">
              {[...Array(wordLength)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex justify-center items-center border rounded-lg text-lg font-bold ${
                    guess
                      ? wordle.getFeedback(guess)[idx] === "correct"
                        ? "bg-green-500 text-white"
                        : wordle.getFeedback(guess)[idx] === "present"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300"
                      : "bg-white"
                  }`}
                >
                  {guess ? guess[idx] : ""}
                </div>
              ))}
            </div>
          ))}
        </div>

        {wordle.gameOver && (
          <div className="text-xl font-bold text-red-500">
            {wordle.won ? "You Win!" : "Game Over!"}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            disabled={wordle.gameOver}
            className="p-2 border rounded-lg w-32 text-center"
            placeholder="Enter guess"
          />
          <button
            onClick={handleSubmitGuess}
            disabled={wordle.gameOver || currentInput.length !== wordLength}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-red-500 text-white rounded-lg"
          >
            Reset
          </button>
        </div>

        <div className="mt-4">{renderKeyboard()}</div>
      </div>
    </GameLayout>
  );
};

export default WordleGame;
