import * as React from "react";
import { createContext, useContext, useState } from "react";
import { ChakraProvider, Center, Box, Button, VStack, Text, Grid } from "@chakra-ui/react";

// Create context for game state
const GameContext = createContext();

function GameProvider({ children }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [nextValue, setNextValue] = useState("X");

  function selectSquare(square) {
    if (squares[square] || calculateWinner(squares)) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[square] = nextValue;
    setSquares(newSquares);
    setNextValue(calculateNextValue(newSquares));
  }

  function restart() {
    setSquares(Array(9).fill(null));
    setNextValue("X");
  }

  return (
    <GameContext.Provider value={{ squares, nextValue, selectSquare, restart }}>
      {children}
    </GameContext.Provider>
  );
}

function useGame() {
  return useContext(GameContext);
}

function Board() {
  const { squares, selectSquare } = useGame();

  function renderSquare(i) {
    return (
      <Box
        as="button"
        background="black"
        border="1px solid white"
        float="left"
        fontSize="90px"
        fontWeight="bold"
        lineHeight="100px"
        height="100px"
        width="100px"
        marginRight="-1px"
        marginTop="-1px"
        padding="0"
        textAlign="center"
        color={squares[i] === "X" ? "red" : squares[i] === "O" ? "blue" : "white"}
        onClick={() => selectSquare(i)}
      >
        {squares[i]}
      </Box>
    );
  }

  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, calculateNextValue(squares));

  return (
    <Box>
      <Text mb="10px" color="white">
        {status}
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={0} w="302px">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </Grid>
    </Box>
  );
}

function Game() {
  const { restart } = useGame();

  return (
    <Center height="100vh">
      <VStack spacing={4}>
        <Box className="game-board">
          <Board />
        </Box>
        <Button
          className="restart"
          onClick={restart}
          backgroundColor="white"
          color="black"
          border="1px solid black"
          _hover={{ backgroundColor: "green", color: "white" }}
        >
          Restart
        </Button>
      </VStack>
    </Center>
  );
}

function App() {
  return (
    <ChakraProvider>
      <GameProvider>
        <Game />
      </GameProvider>
    </ChakraProvider>
  );
}

// Helper functions
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `DRAW!`
    : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? "X" : "O";
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
