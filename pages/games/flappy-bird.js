import { useEffect, useState } from "react";

export default function FlappyBird() {
  const WALL_HEIGHT = 600;
  const WALL_WIDTH = 450;
  const BIRD_HEIGHT = 50;
  const BIRD_WIDTH = 60;
  const BASE_HEIGHT = WALL_HEIGHT / 4;
  const BIRD_LEFT_DISTANCE = WALL_WIDTH / 12;
  const GRAVITY = 1;
  const PIPE_HEIGHT = 600;
  const PIPE_GAP = WALL_HEIGHT / 4;
  const PIPE_WIDTH = 100;
  const velocity = 6;
  const [birdPos, setBirdPos] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const [pipeTop, setPipeTop] = useState(-WALL_HEIGHT / 2);
  const [pipeLeft, setPipeLeft] = useState(WALL_WIDTH);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreSet, setScoreSet] = useState(false);
  const [baseTranslate, setBaseTranslate] = useState(0);
  const [birdDownVelocity, setBirdDownVelocity] = useState(0);
  const [birdImageIndex, setBirdImageIndex] = useState(0);
  const birdImages = ["upflap", "midflap", "downflap"];
  const GOD_MODE_ENABLED = process.env.GOD_MODE_ENABLED;
  
  useEffect(() => {
    let birdInterval;
    if (startGame && !gameOver && (birdPos < WALL_HEIGHT - BIRD_HEIGHT)) {
      birdInterval = setInterval(() => {
        {
          setBaseTranslate((baseTranslate) => {
            if (baseTranslate >= WALL_WIDTH) return 0;
            else return baseTranslate + velocity;
          });

          setBirdDownVelocity((currentVelocity) => currentVelocity + GRAVITY);
          if(!GOD_MODE_ENABLED) setBirdPos((birdPos) => setBirdPos(birdPos + birdDownVelocity));
          else setBirdPos(WALL_HEIGHT/2);

          if (birdDownVelocity == 0) setBirdImageIndex(1);
          else if (birdDownVelocity < 0) setBirdImageIndex(2);
          else setBirdImageIndex(0);

          if (
            BIRD_LEFT_DISTANCE + BIRD_WIDTH > pipeLeft + PIPE_WIDTH &&
            !scoreSet
          ) {
            setScore((score) => score + 1);
            setScoreSet(true);
          }
          if (pipeLeft < -PIPE_WIDTH) {
            setPipeTop(
              -Math.floor(
                Math.random() * (400 - WALL_HEIGHT / 4.5 + 100 + 1) +
                  WALL_HEIGHT / 4.5 +
                  100
              )
            );
            setPipeLeft(WALL_WIDTH);
            setScoreSet(false);
          }
          setPipeLeft((pipeLeft) => setPipeLeft(pipeLeft - velocity));
        }
      }, 16.667);
    }
    if (birdPos >= WALL_HEIGHT - BIRD_HEIGHT) if(!GOD_MODE_ENABLED) setGameOver(true);
    return () => clearInterval(birdInterval);
  });

  useEffect(() => {
    let scoreInterval;
    if (startGame && !gameOver && (birdPos < WALL_HEIGHT - BIRD_HEIGHT)) {
      scoreInterval = setInterval(() => {
        {
          // check collision
          const topPipeCollision =
            (birdPos + BIRD_HEIGHT <= pipeTop + PIPE_HEIGHT &&
              BIRD_LEFT_DISTANCE + BIRD_WIDTH + 10 >= pipeLeft) ||
            (birdPos <= pipeTop + PIPE_HEIGHT &&
              BIRD_LEFT_DISTANCE + BIRD_WIDTH >= pipeLeft &&
              BIRD_LEFT_DISTANCE + BIRD_WIDTH <= pipeLeft + PIPE_WIDTH);

          const bottomPipeCollision =
            (birdPos >= pipeTop + PIPE_HEIGHT + PIPE_GAP &&
              BIRD_LEFT_DISTANCE + BIRD_WIDTH >= pipeLeft) ||
            (birdPos + BIRD_HEIGHT + 10 >= pipeTop + PIPE_HEIGHT + PIPE_GAP &&
              BIRD_LEFT_DISTANCE + BIRD_WIDTH >= pipeLeft &&
              BIRD_LEFT_DISTANCE + BIRD_WIDTH <= pipeLeft + PIPE_WIDTH);
          if (topPipeCollision || bottomPipeCollision) {
            if(!GOD_MODE_ENABLED)setGameOver(true);
          }
        }
        return () => clearInterval(scoreInterval);
      }, 16.667);
    }
    return () => clearInterval(scoreInterval);
  }, [birdPos, pipeLeft, pipeTop]);

  useEffect(() => {
    // Function to handle the keypress
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        console.log("Spacebar pressed!");
        if (!startGame) {
          setBirdPos(0);
          setBirdDownVelocity(0);
          setScore(0);
          setScoreSet(false);
          setPipeLeft(WALL_WIDTH);
          setPipeTop(-WALL_HEIGHT / 2);
          setStartGame(true);
        }
    
        if (gameOver) {
          setGameOver(false);
          setScore(0);
          setScoreSet(false);
          setStartGame(false);
        }
    
        if (birdPos - BIRD_HEIGHT <= 0) setBirdPos(0);
        else {
          setBirdDownVelocity(-8);
        }
      }
    };

    // Add the event listener
    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function handler(e) {
    
    if (!startGame) {
      setBirdPos(0);
      setBirdDownVelocity(0);
      setScore(0);
      setScoreSet(false);
      setPipeLeft(WALL_WIDTH);
      setPipeTop(-WALL_HEIGHT / 2);
      setStartGame(true);
    }

    if (gameOver) {
      setGameOver(false);
      setScore(0);
      setScoreSet(false);
      setStartGame(false);
    }

    if (birdPos - BIRD_HEIGHT <= 0) setBirdPos(0);
    else {
      setBirdDownVelocity(-8);
    }
  }

  console.log("Game Over :", gameOver, "Game start :", startGame)

  return (
    <div
      className="h-[100vh] w-[100vw] bg-neutral-300 flex flex-col gap-0 justify-center items-center"
      onClick={handler}
      onKeyDownCapture={handler}
    >
      <div
        className="border-2 border-black border-b-0 relative flex justify-center items-center overflow-hidden"
        style={{ height: `${WALL_HEIGHT}px`, width: `${WALL_WIDTH}px` }}
      >
        <img
          className="h-full w-full"
          src={
            "/assets/flappy-bird/images/" +
            (parseInt(score / 10) % 2 !== 0
              ? "background-night.png"
              : "background-day.png")
          }
          alt=""
        />
        {startGame && (
          <div
            className="absolute"
            style={{
              height: `${BIRD_HEIGHT}px`,
              width: `${BIRD_WIDTH}px`,
              top: `${birdPos}px`,
              left: `${BIRD_LEFT_DISTANCE}px`,
            }}
          >
            <img
              className="h-full w-full"
              src={`/assets/flappy-bird/images/redbird-${birdImages[birdImageIndex]}.png`}
              alt=""
            />
          </div>
        )}
        <div className="score absolute top-0 left-0 m-2 z-50 font-bold select-none ">
          Score : {score}
        </div>
        {!startGame && (
          <div
            className="absolute z-10"
            style={{
              height: `${WALL_HEIGHT / 2}px`,
              width: `${WALL_WIDTH / 2}px`,
            }}
          >
            <img
              className="h-full w-full"
              src="/assets/flappy-bird/images/message.png"
              alt=""
            />
          </div>
        )}
        {gameOver && startGame && (
          <div
            className="absolute z-10"
            style={{
              height: `${WALL_HEIGHT / 10}px`,
              width: `${WALL_WIDTH / 2}px`,
            }}
          >
            <img
              className="h-full w-full"
              src={"/assets/flappy-bird/images/gameover.png"}
              alt=""
            />
          </div>
        )}
        {startGame && (
          <>
            <div
              className="z-5 absolute"
              style={{
                height: `${PIPE_HEIGHT}px`,
                width: `${PIPE_WIDTH}px`,
                top: `${pipeTop}px`,
                left: `${pipeLeft}px`,
                rotate: `180deg`,
              }}
            >
              <img
                className="h-full w-full"
                src={"/assets/flappy-bird/images/pipe-" +(parseInt(score / 5) % 2 !== 0 ? "red.png" :  "green.png")}
                alt=""
              />
            </div>
            <div
              className="z-5 absolute"
              style={{
                height: `${PIPE_HEIGHT}px`,
                width: `${PIPE_WIDTH}px`,
                top: `${pipeTop + PIPE_HEIGHT + PIPE_GAP}px`,
                left: `${pipeLeft}px`,
              }}
            >
              <img
                className="h-full w-full"
                src={"/assets/flappy-bird/images/pipe-" +(parseInt(score / 5) % 2 !== 0 ? "red.png" :  "green.png")}
                alt=""
              />
            </div>
          </>
        )}
      </div>
      <div
        className="z-5 flex overflow-hidden border-2 border-black border-t-0"
        style={{ width: `${WALL_WIDTH}px` }}
      >
        <div
          className="shrink-0"
          style={{
            height: `${BASE_HEIGHT}px`,
            width: `${WALL_WIDTH}px`,
            translate: `${-baseTranslate}px`,
          }}
        >
          <img
            className="h-full w-full"
            src="/assets/flappy-bird/images/base.png"
            alt=""
          />
        </div>
        <div
          className="shrink-0"
          style={{
            height: `${BASE_HEIGHT}px`,
            width: `${WALL_WIDTH}px`,
            translate: `${-baseTranslate}px`,
          }}
        >
          <img
            className="h-full w-full"
            src="/assets/flappy-bird/images/base.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
