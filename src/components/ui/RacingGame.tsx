import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

interface Car {
  x: number;
  y: number;
  speed: number;
  color: string;
  id: number;
  isPlayer?: boolean;
}

const RacingGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const navigate = useNavigate();

  const carsRef = useRef<Car[]>([]);
  const playerRef = useRef<Car | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const laneWidth = 80;
  const roadWidth = 3 * laneWidth;

  // Initialize cars
  const initializeCars = () => {
    const aiCars: Car[] = [];
    for (let i = 0; i < 3; i++) {
      aiCars.push({
        x: 150 + i * laneWidth,
        y: -100 - i * 200,
        speed: 3,
        color: ["#ff4444", "#4444ff", "#44ff44"][i],
        id: i,
      });
    }
    carsRef.current = aiCars;

    // Player car
    playerRef.current = {
      x: 150 + laneWidth,
      y: 400,
      speed: 3,
      color: "#ffff44",
      id: 99,
      isPlayer: true,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initializeCars();

    const drawRoad = () => {
      ctx.fillStyle = "#333";
      ctx.fillRect(100, 0, roadWidth, canvas.height);

      ctx.strokeStyle = "#fff";
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      for (let i = 1; i < 3; i++) {
        const x = 100 + i * laneWidth;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawCar = (car: Car) => {
      ctx.fillStyle = car.color;
      ctx.fillRect(car.x, car.y, 40, 60);

      ctx.fillStyle = "#000";
      ctx.fillRect(car.x + 5, car.y - 5, 10, 8);
      ctx.fillRect(car.x + 25, car.y - 5, 10, 8);
      ctx.fillRect(car.x + 5, car.y + 57, 10, 8);
      ctx.fillRect(car.x + 25, car.y + 57, 10, 8);
    };

    const checkCollision = (car1: Car, car2: Car) => {
      return (
        car1.x < car2.x + 40 &&
        car1.x + 40 > car2.x &&
        car1.y < car2.y + 60 &&
        car1.y + 60 > car2.y
      );
    };

    const updateCars = () => {
      carsRef.current.forEach((car) => {
        car.y += car.speed;

        // random small boost
        if (Math.random() < 0.01) {
          car.speed += 0.2;
        }

        // reset when out of screen
        if (car.y > canvas.height) {
          car.y = -200;
          car.speed = 3 + Math.random(); // reset speed
        }

        // check collision with player
        if (playerRef.current && checkCollision(car, playerRef.current)) {
          setGameOver(true);
        }
      });
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoad();

      if (!gameOver) {
        updateCars();
        carsRef.current.forEach(drawCar);
        if (playerRef.current) drawCar(playerRef.current);

        // check win after 60s
        if (time >= 60) {
          setWin(true);
          setGameOver(true);
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameOver, roadWidth, time]);

  // Timer
  useEffect(() => {
    if (!gameOver) {
      timeRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
        setScore((prev) => prev + 1); // score = survive longer
      }, 1000);
    } else {
      if (timeRef.current) clearInterval(timeRef.current);
    }

    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, [gameOver]);

  // Controls (keyboard)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!playerRef.current) return;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        playerRef.current.x -= 20;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        playerRef.current.x += 20;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Controls (mouse move)
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !playerRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      playerRef.current.x = Math.min(
        Math.max(relativeX - 20, 100), // left bound
        100 + roadWidth - 40 // right bound
      );
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [roadWidth]);

  const resetGame = () => {
    setScore(0);
    setTime(0);
    setWin(false);
    setGameOver(false);
    initializeCars();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-black rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="border border-gray-600 rounded"
        />
      </div>

      <div className="flex space-x-4 text-white">
        <div className="bg-blue-600 px-4 py-2 rounded">Score: {score}</div>
        <div className="bg-green-600 px-4 py-2 rounded">
          Time: {formatTime(time)}
        </div>
      </div>

      {gameOver ? (
        <div className="text-center space-y-2">
          <div
            className={`text-2xl font-bold ${
              win ? "text-green-400" : "text-red-400"
            }`}
          >
            {win ? "You Win!" : "Game Over!"}
          </div>
          <div className="text-lg text-white">
            Final Score: {score} | Time: {formatTime(time)}
          </div>
          <div className="space-x-2">
            <Button onClick={resetGame} variant="outline">
              Play Again
            </Button>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      ) : (
        <div className="space-x-2">
          <Button onClick={() => navigate("/")} variant="outline">
            Go Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default RacingGame;
