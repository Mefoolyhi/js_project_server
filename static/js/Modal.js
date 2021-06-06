class ModalClass {

    constructor() {
        this._modal = document.querySelector('.modal');
        this._modal.querySelector('.btn__cancel')
            .addEventListener('click', this.sendResult('Лено4ка'));
        console.log(document.getElementById('name').value);
        this._modal.querySelector('.btn__ok')
            .addEventListener('click', this.sendResult(document.getElementById('name').value));

    }

    async sendResult(name) {
        if (name === undefined || name === "")
            document.getElementById('name').style.borderColor = 'red';
        else
        {
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
            this._modal.style.opacity = 0;
            this._modal.style.pointerEvents = 'none';
            this._modal.style.overflowY = 'none';
        }
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