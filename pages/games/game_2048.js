import { useEffect, useState } from "react";
import Link from "next/link";
import Swipe from 'react-easy-swipe2'

export default function GamePage_2048() {
  const GRID_SIZE = 4;
  const GRID_GAP = 1;

  const [grid, setGrid] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [gridSet, setGridSet] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, false);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [grid]);

  useEffect(() => {
    initializeGame();
  }, []);

  function initializeGame() {
    let newGrid = JSON.parse(JSON.stringify(grid));
    addNumber(newGrid);
    addNumber(newGrid);
    setGrid(newGrid);
    setGridSet(true);
  }

  // Add a number
  function addNumber(newGrid) {
    let gridFull = false;
    let addedNumber = false;
    let attempts = 0;
    while (!addedNumber) {
      if (gridFull) return;

      const number1 = Math.random() >= 0.9 ? 4 : 2;
      const random_x = Math.floor(Math.random() * 4);
      const random_y = Math.floor(Math.random() * 4);
      attempts++;
      if (newGrid[random_y][random_x] === 0) {
        newGrid[random_y][random_x] = number1;
        addedNumber = true;
      }
      if (attempts > 50) gridFull = true;
    }
  }

  // Swipe left
  function swipeLeft() {
    let newGrid = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < 4; i++) {
      let b = newGrid[i];
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast++;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            b[fast] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }
    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
      addNumber(newGrid);
    }
    setGrid(newGrid);
    return true;
  }

  // Swipe right
  function swipeRight() {
    let newGrid = JSON.parse(JSON.stringify(grid));
    for (let i = 3; i >= 0; i--) {
      let b = newGrid[i];
      let slow = b.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast--;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            b[fast] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      addNumber(newGrid);
    }
    setGrid(newGrid);
    return true;
  }

  // Swipe up
  function swipeUp() {
    let newGrid = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < 4; i++) {
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (newGrid[slow][i] === 0 && newGrid[fast][i] === 0) {
          fast++;
        } else if (newGrid[slow][i] === 0 && newGrid[fast][i] !== 0) {
          newGrid[slow][i] = newGrid[fast][i];
          newGrid[fast][i] = 0;
          fast++;
        } else if (newGrid[slow][i] !== 0 && newGrid[fast][i] === 0) {
          fast++;
        } else if (newGrid[slow][i] !== 0 && newGrid[fast][i] !== 0) {
          if (newGrid[slow][i] === newGrid[fast][i]) {
            newGrid[slow][i] = newGrid[slow][i] + newGrid[fast][i];
            newGrid[fast][i] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }
    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
      addNumber(newGrid);
    }
    setGrid(newGrid);
    return true;
  }

  // Swipe right
  function swipeDown() {
    let newArray = JSON.parse(JSON.stringify(grid));
    for (let i = 3; i >= 0; i--) {
      let slow = newArray.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (newArray[slow][i] === 0 && newArray[fast][i] === 0) {
          fast--;
        } else if (newArray[slow][i] === 0 && newArray[fast][i] !== 0) {
          newArray[slow][i] = newArray[fast][i];
          newArray[fast][i] = 0;
          fast--;
        } else if (newArray[slow][i] !== 0 && newArray[fast][i] === 0) {
          fast--;
        } else if (newArray[slow][i] !== 0 && newArray[fast][i] !== 0) {
          if (newArray[slow][i] === newArray[fast][i]) {
            newArray[slow][i] = newArray[slow][i] + newArray[fast][i];
            newArray[fast][i] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }
    if (JSON.stringify(newArray) !== JSON.stringify(grid)) {
      addNumber(newArray);
    }
    setGrid(newArray);
    return true;
  }

  // Handle Key Press
  function handleKeyPress(e) {
    switch (e.key) {
      case "ArrowUp":
        swipeUp();
        break;
      case "ArrowDown":
        swipeDown();
        break;
      case "ArrowLeft":
        swipeLeft();
        break;
      case "ArrowRight":
        swipeRight();
        break;
      default:
        break;
    }
  }

  return (
    <Swipe allowMouseEvents={true} onSwipeUp={swipeUp} onSwipeLeft={swipeLeft} onSwipeRight={swipeRight} onSwipeDown={swipeDown}>
    <div className="select-none h-[100vh] w-[100vw] bg-neutral-300 flex flex-col gap-0 justify-center items-center">
      <Link href={"/"}>Home</Link>
      <div className="select-none p-[2vmin] border bg-purple-900">
        <div
          className={`select-none grid-holder grid grid-cols-4 grid-rows-4 relative gap-[2vmin] border-4 rounded-md bg-purple-900 border-purple-900`}
        >
          {grid.map((row, index_y) => {
            return row.map((box, index_x) => {
              return (
                <>
                  <Cell />
                  {box === 0 ? (
                    <></>
                  ) : (
                    <Tile
                      index_x={index_x}
                      index_y={index_y}
                      className={`border-4 border-purple-900 select-none `}
                      value={box}
                    />
                  )}
                </>
              );
            });
          })}
        </div>
      </div>
    </div></Swipe>
  );
}

const Cell = ({ className }) => {
  return (
    <div
      className={
        "bg-red-300 flex justify-center items-center font-bold text-3xl md:text-6xl select-none h-[20vmin] w-[20vmin] rounded-xl " +
        { className }
      }
    ></div>
  );
};

const Tile = ({ index_x, index_y, value, className, children }) => {
  return (
    <div
      className={"absolute overflow-hidden rounded-xl " + { className }}
      style={{
        height: "20vmin",
        width: "20vmin",
        top: `calc(${index_y}*22vmin)`,
        left: `calc(${index_x}*22vmin)`,
        transition: "left 100ms ease-in-out",
        transition: "top 100ms ease-in-out",
      }}
    >
      <img
        className="h-full w-full"
        src={`/assets/game_2048/${value}.gif`}
        alt=""
      />
    </div>
  );
};
