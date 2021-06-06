const Levels = require('./app/levels.js');
const { shuffle, validateInt, sendError, getSvg, SetsCardNumbers, randomCards, randomGame } = require('./app/utils.js');

const express = require('express');
const path = require('path');
const app = module.exports = express();
const { Client } = require('pg');
const cors = require('cors');
const rootDir = process.cwd();

const hbs = require('express-handlebars');


app.set("view engine", "hbs");

app.engine(
"hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "/views/layouts/"),
        partialsDir: path.join(rootDir, "/views/partials/"),
    })
);
app.use(cors());
app.options('*', cors());

app.use('/static', express.static('static'))

function checkCardSets(cardSets) {
    let availableSets = Object.keys(SetsCardNumbers).join(';');
    let errorMessage = `Wrong sets of cards.
    Example: &packName=on&
    Available: ${availableSets}`;

    if (cardSets.every(s => SetsCardNumbers.hasOwnProperty(s))
        && cardSets.length > 0)
        return [false, ""];

    return [true, errorMessage];
}

function checkFieldSize(cardsNumber, totalCardsNumber) {
    if (isNaN(cardsNumber)) {
        return [true, 'Wrong size!'];
    }

    if (cardsNumber % 2 === 1) {
        return [true, 'Wrong size! Should be even number of cards'];
    }

    if (cardsNumber / 2 > totalCardsNumber) {
        return [true, `Wrong size! Too big! Max = ${2 * totalCardsNumber}`];
    }

    return [false, ''];
}

app.get('/test', function (req, res) {
    console.log('rendered1');
    res.render('client', {
        layout: 'default'
    });
    console.log('rendered2');
});

app.get('/', (_, res) => {
    res.render('client', {
        layout: 'default'
    });
});

app.get('/create', (_, res) => {
    res.render('levelCreation', {
        layout: 'default'
    });
});

app.get('/game', (req, res) => {
    const width = validateInt(req.query.w);
    const height = validateInt(req.query.h);

    const cardSets = Object.keys(req.query)
        .filter(key => req.query[key] === "on");

    const cardsNumber = width * height;
    const pairsNumber = cardsNumber / 2;

    let [isError, errorMessage] = checkCardSets(cardSets);
    if (!isError) {
        let totalCardsNumber = 0;
        cardSets.forEach(s => totalCardsNumber += SetsCardNumbers[s]);

        [isError, errorMessage] = checkFieldSize(cardsNumber, totalCardsNumber);
    }

    if (isError) {
        sendError(res, 400, errorMessage);
        return;
    }

    let pairIndexes = randomCards(cardSets, pairsNumber);
    let cardIndexes = shuffle(pairIndexes.concat(pairIndexes));

    let cards = []
    for (let [dirName, cardIndex] of cardIndexes) {
        cards.push({
            dirName: dirName,
            cardIndex: cardIndex,
            svg: getSvg(dirName, cardIndex)
        });
    }

    res.render('game', {
        layout: 'default',
        width: width,
        height: height,
        timer: width * height * 3,
        cards: cards,
        title: 'Бобик сдох',
        content: 'Вы либо открыли все карточки, либо время вышло. В любом случае игра окончена. ' +
            'Напиши свое имя ниже для записи рекорда или все пойдет мне в карман',
        button_cancel_text: 'Лено4ка',
        button_ok_text: 'Запиши рекорд с моим именем'

    });
});

app.use(express.json());
app.post('/', function(request, response){
     let client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    client.connect();
    client.query(`insert into public.leaderboard (name, score, time, width, height) values
    ('${request.body.name}', ${request.body.score}, ${request.body.time}, ${request.body.width}, ${request.body.height}) 
     on conflict (name) do update set score = ${request.body.score},
     time = ${request.body.time}, width = ${request.body.width}, height = ${request.body.height};`,
        (err, _) => {
        if (err) throw err;
        client.end();
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('post received');
});

app.get('/random', (_, res) => {
    let [w, h, sets] = randomGame(10, 6);

    let url = `/game?h=${h}&w=${w}`;

    for (let s of sets) {
        url += `&${s}=on`;
    }

    res.redirect(url);
});

app.get('/levels', (_, res) => {
    res.render('levels', {
        layout: 'default',
        levels: Levels
    });
});

app.get('/leaders', (_, response) => {
    let client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    client.connect();
    client.query('SELECT name, score, time, to_char(date, \'DD Mon YYYY\') FROM public.leaderboard order by score desc, time desc limit 10;', (err, res) => {
        if (err) throw err;
        response.render('leaderboard', {
            layout: 'default',
            leaderboard: res.rows
        });
        console.log(res.rows);
        client.end();
    });
});

if (require.main === module) {
    app.listen(process.env.PORT || 5000);
    console.log(`Express started on port ${process.env.PORT || 5000}`);
}
