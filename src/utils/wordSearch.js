function createGrid(size) {
    return Array.from({ length: size }, () => Array(size).fill(''));
}

function placeWord(grid, word) {
    const size = grid.length;
    let placed = false;
    const maxAttempts = 100; // Limit attempts to place a word

    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        const dir = Math.floor(Math.random() * 2); // 0 = horizontal, 1 = vertical
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        let canPlace = true;

        // Check if the word fits in the chosen direction
        if (dir === 0 && col + word.length <= size) { // Horizontal
            for (let i = 0; i < word.length; i++) {
                if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
                    canPlace = false; // Overlap with a different letter
                    break;
                }
            }
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    grid[row][col + i] = word[i];
                }
                placed = true;
            }
        } else if (dir === 1 && row + word.length <= size) { // Vertical
            for (let i = 0; i < word.length; i++) {
                if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) {
                    canPlace = false; // Overlap with a different letter
                    break;
                }
            }
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    grid[row + i][col] = word[i];
                }
                placed = true;
            }
        }
    }

    if (!placed) {
        console.warn(`Could not place the word: ${word}`);
    }
}

function fillEmptySpaces(grid) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }
        }
    }
}

export function generateWordSearch(words) {
    if (words.length === 0) return []; // Return an empty grid if no words are provided

    // Find the maximum word length
    const maxWordLength = Math.max(...words.map(word => word.length));
    
    // Calculate the smallest perfect square that can fit the longest word
    const gridSize = Math.ceil(Math.sqrt(maxWordLength)); // Get the next whole number
    const size = gridSize * gridSize; // Create a perfect square grid size

    const grid = createGrid(size);
    words.forEach(word => placeWord(grid, word));
    fillEmptySpaces(grid);
    return grid;
}
