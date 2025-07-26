// Arrow Key Game JavaScript

const arrows = [
  { key: "ArrowUp", symbol: "↑" },
  { key: "ArrowDown", symbol: "↓" },
  { key: "ArrowLeft", symbol: "←" },
  { key: "ArrowRight", symbol: "→" },
];
let score = 0;
let highScores = { 30: 0, 45: 0, 60: 0 };
let currentArrow = null;
let timeLeft = 30;
let timerInterval = null;
let gameActive = false;
let gameStarted = false;
let selectedTime = 30;

function showRandomArrow() {
  if (!gameStarted && window.nextArrowForStart) {
    currentArrow = window.nextArrowForStart;
  } else {
    currentArrow = arrows[Math.floor(Math.random() * arrows.length)];
  }
  const arrowIcon = document.getElementById("arrow-icon");
  arrowIcon.textContent = currentArrow.symbol;
  arrowIcon.className = "";
  document
    .getElementById("arrow-container")
    .setAttribute(
      "aria-label",
      currentArrow.key.replace("Arrow", "") + " Arrow"
    );
  if (window.nextArrowForStart) window.nextArrowForStart = null;
}

function updateScore() {
  document.getElementById("score").textContent = `Score: ${score}`;
}

function updateHighScore() {
  document.getElementById("high-score").textContent =
    highScores[selectedTime] || 0;
  localStorage.setItem("arrowGameHighScores", JSON.stringify(highScores));
}

function updateTimer() {
  document.getElementById("timer").textContent = `Time: ${timeLeft}s`;
}

function resetGameUI() {
  score = 0;
  timeLeft = selectedTime;
  gameActive = false;
  gameStarted = false;
  document.getElementById("final-score").style.display = "none";
  document.getElementById("restart-btn").textContent = "Start Game";
  document.getElementById("restart-btn").disabled = false;
  if (!window.nextArrowForStart) {
    window.nextArrowForStart =
      arrows[Math.floor(Math.random() * arrows.length)];
  }
  const arrowIcon = document.getElementById("arrow-icon");
  arrowIcon.textContent = window.nextArrowForStart.symbol;
  arrowIcon.className = "arrow-trace-icon";
  updateScore();
  updateTimer();
  document.getElementById("time-controls").classList.remove("faded");
  document.querySelectorAll(".time-option").forEach((btn) => {
    btn.classList.remove("selected");
    if (parseInt(btn.getAttribute("data-time")) === selectedTime) {
      btn.classList.add("selected");
    }
    btn.disabled = false;
  });
}

function endGame(resetOnly = false) {
  gameActive = false;
  gameStarted = false;
  clearInterval(timerInterval);
  timeLeft = selectedTime;
  if (!resetOnly) {
    document.getElementById("final-score").style.display = "block";
    document.getElementById(
      "final-score"
    ).textContent = `Game Over! Your final score: ${score}`;
  } else {
    document.getElementById("final-score").style.display = "none";
  }
  if (score > (highScores[selectedTime] || 0)) {
    highScores[selectedTime] = score;
    updateHighScore();
  } else {
    updateHighScore();
  }
  const arrowIcon = document.getElementById("arrow-icon");
  if (window.nextArrowForStart) {
    arrowIcon.textContent = window.nextArrowForStart.symbol;
  } else {
    const fallbackArrow = arrows[Math.floor(Math.random() * arrows.length)];
    arrowIcon.textContent = fallbackArrow.symbol;
    window.nextArrowForStart = fallbackArrow;
  }
  arrowIcon.className = "arrow-trace-icon";
  document.getElementById("restart-btn").textContent = "Start Game";
  document.getElementById("restart-btn").disabled = false;
  document.getElementById("time-controls").classList.remove("faded");
  document.querySelectorAll(".time-option").forEach((btn) => {
    btn.disabled = false;
  });
  updateTimer();
}

function startGame() {
  if (gameStarted) return;
  score = 0;
  timeLeft = selectedTime;
  gameActive = true;
  gameStarted = true;
  document.getElementById("final-score").style.display = "none";
  document.getElementById("restart-btn").textContent = "End Game";
  document.getElementById("restart-btn").disabled = false;
  updateScore();
  updateTimer();
  if (window.nextArrowForStart) {
    currentArrow = window.nextArrowForStart;
    const arrowIcon = document.getElementById("arrow-icon");
    arrowIcon.textContent = currentArrow.symbol;
    arrowIcon.className = "";
    document
      .getElementById("arrow-container")
      .setAttribute(
        "aria-label",
        currentArrow.key.replace("Arrow", "") + " Arrow"
      );
    window.nextArrowForStart = null;
  } else {
    showRandomArrow();
  }
  document.getElementById("time-controls").classList.add("faded");
  document.querySelectorAll(".time-option").forEach((btn) => {
    btn.disabled = true;
  });
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (score > (highScores[selectedTime] || 0)) {
        highScores[selectedTime] = score;
        updateHighScore();
      }
      endGame();
    }
  }, 1000);
}

function showScorePenaltyAnimation() {
  let penaltyElem = document.getElementById("score-penalty");
  if (!penaltyElem) {
    penaltyElem = document.createElement("div");
    penaltyElem.id = "score-penalty";
    penaltyElem.textContent = "-2";
    penaltyElem.style.position = "absolute";
    penaltyElem.style.left = "50%";
    penaltyElem.style.top = "calc(50% + 60px)";
    penaltyElem.style.transform = "translate(-50%, 0)";
    penaltyElem.style.fontSize = "48px";
    penaltyElem.style.color = "#d32f2f";
    penaltyElem.style.fontWeight = "700";
    penaltyElem.style.opacity = "0";
    penaltyElem.style.pointerEvents = "none";
    penaltyElem.style.transition = "opacity 0.3s, top 0.5s";
    penaltyElem.style.zIndex = "10";
    document.getElementById("main-container").appendChild(penaltyElem);
  }
  penaltyElem.style.opacity = "1";
  penaltyElem.style.top = "calc(50% + 10px)";
  setTimeout(() => {
    penaltyElem.style.opacity = "0";
    penaltyElem.style.top = "calc(50% + 60px)";
  }, 600);
}

function handleTimeChange(newTime) {
  selectedTime = newTime;
  timeLeft = selectedTime;
  updateTimer();
  updateHighScore();
  document.querySelectorAll(".time-option").forEach((btn) => {
    btn.classList.remove("selected");
    if (parseInt(btn.getAttribute("data-time")) === selectedTime) {
      btn.classList.add("selected");
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    if (!gameActive) {
      startGame();
    } else {
      endGame(true);
    }
    return;
  }
  if (event.code === "Enter" && !gameActive) {
    startGame();
    return;
  }
  if (event.code === "Escape" && gameActive) {
    endGame(true);
    return;
  }
  if (!gameStarted && ["ArrowLeft", "ArrowRight"].includes(event.code)) {
    const times = [30, 45, 60];
    let idx = times.indexOf(selectedTime);
    if (event.code === "ArrowLeft" && idx > 0) {
      handleTimeChange(times[idx - 1]);
    } else if (event.code === "ArrowRight" && idx < times.length - 1) {
      handleTimeChange(times[idx + 1]);
    }
    return;
  }
  if (!gameActive || !currentArrow) return;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    if (event.key === currentArrow.key) {
      score++;
    } else {
      score -= 2;
      showScorePenaltyAnimation();
    }
    updateScore();
    showRandomArrow();
  }
});

document.getElementById("restart-btn").addEventListener("click", function () {
  if (!gameActive) {
    startGame();
  } else {
    endGame(true);
  }
});

document.querySelectorAll(".time-option").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (!gameStarted) {
      handleTimeChange(parseInt(btn.getAttribute("data-time")));
    }
  });
});

if (localStorage.getItem("arrowGameHighScores")) {
  try {
    highScores = JSON.parse(localStorage.getItem("arrowGameHighScores"));
    if (!highScores || typeof highScores !== "object")
      highScores = { 30: 0, 45: 0, 60: 0 };
  } catch {
    highScores = { 30: 0, 45: 0, 60: 0 };
  }
  updateHighScore();
}
window.addEventListener("load", function () {
  localStorage.removeItem("arrowGameHighScores");
  highScores = { 30: 0, 45: 0, 60: 0 };
  updateHighScore();
});

resetGameUI();

window.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("button, [tabindex]").forEach((el) => {
    el.setAttribute("tabindex", "-1");
  });
});
