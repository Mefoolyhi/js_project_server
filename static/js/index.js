import Game from './Game.js'
import Timer from './Timer.js'

const game = new Game();
await game.create();

Timer.start(game);


// TODO: Генерация карточек автоматически
// TODO: Нормальная генерация поля (чтобы можно было растягивать адекватно и под мобилки заходило)
