import React, { useEffect, useRef, useState } from "react";
import { Container, Text, VStack, Box } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 50, y: 50, angle: 0, bullets: [] });
  const [enemies, setEnemies] = useState([{ x: 200, y: 200, angle: 0, bullets: [] }]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawTank = (x, y, angle, color) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillStyle = color;
      context.fillRect(-15, -10, 30, 20);
      context.restore();
    };

    const drawBullet = (x, y) => {
      context.fillStyle = "black";
      context.beginPath();
      context.arc(x, y, 2, 0, 2 * Math.PI);
      context.fill();
    };

    const updateGame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawTank(player.x, player.y, player.angle, "blue");
      player.bullets.forEach((bullet) => drawBullet(bullet.x, bullet.y));
      enemies.forEach((enemy) => {
        drawTank(enemy.x, enemy.y, enemy.angle, "red");
        enemy.bullets.forEach((bullet) => drawBullet(bullet.x, bullet.y));
      });
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") setPlayer((prev) => ({ ...prev, y: prev.y - 5 }));
      if (e.key === "ArrowDown") setPlayer((prev) => ({ ...prev, y: prev.y + 5 }));
      if (e.key === "ArrowLeft") setPlayer((prev) => ({ ...prev, angle: prev.angle - 0.1 }));
      if (e.key === "ArrowRight") setPlayer((prev) => ({ ...prev, angle: prev.angle + 0.1 }));
      if (e.key === " ") {
        setPlayer((prev) => ({
          ...prev,
          bullets: [
            ...prev.bullets,
            {
              x: prev.x + Math.cos(prev.angle) * 15,
              y: prev.y + Math.sin(prev.angle) * 15,
              angle: prev.angle,
            },
          ],
        }));
      }
    };

    const moveBullets = () => {
      setPlayer((prev) => ({
        ...prev,
        bullets: prev.bullets.map((bullet) => ({
          ...bullet,
          x: bullet.x + Math.cos(bullet.angle) * 5,
          y: bullet.y + Math.sin(bullet.angle) * 5,
        })),
      }));

      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => ({
          ...enemy,
          bullets: enemy.bullets.map((bullet) => ({
            ...bullet,
            x: bullet.x + Math.cos(bullet.angle) * 5,
            y: bullet.y + Math.sin(bullet.angle) * 5,
          })),
        }))
      );
    };

    const moveEnemies = () => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => ({
          ...enemy,
          x: enemy.x + (Math.random() - 0.5) * 10,
          y: enemy.y + (Math.random() - 0.5) * 10,
          angle: Math.random() * 2 * Math.PI,
          bullets: [
            ...enemy.bullets,
            {
              x: enemy.x + Math.cos(enemy.angle) * 15,
              y: enemy.y + Math.sin(enemy.angle) * 15,
              angle: enemy.angle,
            },
          ],
        }))
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    const gameInterval = setInterval(() => {
      updateGame();
      moveBullets();
      moveEnemies();
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval);
    };
  }, [player, enemies]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Tank Game</Text>
        <Text>Use arrow keys to move your tank. Press space to shoot.</Text>
        <Box position="relative" width="500px" height="500px" border="1px solid black">
          <canvas ref={canvasRef} width="500" height="500" />
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;