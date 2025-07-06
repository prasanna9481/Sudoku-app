// Check if Sudoku is valid
export function isValidSudoku(grid) {
  // Helper to check for duplicates except empty
  const hasNoDuplicates = (arr) => {
    const nums = arr.filter(val => val !== "");
    return nums.length === new Set(nums).size;
  };

  // Rows
  for (let row = 0; row < 9; row++) {
    if (!hasNoDuplicates(grid[row])) return false;
  }

  // Columns
  for (let col = 0; col < 9; col++) {
    const colVals = grid.map(r => r[col]);
    if (!hasNoDuplicates(colVals)) return false;
  }

  // Boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      let boxVals = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          boxVals.push(grid[boxRow * 3 + r][boxCol * 3 + c]);
        }
      }
      if (!hasNoDuplicates(boxVals)) return false;
    }
  }

  return true;
}

// Identify invalid cells for highlighting
export function getInvalidCells(grid) {
  let invalid = [];

  // Row checks
  for (let row = 0; row < 9; row++) {
    let seen = {};
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col];
      if (val !== "") {
        if (seen[val] !== undefined) {
          invalid.push([row, col]);
          invalid.push([row, seen[val]]);
        } else {
          seen[val] = col;
        }
      }
    }
  }

  // Column checks
  for (let col = 0; col < 9; col++) {
    let seen = {};
    for (let row = 0; row < 9; row++) {
      const val = grid[row][col];
      if (val !== "") {
        if (seen[val] !== undefined) {
          invalid.push([row, col]);
          invalid.push([seen[val], col]);
        } else {
          seen[val] = row;
        }
      }
    }
  }

  // Box checks
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      let seen = {};
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const row = boxRow * 3 + r;
          const col = boxCol * 3 + c;
          const val = grid[row][col];
          if (val !== "") {
            if (seen[val] !== undefined) {
              invalid.push([row, col]);
              invalid.push(seen[val]);
            } else {
              seen[val] = [row, col];
            }
          }
        }
      }
    }
  }

  return invalid;
}
