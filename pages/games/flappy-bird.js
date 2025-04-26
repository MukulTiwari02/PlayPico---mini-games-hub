import GameLayout from "@/components/GameLayout";
import { useEffect, useState } from "react";

export default function FlappyBird() {
  const [WALL_HEIGHT, setWallHeight] = useState(600);
  const [WALL_WIDTH, setWallWidth] = useState(450);
  const [BIRD_HEIGHT, setBirdHeight] = useState(50);
  const [BIRD_WIDTH, setBirdWidth] = useState(60);
  const [PIPE_HEIGHT, setPipeHeight] = useState(600);
  const [PIPE_WIDTH, setPipeWidth] = useState(100);
  const [PIPE_GAP, setPipeGap] = useState(WALL_HEIGHT / 4);
  const [BASE_HEIGHT, setBaseHeight] = useState(WALL_HEIGHT / 4);
  const [BIRD_LEFT_DISTANCE, setBirdLeftDistance] = useState(WALL_WIDTH / 12);
  const GRAVITY = 1;
  const [velocity, setVelocity] = useState(6);
  const velocity_multiplier = 1.02;
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

  useEffect(() => {
    // Only runs on the client
    const handleResize = () => {
      const windowInnerWidth = window.innerWidth;
      const windowInnerHeight = window.innerHeight;
      if (windowInnerWidth < 700) {
        setWallWidth(windowInnerWidth * 0.75);
        setWallHeight(windowInnerHeight * 0.7);
        setBirdHeight(40);
        setBirdWidth(50);
        setPipeHeight(windowInnerHeight * 0.7);
        setPipeWidth(100);
        setPipeGap((windowInnerHeight * 0.7) / 5 + 10);
        setBaseHeight((windowInnerHeight * 0.7) / 4);
        setBirdLeftDistance((windowInnerWidth * 0.75) / 12);
        setVelocity(5.5);
      }
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize)

  }, []);

  const GOD_MODE_ENABLED = process.env.GOD_MODE_ENABLED || false;

  useEffect(() => {
    let birdInterval;
    if (startGame && !gameOver && birdPos < WALL_HEIGHT - BIRD_HEIGHT) {
      birdInterval = setInterval(() => {
        {
          setBaseTranslate((baseTranslate) => {
            if (baseTranslate >= WALL_WIDTH) return 0;
            else
              return (
                baseTranslate + velocity * Math.pow(velocity_multiplier, score)
              );
          });

          setBirdDownVelocity((currentVelocity) => currentVelocity + GRAVITY);
          if (!GOD_MODE_ENABLED)
            setBirdPos((birdPos) => setBirdPos(birdPos + birdDownVelocity));
          else setBirdPos(WALL_HEIGHT / 2);

          if (birdDownVelocity == 0) setBirdImageIndex(1);
          else if (birdDownVelocity < 0) setBirdImageIndex(2);
          else setBirdImageIndex(0);

          if (
            BIRD_LEFT_DISTANCE + BIRD_WIDTH > pipeLeft + PIPE_WIDTH &&
            !scoreSet &&
            !gameOver
          ) {
            setScore((score) => score + 1);
            setScoreSet(true);
            const scoreAudio = new Audio("/assets/flappy-bird/audio/point.wav");
            scoreAudio.play();
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
          setPipeLeft((pipeLeft) =>
            setPipeLeft(
              pipeLeft - velocity * Math.pow(velocity_multiplier, score)
            )
          );
        }
      }, 16.667);
    }
    if (birdPos >= WALL_HEIGHT - BIRD_HEIGHT)
      if (!GOD_MODE_ENABLED) {
        setGameOver(true);
      }
    return () => clearInterval(birdInterval);
  });

  useEffect(() => {
    let scoreInterval;
    if (startGame && !gameOver && birdPos < WALL_HEIGHT - BIRD_HEIGHT) {
      scoreInterval = setInterval(() => {
        {
          // check collision
          const birdRadius = Math.max(BIRD_WIDTH, BIRD_HEIGHT) / 2;
          const birdCenterX = BIRD_LEFT_DISTANCE + BIRD_WIDTH / 2;
          const birdCenterY = birdPos + BIRD_HEIGHT / 2;

          // Top Pipe Collision
          const closestXTop = Math.max(
            pipeLeft,
            Math.min(birdCenterX, pipeLeft + PIPE_WIDTH)
          );
          const closestYTop = Math.max(
            pipeTop,
            Math.min(birdCenterY, pipeTop + PIPE_HEIGHT)
          );

          const distanceTop = Math.sqrt(
            Math.pow(birdCenterX - closestXTop, 2) +
              Math.pow(birdCenterY - closestYTop, 2)
          );

          const topPipeCollision = distanceTop < birdRadius;

          // Bottom Pipe Collision
          const closestXBottom = Math.max(
            pipeLeft,
            Math.min(birdCenterX, pipeLeft + PIPE_WIDTH)
          );
          const closestYBottom = Math.max(
            pipeTop + PIPE_HEIGHT + PIPE_GAP,
            Math.min(
              birdCenterY,
              pipeTop + PIPE_HEIGHT + PIPE_GAP + PIPE_HEIGHT
            )
          );

          const distanceBottom = Math.sqrt(
            Math.pow(birdCenterX - closestXBottom, 2) +
              Math.pow(birdCenterY - closestYBottom, 2)
          );

          const bottomPipeCollision = distanceBottom < birdRadius;

          // Final Collision Check
          const collision = topPipeCollision || bottomPipeCollision;

          if (collision) {
            if (!GOD_MODE_ENABLED) {
              setGameOver(true);
            }
          }
        }
        return () => clearInterval(scoreInterval);
      }, 5);
    }
    return () => clearInterval(scoreInterval);
  }, [birdPos, pipeLeft, pipeTop]);

  function handler(e) {
    if (!startGame) {
      // Start the game
      setBirdPos(0);
      setBirdDownVelocity(0);
      setScore(0);
      setScoreSet(false);
      setPipeLeft(WALL_WIDTH);
      setPipeTop(-WALL_HEIGHT / 2);
      setStartGame(true);
      setGameOver(false);
    } else if (gameOver) {
      // Reset the game
      setGameOver(false);
      setScore(0);
      setScoreSet(false);
      setStartGame(false);
    } else {
      // Jump logic
      if (birdPos - BIRD_HEIGHT <= 0) {
        setBirdPos(0); // Prevent bird from flying above the screen
      } else {
        setBirdDownVelocity(-8); // Apply upward velocity
      }
    }
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if ([" ", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        handler(); // Trigger jump logic
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [startGame, gameOver, birdPos]);

  return (
    <GameLayout>
      <div className="">
        <div
          onClick={handler}
          className="border-2 select-none border-black border-b-0 relative flex justify-center items-center overflow-hidden"
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
                className="aspect-auto scale-105 h-full w-full"
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
                  src={
                    "/assets/flappy-bird/images/pipe-" +
                    (parseInt(score / 5) % 2 !== 0 ? "red.png" : "green.png")
                  }
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
                  src={
                    "/assets/flappy-bird/images/pipe-" +
                    (parseInt(score / 5) % 2 !== 0 ? "red.png" : "green.png")
                  }
                  alt=""
                />
              </div>
            </>
          )}
        </div>
        <div
          className="z-5 select-none flex overflow-hidden border-2 border-black border-t-0"
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
    </GameLayout>
  );
}
