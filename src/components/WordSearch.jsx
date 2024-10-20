import React, { useState } from 'react';
import { generateWordSearch } from '../utils/wordSearch';
import { fetchWordsFromPrompt } from '../utils/fetchWords';
import jsPDF from 'jspdf';

const WordSearch = () => {
    const [prompt, setPrompt] = useState('');
    const [grid, setGrid] = useState([]);
    const [loading, setLoading] = useState(false);
    const [words, setWords] = useState([]); // Store words for download

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const wordArray = await fetchWordsFromPrompt(prompt);
            if (wordArray.length === 0) {
                alert('No words found for this prompt!');
                setLoading(false);
                return;
            }
    
            // Clean the wordArray: remove spaces and non-alphanumeric characters
            const cleanedWordArray = wordArray
                .map(word => word.replace(/[^a-zA-Z0-9]/g, '').trim()) // Remove non-alphanumerical characters
                .filter(word => word.length > 0) // Filter out empty strings
                .slice(0, 15); // Limit to the first 15 valid words
    
            if (cleanedWordArray.length === 0) {
                alert('No valid words found after cleaning!');
                setLoading(false);
                return;
            }
    
            setWords(wordArray); // Save the cleaned words
            const newGrid = generateWordSearch(cleanedWordArray);
            setGrid(newGrid);
        } catch (error) {
            console.error("Error fetching words:", error);
            alert('Error fetching words. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        
        const numRows = grid.length;
        const numCols = grid[0] ? grid[0].length : 0;
    
        const fixedBoxSize = 150; // Fixed size for the grid box (in mm)
        const cellSize = fixedBoxSize / Math.max(numRows, 1); // Cell size based on the fixed box size
        const fontSize = Math.floor(cellSize * 0.7); // Scale font size for words
        const titleFontSize = 18; // Larger font size for title
    
        // Title (prompt) centered
        doc.setFontSize(titleFontSize);
        const titleWidth = doc.getTextWidth(prompt);
        doc.text(prompt, (doc.internal.pageSize.getWidth() - titleWidth) / 2, 10);
    
        // Set font size for other texts
        doc.setFontSize(fontSize);
                
        // List the words neatly
        words.forEach((word, index) => {
            doc.text(`${index + 1}. ${word}`, 10, 40 + (index * fontSize));
        });
    
        // Draw box around the grid
        const startX = 30;
        const startY = 40 + words.length * fontSize; // Start below the words
        const boxWidth = fixedBoxSize;
        const boxHeight = fixedBoxSize;
    
        // Draw the rectangle for the grid box
        doc.rect(startX, startY, boxWidth, boxHeight); // Box around grid
    
        // Draw the grid
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) { // Only draw non-empty cells
                    const x = startX + colIndex * cellSize;
                    const y = startY + rowIndex * cellSize;
                    doc.text(cell, x + cellSize / 2, y + cellSize / 1.5, { align: 'center' }); // Center text within the cell
                }
            });
        });
    
        doc.save('word-search.pdf');
    };
    
    

    return (
        <div>
            <h1>Word Search Generator</h1>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt (e.g., animals, fruits)"
            />
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate'}
            </button>
            {grid.length > 0 && (
                <div>
                    <button onClick={handleDownload}>Download as PDF</button>
                </div>
            )}
        </div>
    );
};

export default WordSearch;
