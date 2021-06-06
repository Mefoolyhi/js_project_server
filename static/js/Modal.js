class ModalClass {

    constructor() {
        this._modal = document.querySelector('.modal');
    }

    show() {
        this._modal.style.opacity = 1;
        this._modal.style.pointerEvents = 'auto';
        this._modal.style.overflowY = 'auto';

    }

    hide() {
        this._modal.style.opacity = 0;
        this._modal.style.pointerEvents = 'none';
        this._modal.style.overflowY = 'none';
    }
}

const Modal = new ModalClass()

export default Modal;