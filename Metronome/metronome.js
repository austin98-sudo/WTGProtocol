let delay = 60;
let display = document.getElementById("seconds");
let timer = null;
let timerStatus = false;

document.getElementById("up").addEventListener("click", (e) => {
  e.preventDefault();
  delay = delay + 1;
  display.innerHTML = delay;
  clearInterval(timer);
  if (timerStatus == true) {
    startMetronome(delay);
  }
});

document.getElementById("down").addEventListener("click", (e) => {
  e.preventDefault();
  delay = delay - 1;
  display.innerHTML = delay;
  clearInterval(timer);
  if (timerStatus == true) {
    startMetronome(delay);
  }
});

document.getElementById("control").addEventListener("click", (e) => {
  if (timerStatus == false) {
    timerStatus = true;
    startMetronome(delay);
    e.target.textContent = "Stop";
    e.target.classList.remove("green");
    e.target.classList.add("red");
  } else {
    timerStatus = false;
    clearInterval(timer);
    e.target.textContent = "Start";
    e.target.classList.remove("red");
    e.target.classList.add("green");
  }
});

function startMetronome(delay) {
  timer = setInterval(() => {
    let beat = new Audio("./metronome.flac");
    beat.play();
  }, (60 / delay) * 1000);
}
