import Timer from './Timer.js';
import SpeedRate from './SpeedRate.js';

class ScoreCounterClass {
    constructor() {
        this._scoreNode = document.querySelector('.score_counter').childNodes[0];
        this._previousTime = Timer.getElapsedTime();
    }
    counter = 0;
    updateScore(isSuccessful) {
        let time = Timer.getElapsedTime();
        if (isSuccessful) {
            let delta = 10 + Math.max(0,
                Math.ceil((20 - time + this._previousTime) * SpeedRate.coefficient * (this.counter + 1)));
            this._scoreNode.nodeValue = `${parseInt(this._scoreNode.nodeValue) + delta}`;
            this.counter++;
        } else {
            this._scoreNode.nodeValue = `${Math.max(0, parseInt(this._scoreNode.nodeValue) - 2)}`;
            this.counter = 0;
        }
        this._previousTime = time;
    }
}

const ScoreCounter = new ScoreCounterClass()

export default ScoreCounter;