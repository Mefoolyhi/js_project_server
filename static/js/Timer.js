import SpeedRate from './SpeedRate.js';

class TimerClass {
    constructor() {
        this._timerNode = document.querySelector('.timer').childNodes[0];
        this._tick = this._createTickFunction();
        this._stopFlag = false;
    }

    start() {
        this._stopFlag = false;

        let timerClass = this;
        let timer = function() {
            if (timerClass._stopFlag) return;
            timerClass._tick();
            setTimeout(timer, 1000 / SpeedRate.coefficient);
        }
        timer();
    }

    clear() {
        this._timerNode.nodeValue = '300';
        this._tick = this._createTickFunction();
    }

    stop() {
        this._stopFlag = true;
    }

    getElapsedTime() {
        return parseInt(this._timerNode.nodeValue);
    }

    _createTickFunction() {
        let timerNode = this._timerNode;
        let sec = parseInt(timerNode.nodeValue);
        return function() {
            if (sec === 0)
                stop();
            timerNode.nodeValue = (--sec).toString();
        }
    }
}

const Timer = new TimerClass();

export default Timer;