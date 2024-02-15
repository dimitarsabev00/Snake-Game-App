import "./PlayArea.scss";
import AppleLogo from "../../assets/applePixels.png";
import useInterval from "../../useInterval";
import { useEffect, useRef, useState } from "react";
import ScoreBox from "../ScoreBox/ScoreBox";

const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [
  [4, 10],
  [4, 10],
];
const initialApple = [14, 10];
const scale = 50;
const timeDelay = 100;

const PlayArea = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // All sound for the game
  const [music] = useState(new Audio("../src/assets/sounds/music.mp3"));
  const [move] = useState(new Audio("../src/assets/sounds/move.mp3"));
  const [foodSound] = useState(new Audio("../src/assets/sounds/food.mp3"));
  const [gameOverSound] = useState(
    new Audio("../src/assets/sounds/gameover.mp3")
  );

  useInterval(() => runGame(), delay);
  useEffect(() => {
    let fruit = document.getElementById("fruit") as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#a3d001";
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(fruit, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, gameOver]);

  function handleSetScore() {
    if (score > Number(localStorage.getItem("highScore"))) {
      localStorage.setItem("highScore", JSON.stringify(score));
    }
  }

  function play() {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setGameOver(false);
    music.volume = 0.1;
    music.play();
  }

  function checkCollision(head: number[]) {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }
    return false;
  }

  function appleAte(newSnake: number[][]) {
    let coord = apple.map(() => Math.floor((Math.random() * canvasX) / scale));
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = coord;
      setScore(score + 1);
      foodSound.volume = 0.3;

      foodSound.play();
      setApple(newApple);

      return true;
    }
    return false;
  }

  function runGame() {
    const newSnake = [...snake];
    const newSnakeHead = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    newSnake.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      setDelay(null);

      gameOverSound.volume = 0.3;
      gameOverSound.play();
      music.pause();

      setGameOver(true);
      handleSetScore();
    }
    if (!appleAte(newSnake)) {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowLeft":
        move.volume = 0.3;
        move.play();

        setDirection([-1, 0]);
        break;
      case "ArrowUp":
        move.volume = 0.3;
        move.play();

        setDirection([0, -1]);
        break;
      case "ArrowRight":
        move.volume = 0.3;
        move.play();

        setDirection([1, 0]);
        break;
      case "ArrowDown":
        move.volume = 0.3;
        move.play();

        setDirection([0, 1]);
        break;
    }
  }
  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img id="fruit" src={AppleLogo} alt="fruit" width="30" />
      <canvas
        className="playArea"
        ref={canvasRef}
        width={`${canvasX}px`}
        height={`${canvasY}px`}
      />
      {gameOver && <div className="gameOver">Game Over</div>}
      <button onClick={play} className="playButton">
        Play
      </button>
      <ScoreBox score={score} />
    </div>
  );
};

export default PlayArea;
