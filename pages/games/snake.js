import React, { useState, useEffect } from "react";
import Snake from "@/helpers/snake";
import Link from "next/link";

const SnakeGame = () => {
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

  /**
   * Generate a new random food position.
   */
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

  /**
   * Restart the game.
   */
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

        // Move the snake and check if food was eaten
        if (snakeCopy.move()) {
          const newFood = generateFood();
          setFood(newFood); // Generate new food
          snakeCopy.food = newFood;
          snakeCopy.grow();
          setScore(score + 1);
        }

        // Check for self-collision
        if (snakeCopy.hasCollided()) {
          setGameOver(true);
          setGameRunning(false);
        }

        setSnake(snakeCopy);
      }, speed);

      return () => clearInterval(interval);
    }
  }, [gameRunning, snake, food, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, gameRunning]);

  // Determine the message to display based on the game state
  let instructionMessage = "";
  if (gameOver) {
    instructionMessage = "Press Space to Restart";
  } else if (!gameRunning) {
    instructionMessage = "Press Space to Continue";
  }

  function setGameSpeed(ev) {
    const value = ev.target.value;
    setSpeed(100 - value);
  }

  return (
    <div className="min-h-screen bg-neutral-300 flex flex-col justify-center items-center">
      {/* Score display */}
      <Link href={"/"}>Home</Link>
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

      {/* Game area */}
      <div
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
          <div className="absolute text-red-300 text-4xl font-bold">
            Game Over!
          </div>
        )}

        {/* Instruction Message */}
        {instructionMessage && (
          <div className="absolute text-gray-200 text-2xl font-bold bottom-4">
            {instructionMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
