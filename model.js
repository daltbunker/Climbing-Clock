
let times = []
let saveAudio = ["true"]

function Time(
    climbSeconds,
    climbMinutes,
    restMinutes,
    restSeconds,
    rounds
) {
    this.climbSeconds = climbSeconds;
    this.climbMinutes = climbMinutes;
    this.restMinutes = restMinutes;
    this.restSeconds = restSeconds;
    this.rounds = rounds;
    this.roundComplete= 1;
}

function createTime(
    climbSeconds,
    climbMinutes,
    restMinutes,
    restSeconds,
    rounds
) {
    var newTime = new Time(climbSeconds, climbMinutes, restMinutes, restSeconds, rounds)
    times.push(newTime);
    return newTime
}

function getTime() {
    return parseInt(times[0].climbSeconds) + parseInt(times[0].climbMinutes) * 60;
}

function getRest() {
    return parseInt(times[0].restSeconds) + parseInt(times[0].restMinutes) * 60;
}

function getRounds() {
    return parseInt(times[0].rounds);
}

function clearTime() {
    times = [];
}
