import React, { useState } from "react";
import Board from "@/helpers/tic-tac-toe/board";
import GameLayout from "@/components/GameLayout";
import styles from "@/styles/tic-tac-toe/style.module.css";

const TicTacToeGamePage = () => {
  const [board, setBoard] = useState(new Board());
  const [currentPlayer, setCurrentPlayer] = useState(board.currentPlayer);
  const [winner, setWinner] = useState(board.winner);
  const [isDraw, setIsDraw] = useState(false);

  const handleCellClick = (index) => {
    const newBoard = Object.create(Object.getPrototypeOf(board));
    Object.defineProperties(newBoard, Object.getOwnPropertyDescriptors(board));
    newBoard.takeTurn(index);
    newBoard.checkWin();
    setBoard(newBoard);
    setCurrentPlayer(newBoard.currentPlayer);
    setWinner(newBoard.winner);
    setIsDraw(newBoard.checkDraw());
  };

  const resetGame = () => {
    const newBoard = Object.create(Object.getPrototypeOf(board));
    Object.defineProperties(newBoard, Object.getOwnPropertyDescriptors(board));
    newBoard.reset();
    setBoard(newBoard);
    setCurrentPlayer(newBoard.currentPlayer);
    setWinner(null);
    setIsDraw(false);
  };
  return (
    <GameLayout>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="mb-4 text-2xl font-bold text-gray-800">
          {winner
            ? `${winner} Wins!`
            : isDraw
            ? "Game Draw"
            : `${currentPlayer}'s Turn`}
        </div>
        <div
          className={
            "mt-3 relative grid grid-cols-3 grid-rows-3 w-[55vmin] h-[55vmin] " +
            styles.main
          }
        >
          {board.board.map((cell, cellIndex) => {
            return (
              <div
                onClick={() => handleCellClick(cellIndex)}
                key={cellIndex}
                className="text-8xl"
              >
                {cell}
              </div>
            );
          })}
          {winner && (
            <span className="top-0 left-0 absolute h-full">
              <img
                className="h-full w-full"
                src={"/assets/tic-tac-toe/winnerCelebration.webp"}
                alt=""
              />
            </span>
          )}
        </div>
        {
          <img
            className={
              "mt-5 transition-all ease-in-out " + (winner ? "h-32" : "h-0")
            }
            src={"/assets/tic-tac-toe/winner.webp"}
          />
        }

        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={resetGame}
        >
          Reset
        </button>
      </div>
    </GameLayout>
  );
};

export default TicTacToeGamePage;
