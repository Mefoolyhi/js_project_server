/**
 * Module dependencies.
 */

/*
 * [размеры поля (10 х 6)]
 * [набор карточек]
 * [номера карточек]
*/

const express = require('express');
const path = require('path');
const app = module.exports = express();
const fs = require('fs');
const { Client } = require('pg');
const rootDir = process.cwd();
const hbs = require('express-handlebars');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

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

const cors = require('cors');
app.use(cors());
app.options('*', cors());

app.use('/static', express.static('static'))

const TotalCardsNumber = 263;

function sendError(res, status, message) {
    res.status = status;
    res.send(message);
}

function validateInt(number) {
    const n = parseInt(number);
    if (isNaN(n) || n <= 0) {
        return NaN;
    } else {
        return n;
    }
}

function randomUniqueNumbers(max, count) {
    let bag = [];
    for (let i = 0; i < max; i++) {
        bag.push(i);
    }

    return shuffle(bag).slice(0, count);
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function checkFieldSize(res, cardsNumber) {
    if (isNaN(cardsNumber)) {
        return [true, 'Wrong size!'];
    }

    if (cardsNumber % 2 === 1) {
        return [true, 'Wrong size! Should be even number of cards'];
    }

    if (cardsNumber / 2 > TotalCardsNumber) {
        return [true, 'Wrong size! Too big!'];
    }

    return [false, ''];
}

function getValueFromFile(filepath) {
    return fs.readFileSync(filepath, function read(error, data) {
        if (error) {
            throw error;
        }
    }).toString('utf8');
}

function getSvg(dirIndex, cardIndex) {
    //const dirIndex = parseIndexToDirectory(cardIndex);
    // let svg = null;
    // return fs.readdir(__dirname + '/graphics', async (err, files) => {
    //     if (err) {
    //         throw err;
    //     }
    //     return fs.readdir(__dirname + `/graphics/${files[dirIndex]}`, (err, files) => {
    //         if (err) {
    //             throw err;
    //         }
    //         //svg = files[cardIndex];
    //         return files[cardIndex];
    //     });
    // });

    const dirName = fs.readdirSync(__dirname + '/graphics')[dirIndex];
    const filename = fs.readdirSync(__dirname + `/graphics/${dirName}`)[cardIndex];
    return getValueFromFile(`./graphics/${dirName}/${filename}`);
}

app.get('/test', function (req, res, next) {
    console.log('rendered1');
    res.render('client', {
        layout: 'default'
    });
    console.log('rendered2');
});

function relateIndexToDirectory() {

}

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
    const cardsNumber = width * height;
    const pairsNumber = cardsNumber / 2;

    const [isError, errorMessage] = checkFieldSize(res, cardsNumber);
    if (isError) {
        sendError(res, 400, errorMessage);
        return;
    }

    let pairIndexes = randomUniqueNumbers(TotalCardsNumber, pairsNumber/*, ...*/);
    let cardIndexes = shuffle(pairIndexes.concat(pairIndexes));

    let cards = []
    cardIndexes.forEach(i => cards.push({
        dirIndex: 1,
        cardIndex: i,
        svg: getSvg(1, i)
    }))

    res.render('game', {
        layout: 'default',
        width: width,
        height: height,
        cards: cards
    });
});

app.get('/leaders', function (req, res, next){
    client.connect();
    client.query('SELECT * FROM leaderboard order by score asc, time desc limit 10;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        client.end();
    });
});

if (require.main === module) {
    app.listen(process.env.PORT || 5000);
    console.log(`Express started on port ${process.env.PORT || 5000}`);
}
