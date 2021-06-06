class ModalClass {

    constructor() {
        this._modal = document.querySelector('.modal');
        this._modal.querySelector('.btn__cancel')
            .addEventListener('click', this._sendResult.bind(this, "Лено4ка"));
        console.log(document.getElementById('name').value);
        this._modal.querySelector('.btn__ok')
            .addEventListener('click', this._checkName.bind(this));
    }

    async _checkName() {
        let name = document.getElementById('name').value;
        if (name === undefined || name === "")
            document.getElementById('name').style.borderColor = 'red';
        else
            await this._sendResult(name);
    }

    async _sendResult(name) {

        this._modal.style.opacity = 0;
        this._modal.style.pointerEvents = 'none';
        this._modal.style.overflowY = 'none';
            await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        name: name,
                        score: this._score,
                        time: this._time,
                        width: this._width,
                        height: this._height
                })
            });

    }

    show(score, time, width, height) {
        this._modal.style.opacity = 1;
        this._modal.style.pointerEvents = 'auto';
        this._modal.style.overflowY = 'auto';

        this._score = score;
        this._time = time;
        this._width = width;
        this._height = height;
    }
}

const Modal = new ModalClass();

export default Modal;