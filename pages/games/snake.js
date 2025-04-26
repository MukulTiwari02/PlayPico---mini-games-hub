import React, { useState, useEffect } from "react";
import Snake from "@/helpers/snake";
import GameLayout from "@/components/GameLayout";

const SnakeGame = () => {
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Set initial width
    handleResize();
  }, []);

  const gridSize = 30;
  const initialSnakePosition = [
    [5, 5],
    [4, 5],
    [3, 5],
  ];
  const initialFoodPosition = [10, 10];

  const [snake, setSnake] = useState(
    new Snake(initialSnakePosition, initialFoodPosition, gridSize - 10)
  );
  const [food, setFood] = useState(initialFoodPosition);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [speed, setSpeed] = useState(50);

  const isSnakeDirectionEmpty = !snake.direction || snake.direction === "";

  const generateFood = () => {
    let newFood;
    do {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      newFood = [x, y];
    } while (
      snake.body.some(
        (segment) => segment[0] === newFood[0] && segment[1] === newFood[1]
      )
    );
    return newFood;
  };

  const restartGame = () => {
    setSnake(new Snake(initialSnakePosition, initialFoodPosition, gridSize));
    setFood(initialFoodPosition);
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
  };

  useEffect(() => {
    if (gameRunning && !gameOver) {
      const interval = setInterval(() => {
        const snakeCopy = new Snake([...snake.body], food, gridSize);
        snakeCopy.setDirection(snake.direction);

        if (snakeCopy.move()) {
          const newFood = generateFood();
          setFood(newFood);
          snakeCopy.food = newFood;
          snakeCopy.grow();
          setScore(score + 1);
        }

        if (snakeCopy.hasCollided()) {
          setGameOver(true);
          setGameRunning(false);
        }

        setSnake(snakeCopy);
      }, speed);

      return () => clearInterval(interval);
    }
  }, [gameRunning, snake, food, gameOver]);

  const handleKeyDown = (e) => {
    e.preventDefault();
    switch (e.key) {
      case "ArrowUp":
        setSnake((prevSnake) => {
          prevSnake.setDirection("UP");
          return prevSnake;
        });
        break;
      case "ArrowDown":
        setSnake((prevSnake) => {
          prevSnake.setDirection("DOWN");
          return prevSnake;
        });
        break;
      case "ArrowLeft":
        setSnake((prevSnake) => {
          prevSnake.setDirection("LEFT");
          return prevSnake;
        });
        break;
      case "ArrowRight":
        setSnake((prevSnake) => {
          prevSnake.setDirection("RIGHT");
          return prevSnake;
        });
        break;
      case " ":
        if (gameOver) {
          restartGame();
        } else {
          setGameRunning(!gameRunning);
          if (!snake.direction) {
            setSnake((currSnake) => {
              currSnake.setDirection("RIGHT");
              return currSnake;
            });
          }
        }
        break;
      default:
        break;
    }
  };

  const handleTap = (e, key) => {
    if (windowWidth >= 1024) return;
    e.key = key;
    handleKeyDown(e);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, gameRunning]);

  let instructionMessage = "";
  if (gameOver) {
    instructionMessage =
      windowWidth < 1024 ? "Tap to Restart" : "Press Space to Restart";
  } else if (!gameRunning) {
    instructionMessage =
      windowWidth < 1024 ? "Tap to Continue" : "Press Space to Continue";
  }

  function setGameSpeed(ev) {
    const value = ev.target.value;
    setSpeed(100 - value);
  }

  return (
    <GameLayout>
      <div className="mb-2 text-xl font-bold text-gray-700">Score: {score}</div>
      <div className="flex mb-2 items-center justify-center gap-1">
        <label htmlFor="speed">Set Speed : </label>
        <input
          onChange={setGameSpeed}
          value={100 - speed}
          className="mb-0"
          type="range"
          name="speed"
          id=""
        />
      </div>

      <div
        onClick={(e) => handleTap(e, " ")}
        className="relative flex overflow-hidden justify-center items-center border-4 border-black bg-violet-800"
        style={{
          width: `${gridSize * 2}vmin`,
          height: `${gridSize * 2}vmin`,
        }}
      >
        {snake.body.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500 rounded-md"
            style={{
              width: `2vmin`,
              height: `2vmin`,
              top: `${segment[1] * 2}vmin`,
              left: `${segment[0] * 2}vmin`,
            }}
          />
        ))}

        <div
          className="absolute bg-red-900 rounded-full"
          style={{
            width: `2vmin`,
            height: `2vmin`,
            top: `${food[1] * 2}vmin`,
            left: `${food[0] * 2}vmin`,
          }}
        ></div>

        {gameOver && (
          <div className="absolute text-red-500 text-4xl font-bold">
            Game Over!
          </div>
        )}
        {instructionMessage && (
          <div className="absolute text-gray-200 text-sm sm:text-2xl font-bold bottom-4">
            {instructionMessage}
          </div>
        )}
      </div>
      <Controls handleTap={handleTap}/>
    </GameLayout>
  );
};

function Controls({ handleTap }) {
  function handler(e,key) {
    handleTap(e, key);
  }

  return (
    <div className="hidden max-lg:flex flex-col w-full mt-5 justify-center items-center">
      <span className="text-xl mb-2">Controls</span>
      <button onClick={(e) => handler(e, "ArrowUp")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-9"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
      <div className="flex gap-10">
        <button onClick={(e) => handler(e, "ArrowLeft")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <button onClick={(e) => handler(e, "ArrowRight")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <button onClick={(e) => handler(e, "ArrowDown")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-9"
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

export default SnakeGame;
