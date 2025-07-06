// Helper to create an empty 9x9 grid
export function createEmptyGrid() {
  return Array(9).fill(null).map(() => Array(9).fill(""));
}

// Check if placing num at (row, col) is valid
function isSafe(grid, row, col, num) {
  // Row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Column
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) return false;
  }

  // 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}

// Recursive backtracking solver/generator
export function fillGrid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === "") {
        let nums = ["1","2","3","4","5","6","7","8","9"];
        shuffle(nums);
        for (let num of nums) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) {
              return true;
            }
            grid[row][col] = "";
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Shuffle helper
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// Remove numbers from filled grid to create puzzle
export function digHoles(grid, holes = 40) {
  let attempts = 0;
  while (holes > 0 && attempts < 81 * 2) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (grid[row][col] !== "") {
      grid[row][col] = "";
      holes--;
    }

    attempts++;
  }
}

