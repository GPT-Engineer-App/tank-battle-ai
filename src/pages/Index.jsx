import React, { useEffect, useRef, useState } from "react";
import { Container, Text, VStack, Box, Button } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 50, y: 50, angle: 0 });
  const [enemies, setEnemies] = useState([{ x: 200, y: 200, angle: 0 }]);

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

    const updateGame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawTank(player.x, player.y, player.angle, "blue");
      enemies.forEach((enemy) => drawTank(enemy.x, enemy.y, enemy.angle, "red"));
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") setPlayer((prev) => ({ ...prev, y: prev.y - 5 }));
      if (e.key === "ArrowDown") setPlayer((prev) => ({ ...prev, y: prev.y + 5 }));
      if (e.key === "ArrowLeft") setPlayer((prev) => ({ ...prev, angle: prev.angle - 0.1 }));
      if (e.key === "ArrowRight") setPlayer((prev) => ({ ...prev, angle: prev.angle + 0.1 }));
    };

    window.addEventListener("keydown", handleKeyDown);
    const gameInterval = setInterval(updateGame, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval);
    };
  }, [player, enemies]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Tank Game</Text>
        <Text>Use arrow keys to move your tank.</Text>
        <Box position="relative" width="500px" height="500px" border="1px solid black">
          <canvas ref={canvasRef} width="500" height="500" />
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;