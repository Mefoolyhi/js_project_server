class SpeedRateClass {
    constructor() {
        this._speedRate = 1;
    }

    set coefficient(value) {
        if (value <= 0) {
            throw new Error("Incorrect speed rate value!");
        } else {
            this._speedRate = value;
        }
    }

    get coefficient() {
        return this._speedRate;
    }
}

const SpeedRate = new SpeedRateClass();

export default SpeedRate;