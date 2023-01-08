let codeData = {
  timerStarted: false,
  timer: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  pulseTimer: {
    minutes: 2,
    seconds: 0,
  },
  events: [],
  status: {
    access: false,
    intubation: false,
    supraglottic: false,
    adjunct: false,
  },
  meds: {
    Amiodarone: 0,
    Epinephrine: 0,
    Lidocaine: 0,
    Bicarb: 0,
    Calcium: 0,
  },
  shocks: {
    "120J": 0,
    "150J": 0,
    "200J": 0,
  },
  cardiovert: {
    "100J": 0,
    "150J": 0,
    "200J": 0,
    "250J": 0,
  },
};

//Menu buttons
document.getElementById("newCode").addEventListener("click", () => {
  // new code
  document.getElementById("codeMenu").style.display = "none";
  document.getElementById("codeAlert").style.display = "block";
  document.getElementById("header").style.display = "none";
});

const date = new Date();

//Control Functions
function formattedDate() {
  let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${hours}:${minutes}`;
}

function formatDisplayTime(hr = null, min, sec) {
  let time = {
    hour: hr,
    second: sec < 10 ? `0${sec}` : sec,
    minute: min < 10 ? `0${min}` : min,
  };

  if (hr === null) {
    return `${min}:${time.second}`;
  } else {
    return `${time.hour}:${time.minute}:${time.second}`;
  }
}

function appendEvent(item) {
  codeData.events.push(`${formattedDate()} - ${item}`);
}

function logPacing() {
  //get capture buttons
  let yesCapture = document.getElementById("yesCapture");
  let noCapture = document.getElementById("noCapture");

  let ma = document.getElementById("pacingmA");

  if (!yesCapture.disabled && !noCapture.disabled) {
    //button was not clicked;
    appendEvent(`Pacing at ${ma.value}mA`);
  } else if (!yesCapture.disabled) {
    //without capture
    appendEvent(`Pacing at ${ma.value}mA with no mechanical capture`);
  } else {
    //with capture
    appendEvent(`Pacing at ${ma.value}mA with mechanical capture`);
  }

  yesCapture.disabled = false;
  noCapture.disabled = false;
  ma.value = "";

  document.getElementById("pacingModal").style.display = "none";
}

//Rhythm check
function logPulse() {
  let pulseBtn = document.getElementById("pulse");
  let noPulseBtn = document.getElementById("noPulse");
  let rhythm = document.getElementById("rhythmCheck");
  let comment = document.getElementById("rhythmComment");
  let pulse = null;

  if (pulseBtn.disabled || noPulseBtn.disabled) {
    //no buttons selected
    if (pulseBtn.disabled) {
      //pulse
      pulse = "pulse";
    } else {
      //no pulse
      pulse = "no pulse";
    }
  }

  if (rhythm.value === "" && pulse === null) {
    //no pulse or rhythm was entered
    //throw error and make user fix
    alert("Pulse or rhythm must be entered");
    return;
  } else if (rhythm.value != "" && pulse === null) {
    //only rhythm was entered
    appendEvent(`Rhythm Check: ${rhythm.value}`);
  } else if (rhythm.value === "" && pulse != null) {
    //only pulse was entered
    appendEvent(`Pulse Check: ${pulse}`);
  } else {
    //both pulse and rhythm was entered
    appendEvent(`Rhythm is ${rhythm.value} with ${pulse}`);
  }

  if (comment.value != "") {
    appendEvent(`Note: ${comment.value}`);
  }

  pulseBtn.disabled = false;
  noPulseBtn.disabled = false;
  rhythm.value = "";

  document.getElementById("pulseCheckModal").style.display = "none";
}

//Control buttons
document.getElementById("startCode").addEventListener("click", () => {
  //start code
  codeData.timerStarted = true;
  document.getElementById("startCode").disabled = true;
  document.getElementById("endCode").disabled = false;
  appendEvent(`Code started at ${formattedDate()}`);
});

document.getElementById("endCode").addEventListener("click", () => {
  //end code
  let reason = prompt("Please enter reason code was stopped (Priority 4, ROSC, etc.)");

  if (reason != null) {
    codeData.timerStarted = false;
    document.getElementById("startCode").disabled = false;
    document.getElementById("endCode").disabled = true;
    appendEvent(`Code stopped at ${formattedDate()} - ${reason}`);

    let currentDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    localStorage.setItem(`${currentDate} - ${formattedDate()}`, codeData.events.join(","));
  }
});

function logNote() {
  let note = document.getElementById("noteInput"); //get note input

  appendEvent(note.value); //append note to event list and clear input
  note.value = "";

  //hide modal
  document.getElementById("noteModal").style.display = "none";
}

function addPulseCheck() {
  document.getElementById("pulseCheckModal").style.display = "block";
}

//administer medication button
document.querySelectorAll(".medication").forEach((el) => {
  el.addEventListener("click", (btn) => {
    let med = btn.target;

    //if medication is not in obj yet then add it, otherwise add one
    codeData.meds[med.value] = isNaN(codeData.meds[med.value]) ? 1 : (codeData.meds[med.value] += 1);

    btn.target.innerText = `${med.value} x ${codeData.meds[med.value]}\nLast given: ${formattedDate()}`;
  });
});

//administer shock button
document.querySelectorAll(".shock").forEach((el) => {
  el.addEventListener("click", (btn) => {
    let joule = btn.target.value;

    //if shock is not in obj yet then add it, otherwise add one
    codeData.shocks[joule] = isNaN(codeData.shocks[joule]) ? 1 : (codeData.shocks[joule] += 1);

    btn.target.innerText = `${joule} x ${codeData.shocks[joule]}`;
  });
});

//cardiovert button
document.querySelectorAll(".cardiovert").forEach((el) => {
  el.addEventListener("click", (btn) => {
    let joule = btn.target;
    //if cardiovert is not in object yet then add it, otherwise add one
    codeData.cardiovert[joule.value] = isNaN(codeData.cardiovert[joule.value])
      ? 1
      : (codeData.cardiovert[joule.value] += 1);

    btn.target.innerText = `${joule.value} x ${codeData.cardiovert[joule.value]}`;
  });
});

//Intubation controls
function openIntubate() {
  if (codeData.status.intubation === false) {
    document.getElementById("intubationModal").style.display = "block";
  } else {
    codeData.status.intubation = false;
    appendEvent("Intubation discontinued");
    document.getElementById("intubationBtn").classList.replace("green", "red");
  }
}

function logIntubate() {
  //get values from modal
  let size = document.getElementById("ettubesize").value;
  let cm = document.getElementById("ettubecm").value;

  //append event to list
  appendEvent(`${size} ET tube inserted with ${cm}cm`);

  //hide modal
  document.getElementById("intubationModal").style.display = "none";

  codeData.status.intubation = true;
  document.getElementById("intubationBtn").classList.replace("red", "green");
}

//supraglottic controls
function openSupraglottic() {
  if (codeData.status.supraglottic === false) {
    document.getElementById("supraglotticModal").style.display = "block";
  } else {
    codeData.status.supraglottic = false;
    appendEvent("Supraglottic discontinued");
    document.getElementById("supraglotticBtn").classList.replace("green", "red");
  }
}

function logSupraglottic() {
  //get values from modal
  let size = document.getElementById("supraglotticsize").value;

  //append event to list
  appendEvent(`${size} I-gel inserted`);

  //hide modal
  document.getElementById("supraglotticModal").style.display = "none";

  codeData.status.supraglottic = true;
  document.getElementById("supraglotticBtn").classList.replace("red", "green");
}

//Access and Adjunct Controls
document.querySelectorAll(".procedure").forEach((el) => {
  el.addEventListener("click", (btn) => {
    let btnValue = btn.target.value;

    if (codeData.status[btnValue] === false) {
      // if status is false set to true and change button color
      codeData.status[btnValue] = true;
      appendEvent(`${btnValue.toUpperCase()}`);
      btn.target.classList.replace("red", "green");
    } else {
      // if status is true set to false and change button color
      codeData.status[btnValue] = false;
      appendEvent(`${btnValue.toUpperCase()} discontinued`);
      btn.target.classList.replace("green", "red");
    }
  });
});

//Timer
setInterval(() => {
  if (codeData.timerStarted === true) {
    if (codeData.timer.seconds < 59) {
      //increment seconds
      codeData.timer.seconds++;
    } else {
      //when seconds is at 60 reset to zero and increment minutes
      codeData.timer.seconds = 0;
      codeData.timer.minutes++;
    }

    if (codeData.timer.minutes >= 60) {
      codeData.timer.minutes = 0;
      codeData.timer.hours++;
    }

    //decrease pulse timer
    if (codeData.pulseTimer.seconds > 0) {
      codeData.pulseTimer.seconds -= 1;
    } else if (codeData.pulseTimer.minutes > 0) {
      codeData.pulseTimer.seconds = 59;
      codeData.pulseTimer.minutes -= 1;
    } else {
      document.getElementById("pulseCheckModal").style.display = "block";
      codeData.pulseTimer.minutes = 2;
    }
  }

  //update pulse timer on scrnee
  document.getElementById("pulseTimerDisplay").innerText = `Rhythm check: ${formatDisplayTime(
    null,
    codeData.pulseTimer.minutes,
    codeData.pulseTimer.seconds
  )}`;

  //update code duration timer on screen
  document.getElementById("codeTimerDisplay").innerText = formatDisplayTime(
    codeData.timer.hours,
    codeData.timer.minutes,
    codeData.timer.seconds
  );
}, 1000);
