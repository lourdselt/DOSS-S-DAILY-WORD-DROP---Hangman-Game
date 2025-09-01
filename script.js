document.addEventListener("DOMContentLoaded", () => {

  const wordDisplay = document.getElementById("word-display");
  const lettersContainer = document.getElementById("letters");
  const hangmanLines = document.querySelectorAll(".line");
  const progressBar = document.getElementById("progress-bar");
  const resetButton = document.getElementById("reset");
  const clueElement = document.getElementById("clue");
  const iconElement = document.getElementById("clue-icon");

  let word = "";
  let clue = "";
  let icon = "";
  let correctGuesses = [];
  let wrongGuesses = 0;

  // Fetch daily word from JSON
  fetch("words.json")
    .then(res => res.json())
    .then(data => {
      word = data.word.toUpperCase();
      clue = data.clue;
      icon = data.icon;

      clueElement.textContent = clue;
      iconElement.textContent = icon;

      setupLetters();
      updateWordDisplay();
    })
    .catch(err => {
      console.error("Error loading words.json:", err);
      clueElement.textContent = "Error loading daily word!";
    });

  function setupLetters() {
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement("button");
        button.textContent = letter;
        button.addEventListener("click", () => handleGuess(letter, button));
        lettersContainer.appendChild(button);
    }
  }

  function handleGuess(letter, button) {
      button.disabled = true;

      if (word.includes(letter)) {
          correctGuesses.push(letter);
          updateWordDisplay();
          checkWin();
      } else {
          if (wrongGuesses < hangmanLines.length) {
              setTimeout(() => {
                  hangmanLines[wrongGuesses].classList.add("visible");
              }, wrongGuesses * 400);
          }

          wrongGuesses++;
          progressBar.style.width = (wrongGuesses / hangmanLines.length) * 100 + "%";

          wordDisplay.classList.add("shake");
          setTimeout(() => wordDisplay.classList.remove("shake"), 300);

          if (wrongGuesses === hangmanLines.length) {
              setTimeout(() => alert(`Game Over! Word was: ${word}`), 200);
          }
      }
  }

  function updateWordDisplay() {
      wordDisplay.innerHTML = word.split("").map(l => {
          return `<span>${correctGuesses.includes(l) ? l : "_"}</span>`;
      }).join(" ");
  }

  function checkWin() {
      if (word.split("").every(l => correctGuesses.includes(l))) {
          setTimeout(() => alert("🎉 You guessed it!"), 200);
      }
  }

  resetButton.addEventListener("click", () => {
      correctGuesses = [];
      wrongGuesses = 0;
      hangmanLines.forEach(line => line.classList.remove("visible"));
      progressBar.style.width = "0%";
      updateWordDisplay();
      document.querySelectorAll(".letters button").forEach(btn => btn.disabled = false);
  });

});
