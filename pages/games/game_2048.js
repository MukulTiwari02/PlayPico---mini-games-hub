import { Board } from "@/helpers/2048";
import { useEffect, useState } from "react";
import GameLayout from "@/components/GameLayout";

export default function GamePage_2048Animated() {
  const [board, setBoard] = useState(new Board());

  function setNewGame() {
    setBoard(new Board());
  }

  return (
    <GameLayout>
      <div className="flex justify-between w-[60vmin] mb-5">
        <button
          className="cursor-pointer text-xl sm:text-3xl px-4 transition-colors duration-300 ease rounded-lg hover:bg-[#d3386a] hover:text-white  bg-purple-700 text-neutral-300"
          onClick={setNewGame}
        >
          New Game
        </button>
        <div className="">
          <span className="text-xl sm:text-3xl">Score</span>
          <div className="text-right text-2xl sm:text-3xl mr-0 px-0">
            {board.score}
          </div>
        </div>
      </div>
      <BoardView board={board} setBoard={setBoard} />
      <Controls board={board} setBoard={setBoard} />
    </GameLayout>
  );
}

function BoardView({ board, setBoard }) {
  function handler(ev) {
    if (board.hasWon()) return;

    if (ev.keyCode >= 37 && ev.keyCode <= 40) {
      let dir = ev.keyCode - 37;
      let boardClone = Object.assign(
        Object.create(Object.getPrototypeOf(board)),
        board
      );
      let newBoard = boardClone.move(dir);
      setBoard(newBoard);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  });

  const cells = board.cells.map((row, rowIndex) => {
    return row.map((col, colIndex) => {
      return <Cell key={rowIndex * 4 + colIndex} />;
    });
  });
  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((tile, index) => <Tile tile={tile} key={index} />);

  if (board.won) {
    return (
      <div className="grid grid-cols-1 grid-rows-2 gap-[1.5vmin] h-[60vmin] w-[60vmin] relative rounded-lg">
        <img className="w-full" src={"/assets/game_2048/2048.gif"} alt="" />
      </div>
    );
  } else if (!board.hasLost())
    return (
      <div className="grid grid-cols-4 grid-rows-4 gap-[1.5vmin] h-[60vmin] w-[60vmin] relative">
        {cells}
        {tiles}
      </div>
    );
  else {
    return (
      <div className="grid grid-cols-1 grid-rows-2 gap-[1.5vmin] h-[60vmin] w-[60vmin] relative rounded-lg overflow-hidden bg-none">
        <img
          className="w-full"
          src={"/assets/game_2048/game-over.gif"}
          alt=""
        />
        <img
          className="w-full absolute bottom-0 cursor-pointer"
          onClick={() => setBoard(new Board())}
          src={"/assets/game_2048/try-again.gif"}
          alt=""
        />
      </div>
    );
  }
}

function Cell() {
  return (
    <div className="flex justify-center items-center scale-[.98] bg-red-300 rounded-lg"></div>
  );
}

function Tile({ tile }) {
  const classArray = ["tile"];
  classArray.push("tile" + tile.value);

  if (!tile.mergedInto) {
    classArray.push(`postition_${tile.row}_${tile.column}`);
  }

  if (tile.mergedInto) classArray.push("merged");

  if (tile.isNew()) classArray.push("new");

  if (tile.hasMoved()) {
    classArray.push(`row_from_${tile.fromRow()}_to_${tile.toRow()}`);
    classArray.push(`column_from_${tile.fromColumn()}_to_${tile.toColumn()}`);
    classArray.push("isMoving");
  }

  const classList = classArray.join(" ");

  return (
    <div
      style={{
        height: `14vmin`,
        width: `14vmin`,
        position: "absolute",
        top: `calc(${tile.row}*15.4vmin)`,
        left: `calc(${tile.column}*15.4vmin)`,
      }}
      className={
        classList +
        " flex justify-center items-center rounded-lg overflow-hidden outline-none"
      }
    ></div>
  );
}

function Controls({ board, setBoard }) {
  function handler(dir, board, setBoard) {
    if (board.hasWon()) return;
    let boardClone = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    let newBoard = boardClone.move(dir);
    setBoard(newBoard);
  }

  return (
    <div className="hidden max-lg:flex flex-col w-full mt-5 justify-center items-center">
      <span className="text-xl mb-2">Controls</span>
      <button onClick={() => handler(1, board, setBoard)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
      <div className="flex gap-6">
        <button onClick={() => handler(4, board, setBoard)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <button onClick={() => handler(2, board, setBoard)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <button onClick={() => handler(3, board, setBoard)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
}
