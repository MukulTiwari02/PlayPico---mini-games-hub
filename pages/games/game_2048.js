import { Board } from "@/helpers/2048";
import { useEffect, useState } from "react";
import "@/styles/game_2048/main.scss";
import "@/styles/game_2048/styles.scss";
import Link from "next/link";

export default function GamePage_2048Animated() {
  const [board, setBoard] = useState(new Board());

  function setNewGame() {
    setBoard(new Board());
  }

  return (
    <div className="select-none h-[100vh] w-[100vw] bg-neutral-300 flex flex-col gap-0 justify-center items-center">
        <Link className="mb-10" href={'/'}>Home</Link>
      <div className="flex justify-between w-[60vmin] mb-3">
        <button
          className="resetButton bg-purple-700 text-neutral-300"
          onClick={setNewGame}
        >
          New Game
        </button>
        <div className="">
          <span className="text-2xl">Score</span>
          <div className="text-right text-3xl mr-0 px-0">{board.score}</div>
        </div>
      </div>
      <BoardView board={board} setBoard={setBoard} />
    </div>
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
        <img
          className="w-full"
          src={"/assets/game_2048/2048.gif"}
          alt=""
        />
      </div>
    );
  }

  else if (!board.hasLost())
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
    <div className="flex justify-center items-center bg-red-300 rounded-lg"></div>
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
