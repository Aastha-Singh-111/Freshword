import React, { useState, useRef } from "react";
import "./s2.css";

const MainGame = () => {
  const [numLetters, setNumLetters] = useState(5);
  const [rows, setRows] = useState(11);
  const [showGrid, setShowGrid] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [correctWord, setCorrectWord] = useState("");
  const gridRef = useRef([]);
  const [results, setResults] = useState(Array(11).fill({ green: 0, yellow: 0 }));

  const handleNumLettersChange = (event) => {
    const value = parseInt(event.target.value);
    setNumLetters(value);

    switch (value) {
      case 3:
        setRows(5);
        break;
      case 4:
        setRows(8);
        break;
      case 5:
        setRows(11);
        break;
      case 6:
        setRows(13);
        break;
      default:
        break;
    }
  };

  const handleStart = async () => {
    setIsLoading(true);
    const newWord = await getRandomWord(numLetters);
    setCorrectWord(newWord.toLowerCase());
    setIsLoading(false);
    setShowGrid(true);
    setIsGameStarted(true);
    setCurrentRow(0);
    setResults(Array(rows).fill({ green: 0, yellow: 0 }));

    gridRef.current = Array.from({ length: rows }, () =>
      Array.from({ length: numLetters }, () => null)
    );
  };

  const handleReset = () => {
    setIsGameStarted(false);
    setShowGrid(false);
    setCorrectWord("");
    setCurrentRow(0);
    setResults(Array(rows).fill({ green: 0, yellow: 0 }));
  };

  const handleInput = (e, rowIndex, colIndex) => {
    const value = e.target.value.toLowerCase();

    if (/^[a-z]$/.test(value)) {
      gridRef.current[rowIndex][colIndex].value = value;
      if (colIndex < numLetters - 1) {
        gridRef.current[rowIndex][colIndex + 1].focus();
      }
    }
  };

  const handleBackspace = (e, rowIndex, colIndex) => {
    if (e.key === "Backspace") {
      if (gridRef.current[rowIndex][colIndex].value) {
        gridRef.current[rowIndex][colIndex].value = "";
      } else if (colIndex > 0) {
        gridRef.current[rowIndex][colIndex - 1].focus();
      }
    }

    if (e.key === "Enter") {
      handleSubmit(rowIndex);
    }
  };

  async function getRandomWord(wordLength) {
    const url = "https://random-word-api.herokuapp.com/word";
    const params = new URLSearchParams({ length: wordLength });

    try {
      const response = await fetch(`${url}?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data[0] || "error";
      } else {
        return `Error: ${response.status} - ${response.statusText}`;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }

  const handleSubmit = (rowIndex) => {
    const enteredWord = gridRef.current[rowIndex]
      .map((input) => input.value.toLowerCase())
      .join("");

    if (enteredWord.length !== numLetters) {
      alert("Complete the word before pressing Enter!");
      return;
    }

    let greenCount = 0;
    let yellowCount = 0;

    const letterCount = {};
    correctWord.split("").forEach((char, idx) => {
      if (enteredWord[idx] === char) {
        greenCount++;
      } else {
        letterCount[char] = (letterCount[char] || 0) + 1;
      }
    });

    enteredWord.split("").forEach((char, idx) => {
      if (enteredWord[idx] !== correctWord[idx] && letterCount[char]) {
        yellowCount++;
        letterCount[char]--;
      }
    });

    const newResults = [...results];
    newResults[rowIndex] = { green: greenCount, yellow: yellowCount };
    setResults(newResults);
    
    if (enteredWord === correctWord) {
      alert("Congratulations! You guessed the word!");
      handleReset();
    }

    if (rowIndex < rows - 1) {
      setCurrentRow(rowIndex + 1);
      gridRef.current[rowIndex + 1][0].focus();
    } else {
      alert(`Game over! The correct word was "${correctWord.toUpperCase()}".`);
      handleReset();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Word Guessing Game</h1>
        <div className="settings">
          <label>
            Number of Letters:
            <select
              value={numLetters}
              onChange={handleNumLettersChange}
              className="letter-select"
              disabled={isGameStarted}
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleStart}
          className="start-button"
          disabled={isGameStarted}
          style={{
            cursor: isGameStarted ? "not-allowed" : "pointer",
            opacity: isGameStarted ? 0.6 : 1,
          }}
        >
          Start
        </button>
      </div>
      {isLoading && <div className="loader">Loading...</div>}
      {showGrid && !isLoading && (
        <div className="grid-container">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array.from({ length: numLetters }).map((_, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  className="letter-box"
                  maxLength="1"
                  type="text"
                  disabled={rowIndex !== currentRow}
                  ref={(el) => {
                    if (!gridRef.current[rowIndex]) {
                      gridRef.current[rowIndex] = [];
                    }
                    gridRef.current[rowIndex][colIndex] = el;
                  }}
                  onInput={(e) => handleInput(e, rowIndex, colIndex)}
                  onKeyDown={(e) => handleBackspace(e, rowIndex, colIndex)}
                />
              ))}
              <div className="result-circles">
                <div
                  className={`green-circle ${results[rowIndex].green > 0 ? "filled" : ""}`}
                >
                  {results[rowIndex].green}
                </div>
                <div
                  className={`yellow-circle ${results[rowIndex].yellow > 0 ? "filled" : ""}`}
                >
                  {results[rowIndex].yellow}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainGame;
