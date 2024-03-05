import { useState } from "react";

function Square({ id, value, onSquareClick }) {
  return (
    <button
      id={"square_" + id}
      className="square"
      onClick={onSquareClick}
      value={value}
    >
      {value}
    </button>
  );
}

function setColour(
  indexes = Array.from({ length: 10 }, (_, index) => index),
  flag = 0,
  winner = null
) {
  let square_element;
  let colour;
  setTimeout(() => {
    indexes.forEach((index) => {
      if (flag == 1) {
        square_element = document.querySelector(
          `#square_${index}[value="${winner}"]`
        );
        colour = "#69ffb4";
      } else {
        square_element = document.querySelector(`#square_${index}`);
        colour = "transparent";
      }

      if (square_element) square_element.style.backgroundColor = colour;
    });
  }, 1);
}

export default function Game() {
  let filledsquares = null;
  const [isRestartButtonDisabled, setRestartButtonDisabled] = useState(false);

  function Board({ xIsNext, squares, onPlay }) {
    var values = calculateWinner(squares);

    function handleClick(i) {
      if (values || squares[i]) return;
      const nextSquares = squares.slice();

      if (xIsNext) nextSquares[i] = "X";
      else nextSquares[i] = "O";

      onPlay(nextSquares);
    }

    let status;
    if (values !== null && values !== undefined) {
      const winner = values[0];
      const win_indexes = values[1];
      setColour(win_indexes, 1, winner);
      status = `${winner} is the Winner!`;
      // setTimeout(() => alert(status), 10);
    } else {
      status = `Next move: ${xIsNext ? "X" : "O"}`;
      setColour();
    }

    var elements = [];
    for (let i = 0; i < 9; i++) {
      if (i % 3 == 0) elements.push(<div className="board-row"></div>);

      elements.push(
        <Square
          id={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
        />
      );
    }

    return (
      <>
        <h1>Tic-Tac-Toe</h1>
        <br></br>
        <div className="status">{status}</div>
        <div className="Board">{elements}</div>
        {/!*TODO implement this !! */}
        <button value={"test"} disabled={!isRestartButtonDisabled}>
          Restart Game
        </button>
      </>
    );
  }

  function restartButton(currentSquares, setRestartButtonDisabled) {
    const filledsquares = currentSquares.filter(Boolean);
    let length = filledsquares.length;

    console.log("currentSquares", currentSquares);
    console.log("filled", filledsquares);
    console.log("length", length);

    if (length > 0) {
      setRestartButtonDisabled(true);
    } else {
      setRestartButtonDisabled(false);
    }
  }

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    restartButton(currentSquares, setRestartButtonDisabled);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    if (nextSquares.every((value) => value !== undefined && value !== null))
      setTimeout(() => alert("Draw!"), 1);
  }

  function jumpTo(nextMove) {
    restartButton(currentSquares, setRestartButtonDisabled);
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) description = `Go to move number ${move} `;
    else description = `Go to Game Starting`;
    return <button onClick={() => jumpTo(move)}>{description}</button>;
  });

  return (
    <>
      <div className="board_moves_container">
        <div style={{ width: "100%" }}>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="movesdiv">{moves}</div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  var indexes = [];
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
      var winner = squares[a];
      indexes.push(a, b, c);
      return [winner, indexes];
    }
  }
  return null;
}
