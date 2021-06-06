import SpeedRate from './SpeedRate.js';

class TimerClass {
    constructor() {
        this._timerNode = document.querySelector('.timer').childNodes[0];
        this._tick = this._createTickFunction();
        this.stopFlag = false;
    }

    getTime() {
        return parseInt(this._timerNode.nodeValue);
    }

    start() {
        this.stopFlag = false;

        let timerClass = this;
        let timer = function() {
            if (timerClass.stopFlag) return;
            timerClass._tick();
            setTimeout(timer, 1000 / SpeedRate.coefficient);
        }
        timer();
    }

    stop() {
        this.stopFlag = true;
    }

    getElapsedTime() {
        return parseInt(this._timerNode.nodeValue);
    }

    _createTickFunction() {
        let timerNode = this._timerNode;
        let sec = parseInt(timerNode.nodeValue);
        return function() {
            if (sec === 0) {
                this.stopFlag = true;
            }
            if (!this.stopFlag)
                timerNode.nodeValue = (--sec).toString();
        }
    }
}

const Timer = new TimerClass();

export default Timer;