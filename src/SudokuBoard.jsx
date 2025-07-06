import React from "react";
import { isValidSudoku, getInvalidCells } from "./utils/sudokuValidator";

export default function SudokuBoard({
  grid,
  setGrid,
  setStatus,
  setInvalidCells,
  invalidCells,
  highlightedNumber,
  setHighlightedNumber,
  setHistory
}) {
  const handleChange = (row, col, value) => {
    if (/^[1-9]?$/.test(value)) {
      setHistory(prev => [...prev, grid.map(r => [...r])]);  // Save a deep copy

      const newGrid = grid.map((r, rIndex) =>
        r.map((c, cIndex) =>
          rIndex === row && cIndex === col ? value : c
        )
      );
      setGrid(newGrid);

      // Update invalid cells for highlighting
      const invalid = getInvalidCells(newGrid);
      setInvalidCells(invalid);

      // Update status if fully filled
      if (newGrid.every(row => row.every(cell => cell !== ""))) {
        if (isValidSudoku(newGrid)) {
          setStatus("solved");
        } else {
          setStatus("");  // Don't force "error" message, just highlight
        }
      } else {
        setStatus("");
      }
    }
  };

  return (
    <div className="board">
      {[0, 1, 2].map((squareRow) => (
        <div key={squareRow} className="square-row">
          {[0, 1, 2].map((squareCol) => (
            <div key={squareCol} className="square">
              {[0, 1, 2].map((cellRow) =>
                [0, 1, 2].map((cellCol) => {
                  const rowIndex = squareRow * 3 + cellRow;
                  const colIndex = squareCol * 3 + cellCol;
                  const cellValue = grid[rowIndex][colIndex];

                  const isInvalid = invalidCells.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  );

                  const isHighlighted = highlightedNumber !== "" &&
                    cellValue === highlightedNumber;

                  return (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      className={`cell ${isInvalid ? "invalid" : ""} ${isHighlighted ? "highlight" : ""}`}
                      value={cellValue}
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                      onClick={() => setHighlightedNumber(cellValue)}
                    />
                  );
                })
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
