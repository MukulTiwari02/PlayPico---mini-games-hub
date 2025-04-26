import React, { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import Wordle from "@/helpers/wordle";
import { words as WordsArray } from "@/helpers/wordle/choices";

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState("");

  useEffect(() => {
    const randomWord =
      WordsArray[Math.floor(Math.random() * WordsArray.length)];
    setWordle(new Wordle(randomWord.toUpperCase()));
    setTargetWord(randomWord.toUpperCase());
  }, []);

  const wordLength = 5;
  const [wordle, setWordle] = useState(new Wordle(targetWord));
  const [currentInput, setCurrentInput] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= wordLength) {
      setCurrentInput(value);
    }
  };

  const handleSubmitGuess = async () => {
    try {
      if (currentInput.length === wordLength) {
        const wordCheckResp = await fetch(
          `https://wordle-api-kappa.vercel.app/${currentInput}`,
          { method: "POST" }
        ).then((res) => res.json());
        if (!wordCheckResp.is_word_in_list)
          return alert(`${currentInput} is not a real word!`);
        const newWordle = Object.assign(
          Object.create(Object.getPrototypeOf(wordle)),
          wordle
        );
        newWordle.makeGuess(currentInput);
        setWordle(newWordle);
        setCurrentInput("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleNewWord() {
    const randomWord =
      WordsArray[Math.floor(Math.random() * WordsArray.length)];
    setTargetWord(randomWord.toUpperCase());
    const newWordle = new Wordle(randomWord.toUpperCase());
    setWordle(newWordle);
    setCurrentInput("");
  }

  const handleReset = () => {
    const newWordle = new Wordle(targetWord);
    setWordle(newWordle);
    setCurrentInput("");
  };

  const handleShowWord = () => {
    alert(`Target word was : ${targetWord}, try again!`);
    handleNewWord();
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
              ${
                wordle.usedLetters[letter] === "absent"
                  ? "bg-gray-600"
                  : "bg-gray-400"
              }
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
        <span className="sm:text-xl text-lg">Guess the word</span>
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

        <div className="flex gap-2 mt-4 max-md:grid grid-cols-2">
          <input
            type="text"
            value={currentInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmitGuess();
            }}
            onChange={handleInputChange}
            disabled={wordle.gameOver}
            className="p-2 border rounded-lg w-32 text-center text-black"
            placeholder="Enter guess"
          />
          <button
            onClick={handleSubmitGuess}
            disabled={wordle.gameOver || currentInput.length !== wordLength}
            className="p-2 bg-blue-500 active:scale-95 text-white rounded-lg"
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-red-500 active:scale-95 text-white rounded-lg"
          >
            Reset
          </button>
          <button
            onClick={handleNewWord}
            className="p-2 bg-green-500 active:scale-95 text-white rounded-lg"
          >
            New Word
          </button>
          <button
            onClick={handleShowWord}
            className="p-2 bg-yellow-600 active:scale-95 max-sm:col-span-2 text-white rounded-lg"
          >
            Give Up
          </button>
        </div>

        <div className="mt-4 max-md:scale-[.65] max-md:-mt-3">
          {renderKeyboard()}
        </div>
      </div>
    </GameLayout>
  );
};

export default WordleGame;
