import React, { useState, useEffect } from "react";
import Snake from "@/helpers/snake";

const SnakeGame = () => {
  const gridSize = 1.5;
  const boundarySize = 70;
  const gridCells = boundarySize / gridSize;
  const initialSnakePosition = [
    [11, 10],
    [10, 10],
    [9, 10],
    [8, 10],
  ];

  const [snake, setSnake] = useState(new Snake(initialSnakePosition));
  const [food, setFood] = useState(generateRandomFood());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);

  function generateRandomFood() {
    const x = Math.floor(Math.random() * gridCells);
    const y = Math.floor(Math.random() * gridCells);
    return [x, y];
  }

  const checkFoodCollision = () => {
    const head = snake.body[0];
    return head[0] === food[0] && head[1] === food[1];
  };

  const checkBoundaryCollision = () => {
    const head = snake.body[0];
    return (
      head[0] < 0 || head[1] < 0 || head[0] >= gridCells || head[1] >= gridCells
    );
  };

  const checkSelfCollision = () => {
    const head = snake.body[0];
    for (let i = 1; i < snake.body.length; i++) {
      if (head[0] === snake.body[i][0] && head[1] === snake.body[i][1]) {
        return true;
      }
    }
    return false;
  };

  const restartGame = () => {
    setSnake(new Snake(initialSnakePosition));
    setFood(generateRandomFood());
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
  };

  useEffect(() => {
    if (gameRunning && !gameOver) {
      const interval = setInterval(() => {
        const newSnake = new Snake([...snake.body]);
        newSnake.direction = snake.direction;
        newSnake.move();

        setSnake(newSnake); // Update the snake's position
      }, 40); // Higher interval for snake movement

      return () => clearInterval(interval);
    }
  }, [gameRunning, snake, gameOver]);

  useEffect(() => {
    if (gameRunning && !gameOver) {
      const collisionInterval = setInterval(() => {
        if (checkFoodCollision()) {
          const newSnake = new Snake([...snake.body]);
          
          newSnake.direction = snake.direction;
          console.log(
            "Snake direction: " + snake.direction,
            newSnake.direction
          );
          newSnake.grow();
          setFood(generateRandomFood());
          setScore(score + 1);
          setSnake(newSnake);
        }

        if (checkBoundaryCollision() || checkSelfCollision()) {
          setGameOver(true);
          setGameRunning(false);
        }
      }, 10); // Lower interval for collision detection

      return () => clearInterval(collisionInterval);
    }
  }, [gameRunning, snake, food, score, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          snake.setDirection("UP");
          break;
        case "ArrowDown":
          snake.setDirection("DOWN");
          break;
        case "ArrowLeft":
          snake.setDirection("LEFT");
          break;
        case "ArrowRight":
          snake.setDirection("RIGHT");
          break;
        case " ":
          if (gameOver) {
            restartGame();
          } else {
            setGameRunning(!gameRunning);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameRunning, gameOver, snake]);

  return (
    <div className="min-h-screen bg-neutral-300 flex flex-col justify-center items-center">
      <div className="absolute top-4 right-4 text-xl font-bold text-gray-700">
        Score: {score}
      </div>

      <div
        className="relative flex justify-center items-center border-4 border-black bg-gray-200"
        style={{
          width: `${boundarySize}vmin`,
          height: `${boundarySize}vmin`,
        }}
      >
        {snake.body.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500 rounded-md"
            style={{
              width: `${gridSize}vmin`,
              height: `${gridSize}vmin`,
              top: `${segment[1] * gridSize}vmin`,
              left: `${segment[0] * gridSize}vmin`,
            }}
          />
        ))}

        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            width: `${gridSize}vmin`,
            height: `${gridSize}vmin`,
            top: `${food[1] * gridSize}vmin`,
            left: `${food[0] * gridSize}vmin`,
          }}
        ></div>

        {gameOver && (
          <div className="absolute text-red-600 text-4xl font-bold">
            Game Over!
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
