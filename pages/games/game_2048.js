import { useEffect, useState } from "react";
import Link from "next/link";

export default function GamePage_2048() {
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
  }

  // Swipe up
  function swipeUp() {
    console.log('swiping up')
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
    <div className="h-[100vh] w-[100vw] bg-neutral-300 flex flex-col gap-0 justify-center items-center">
      <Link href={"/"}>Home</Link>
      <div className="grid-holder md:h-[30vw] md:w-[30vw] h-[90vw] w-[90vw] border-4 rounded-md bg-purple-900 border-purple-900 grid grid-rows-4 grid-cols-4 gap-1.5 p-1">
        {grid.map((row) => {
          return row.map((box) => {
            return (
              <div className="bg-red-300 flex justify-center items-center font-bold text-3xl md:text-6xl rounded-md">
                {box === 0 ? (
                  <div className="h-full w-full bg-gray-300"></div>
                ) : (
                  <div className={`border-4 border-purple-900 h-full w-full flex items-center transition-all justify-center`}>
                    <img className="h-full w-full" src={`/assets/game_2048/${box}.gif`} alt="" />
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
