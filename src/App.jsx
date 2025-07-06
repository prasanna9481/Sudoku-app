import React, { useState, useEffect } from "react";
import { createEmptyGrid, fillGrid, digHoles } from "./utils/sudokuGenerator";
import SudokuBoard from "./SudokuBoard";
import { isValidSudoku } from "./utils/sudokuValidator";

export default function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [history, setHistory] = useState([]);
  const [difficulty, setDifficulty] = useState(40);
  const [status, setStatus] = useState("");
  const [invalidCells, setInvalidCells] = useState([]);
  const [highlightedNumber, setHighlightedNumber] = useState("");
  const [solution, setSolution] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (status === "solved" && timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [status, timerId]);

  const handleNewGame = () => {
    if (timerId) clearInterval(timerId);
    let newGrid = createEmptyGrid();
    fillGrid(newGrid);
    const solvedCopy = newGrid.map(r => [...r]);
    setSolution(solvedCopy);
    digHoles(newGrid, difficulty);
    setGrid(newGrid.map(r => [...r]));
    setHistory([]);
    setStatus("");
    setInvalidCells([]);
    setHighlightedNumber("");
    setSecondsElapsed(0);

    const id = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    setTimerId(id);
  };

  const handleReset = () => {
    if (timerId) clearInterval(timerId);
    setGrid(createEmptyGrid());
    setHistory([]);
    setStatus("");
    setInvalidCells([]);
    setHighlightedNumber("");
    setSecondsElapsed(0);
  };

  const handleSolve = () => {
    if (timerId) clearInterval(timerId);
    let copyGrid = grid.map(r => [...r]);
    fillGrid(copyGrid);
    setGrid(copyGrid.map(r => [...r]));
    setHistory([]);
    setStatus("solved");
  };

  const handleHint = () => {
    if (!solution) return;
    let emptyCells = [];
    grid.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell === "") emptyCells.push([rIdx, cIdx]);
      });
    });
    if (emptyCells.length === 0) return;
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setHistory(prev => [...prev, grid.map(row => [...row])]);
    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === r && cIdx === c ? solution[r][c] : cell
      )
    );
    setGrid(newGrid);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevGrid = history[history.length - 1];
      setGrid(prevGrid);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="background-overlay"></div>
      <div className="header-absolute">
        <h1 className="title">Sudoku</h1>
        <div className="header-controls">
          <div className="timer">
            Time: {String(Math.floor(secondsElapsed / 60)).padStart(2, "0")}:
            {String(secondsElapsed % 60).padStart(2, "0")}
          </div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="fancy-select"
          >
            <option value={30}>Easy</option>
            <option value={40}>Medium</option>
            <option value={50}>Hard</option>
          </select>
          <button className="fancy-button" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      <div className="content">
        <div className="overlay">
          <div className="controls">
            <button className="fancy-button" onClick={handleNewGame}>New Game</button>
            <button className="fancy-button" onClick={handleReset}>Reset</button>
            <button className="fancy-button" onClick={handleSolve}>Solve</button>
            <button className="fancy-button" onClick={handleHint}>Hint</button>
            <button className="fancy-button" onClick={handleUndo} disabled={history.length === 0}>Undo</button>
          </div>

          {status && (
            <div className={`status ${status}`}>
              {status === "solved" && "🎉 You solved it!"}
              {status === "error" && "❌ There are mistakes in your solution."}
            </div>
          )}

          <SudokuBoard
            grid={grid}
            setGrid={setGrid}
            setStatus={setStatus}
            setInvalidCells={setInvalidCells}
            invalidCells={invalidCells}
            highlightedNumber={highlightedNumber}
            setHighlightedNumber={setHighlightedNumber}
            setHistory={setHistory}
            history={history}
          />
        </div>
      </div>
    </div>
  );
}
