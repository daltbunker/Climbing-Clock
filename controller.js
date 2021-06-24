const startBtn = document.getElementById("startBtn");
const setBtn = document.getElementById("setBtn");
const cancelBtn = document.getElementById("cancelBtn");
const volumeBtn =  document.getElementById("volumeBtn");
const enterBtn = document.getElementById("enterBtn");
const timerBox = document.getElementById("timerBox");
const climbMinError = document.getElementById("climbMinError");
const climbSecError = document.getElementById("climbSecError");
const restSecError = document.getElementById("restSecError");
const restMinError = document.getElementById("restMinError");
const roundsCount = document.getElementById("roundsCount");
const formContentWrap = document.getElementById("formContentWrap");
const contentWrapId = document.getElementById("content-wrap-id");
const imgOff = document.getElementById("imgOff");
const imgOn = document.getElementById("imgOn");
const customCheck = document.getElementById("customCheck");
const repeatCheck = document.getElementById("repeatCheck");
const dropDown = document.getElementById("dropDown");
let pauseBtn;
let audio;

function onPageLoad() {
    startBtn.onclick = onStartBtnClicked;
    setBtn.onclick = onSetBtnClicked;
    cancelBtn.onclick = onCancelBtnClicked;
    volumeBtn.onclick = onVolumeBtnClicked;
    enterBtn.onclick = onEnterBtnClicked;
    customCheck.onclick = function () {
        dropDown.style.display = "block"
    }
    repeatCheck.onclick = function () {
        dropDown.style.display = "none";
    };

    clearSetForm();
    clearButtons();
}

function startTimer(
    duration, 
    rest, 
    display, 
    rounds, 
    audio, 
    resume, 
    state = "climb", 
    round = 1
){
    let climb = true;
    var timer = duration, minutes, seconds;
    let color = "green";
    let climbStatus = "CLIMB";
    if (state == "rest") {
        climbStatus = "REST";
        color = "red";
        climb = false;
    }
    timer = resume;
    interval = setInterval(function () {

        document.querySelector("h1").innerText = climbStatus;
        timerBox.style.borderColor = color;
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (rounds == 1000000) {
            roundsCount.innerHTML = "";
        }
        else {
            roundsCount.textContent = "Round: " + round + "/" + rounds;
        }
        
        if (audio && timer == 3) {
            play();
        }

        if (isNaN(timer)) {
            roundsCount.textContent = "Round: 0/0";
            clearInterval(interval);
            clearTime();
            clearButtons();
            clearSetForm();
        }

        if (--timer == 0) {        // decrements time
            if(climb){
                times[0].roundComplete++; // Updates rounds in model for pause/resume
                round++;
                timer = rest;
                climb = false;
                climbStatus = "REST";
                color = "red";
                
            }
            else {
                timer = duration;
                climb = true;
                climbStatus = "CLIMB";
                color = "green";
            }
            if (round > rounds) {
                timer = NaN;
            }
        }
    }, 1000);
}

function onStartBtnClicked() {
    timerBox.style.display = "block";
    let time = times[0];
    let climbTime = getTime();
    let restTime = getRest();
    let rounds = time.rounds;
    let audio = saveAudio[0];
    display = timerBox;
    clearSetForm();
    startTimer(climbTime, restTime, display, rounds, audio, climbTime);
    
    document.querySelector("h1").innerText = "CLIMB";
    startBtn.style.display = "inline";
    startBtn.innerHTML = "Pause";
    cancelBtn.style.display = "inline";
    startBtn.id = "pauseBtn";
    pauseBtn = document.getElementById("pauseBtn");
    pauseBtn.onclick = onPauseBtnClicked;
    pauseBtn.disabled = false;

}

function resumeTimer() {
    let time = times[0];
    let climbTime = getTime();
    let restTime = getRest();
    let rounds = time.rounds;
    let audio = saveAudio[0];
    let round = times[0].roundComplete;
    let resume = parseInt(timerBox.textContent.substr(0, 2)) * 60 + parseInt(timerBox.textContent.substr(3, ));
    let state;
    if (timerBox.style.borderColor == "red") {
        state = "rest";
    }
    else {
        state = "climb";
    }
    startTimer(climbTime, restTime, display, rounds, audio, resume, state, round);
}

function onSetBtnClicked() {
    formContentWrap.style.display = "block";
    contentWrapId.style.display = "none";
    volumeBtn.style.display = "block";
    imgOff.style.display = "none";
    imgOn.style.display = "inline";
    window.scrollTo(200, 200);
}

function onCancelBtnClicked() {
    try {
        clearInterval(interval);
    }
    catch (err) {
    }
    timerBox.textContent = "00:00";
    roundsCount.textContent = "Round: 0/0";
    if (audio) {
        audio.pause();
    }
    clearTime();
    clearButtons();
    clearSetForm();
}

function onEnterBtnClicked() {
    let form = document.forms["editForm"];
    let rounds = form.editRounds.value;
    if (isNaN(parseInt(rounds))) {
        rounds = "1"
    }
    if (form.repeatCheck.checked) {
        rounds = 1000000;
        roundsCount.innerHTML = "";
    }
    else {
        roundsCount.textContent = "Round: 1/" + rounds;
    }
    let newTime = createTime(form.editSec.value, form.editMin.value, form.restMin.value, form.restSec.value, rounds);
    if (validateInput(times[0])) {
        clearSetForm();
        startBtn.style.display = "inline";
        cancelBtn.style.display = "inline";
        setBtn.style.display = "none";
        formContentWrap.style.display = "none";
        contentWrapId.style.display = "block";
        window.scrollTo(0, 0);
    }
    else {
        clearTime();
    }
    
}

function onVolumeBtnClicked() {
    let volume = false;

    if (imgOn.style.display === "none") {
        imgOff.style.display = "none";
        imgOn.style.display = "block";
        volume = true;
    }
    else {
        imgOn.style.display = "none";
        imgOff.style.display = "block";
        volume = false;
    }
    saveAudio[0] = volume;
}

function onPauseBtnClicked() {
    if (pauseBtn.innerHTML == "Resume"){
        resumeTimer();
        pauseBtn.innerHTML = "Pause";
    }
    else {
        if (audio){
            audio.pause();
        }
        pauseBtn.innerHTML = "Resume";
        try {
            clearInterval(interval);
        }
        catch (err) {
        }
    }
}

function play() {
    audio = new Audio(
        'audio/mixkit-sport-start-bleeps-918.m4a');
    audio.play();
}

function validateInput(time) {
    let valid = true;
    climbMinError.innerText = "";
    climbSecError.innerText = "";
    restSecError.innerText = "";
    restMinError.innerText = "";
    
    if (isNaN(parseInt(time.climbMinutes))) {
        valid = false;
        climbMinError.innerHTML = "&#9888; Enter Minutes";
    }

    if (isNaN(parseInt(time.climbSeconds))) {
        valid = false;
        climbSecError.innerHTML = "&#9888; Enter Seconds";
    }

    if (isNaN(parseInt(time.restMinutes))) {
        valid = false;
        restMinError.innerHTML = "&#9888; Enter Minutes";
    }

    if (isNaN(parseInt(time.restSeconds))) {
        valid = false;
        restSecError.innerHTML = "&#9888; Enter Seconds"
    }

    return valid;
}


function clearSetForm() {
    document.querySelector("h1").innerText = "Interval Timer";
    timerBox.innerText= "00:00";

    let form = document.forms["editForm"];
    form.editMin.value = "";
    form.editSec.value = "";
    form.editRounds.value = "";
    form.restMin.value = "";
    form.restSec.value = "";
    form.repeatCheck.checked = false;
    form.customCheck.checked = false;
}

function clearButtons() {
    volumeBtn.style.display = "none";
    formContentWrap.style.display = "none";
    contentWrapId.style.display = "block";
    startBtn.onclick = onStartBtnClicked;
    startBtn.style.display = "none";
    startBtn.innerText = "Start";
    startBtn.id = "startBtn";
    cancelBtn.style.display = "none";
    setBtn.style.display = "inline";
    timerBox.style.borderColor= "black";
    dropDown.style.display = "none";

}

onPageLoad();
