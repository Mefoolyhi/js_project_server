class CardsHolder {
    constructor() {
        this._cardsHolder = document.querySelector('.cards_holder');
        this._cards = []
    }

    async fill() {

        this._cards = Array.from(this._cardsHolder.children);
    }

    get cards() {
        return this._cards;
    }
}

export default CardsHolder;