const elements = {
  input_num: document.getElementById("countdownInput"),
  start_btn: document.getElementById("startButton"),
  reset_btn: document.getElementById("resetButton"),
  display: document.getElementById("countdownValue"),
};

let activeCountdown;

// Function to update the display with the current countdown time
const updateDisplay = (time) => (elements.display.textContent = time);

const startCountdown = () => {
  //"clearInterval" Clears previous countdown and ensures only one countdown is running
  clearInterval(activeCountdown);
  let time = parseInt(elements.input_num.value);

  if (isNaN(time) || time <= 0)
    return alert("Please enter a valid positive number.");

  //IIFE to start the countdown immediately after it's clicked
  (function countdown() {
    updateDisplay(time);
    //"activeCountdown" stores ID represents the scheduled next call of the countdown function
    activeCountdown = time > 0 ? setTimeout(countdown, 1000) : null;
    time === 0 ? (elements.display.textContent = "Time is up!") : time--;
  })();
};

const resetCountdown = () => {
  clearTimeout(activeCountdown);
  updateDisplay(0);
};

elements.start_btn.addEventListener("click", startCountdown);
elements.reset_btn.addEventListener("click", resetCountdown);
