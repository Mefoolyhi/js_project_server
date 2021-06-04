import Timer from './Timer.js';
import SpeedRate from './SpeedRate.js';

class ScoreCounterClass {
    constructor() {
        this._scoreNode = document.querySelector('.score_counter').childNodes[0];
        this._previousTime = Timer.getElapsedTime();
    }

    updateScore(isSuccessful) {
        let time = Timer.getElapsedTime();
        if (isSuccessful) {
            let delta = Math.max(1, Math.ceil((20 - time + this._previousTime) / SpeedRate.coefficient));
            this._scoreNode.nodeValue = `${parseInt(this._scoreNode.nodeValue) + delta}`
        } else {
            this._scoreNode.nodeValue = `${Math.max(0, parseInt(this._scoreNode.nodeValue) - 2)}`
        }
        this._previousTime = time;
    }

    clear() {
        this._scoreNode.nodeValue = '0';
    }
}

const ScoreCounter = new ScoreCounterClass()

export default ScoreCounter;