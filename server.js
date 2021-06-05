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

const setsCardNumbers = { }
{
    let setsNames = fs.readdirSync(__dirname + '/graphics');
    for (let dirName of setsNames) {
        setsCardNumbers[dirName] = fs.readdirSync(__dirname + `/graphics/${dirName}`).length;
    }
    setsCardNumbers['random'] = Math.pow(8, 6);
}

const levels = [
    {
        name: 'FirstTry',
        description: 'Простой уровень с флагами',
        stars: '*',
        width: 4,
        height: 4,
        sets: [
            'flags'
        ]
    },
    {
        name: 'Second',
        description: 'Простой уровень с рандомными иконками',
        stars: '*',
        width: 4,
        height: 4,
        sets: [
            'random'
        ]
    },
    {
        name: 'Third',
        description: 'Сложный уровень с флагами, рандомом и животными',
        stars: '***',
        width: 10,
        height: 4,
        sets: [
            'random', 'flags', 'animals'
        ]
    }
]

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

function randomAvatar() {
    let total = setsCardNumbers['random'];
    return Math.floor(Math.random() * total + total).toString(8).substring(1);
}

function randomRandomCards(bag, count, s) {
    for (let i = 0; i < count; i++) {
        bag.push([s, randomAvatar()])
    }
}

function randomCards(cardSets, count) {
    let bag = [];

    for (let s of cardSets) {
        if (s === 'random')
        {
            randomRandomCards(bag, count, s);
            continue;
        }
        const max = setsCardNumbers[s];

        for (let i = 0; i < max; i++) {
            bag.push([s, i]);
        }
    }

    return shuffle(bag).slice(0, count);
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

function checkCardSets(cardSets) {
    let availableSets = Object.keys(setsCardNumbers).join(';');
    let errorMessage = `Wrong sets of cards.
    Example: &packName=on&
    Available: ${availableSets}`;

    if (cardSets.every(s => setsCardNumbers.hasOwnProperty(s))
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

function getValueFromFile(filepath) {
    return fs.readFileSync(filepath, function read(error, data) {
        if (error) {
            throw error;
        }
    }).toString('utf8');
}

let randomCardId = 0;
const size = 24;

const colors = require('./static/colors.json');
const svg = require('./static/shapes.json');

function outer(id, width) {
    return `<svg ${width ? `width="${width}" height="${width}" ` : ''}viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`
        + inner(id)
        + `</svg>`
}

function inner(value) {
    const clipA = `clip-a-${randomCardId}`
    const clipB = `clip-b-${randomCardId}`
    const urlA = `url(#${clipA})`
    const urlB = `url(#${clipB})`
    const half = size / 2

    ++randomCardId;

    return `<defs><clipPath id="${clipA}"><rect width="${half + 1}" height="${size}" x="0" y="0"></rect></clipPath>`
        + `<clipPath id="${clipB}"><rect width="${half}" height="${size}" x="${half}" y="0"></rect></clipPath></defs>`
        + `<g style="fill: ${colors.bg[value[1]][0]}" clip-path="${urlA}">${svg.body[value[0]]}</g>`
        + `<g style="fill: ${colors.bg[value[1]][1]}" clip-path="${urlB}">${svg.body[value[0]]}</g>`
        + `<g style="fill: ${colors.fg[value[1]][value[3]][0]}" clip-path="${urlA}">${svg.eyes[value[2]]}</g>`
        + `<g style="fill: ${colors.fg[value[1]][value[3]][1]}" clip-path="${urlB}">${svg.eyes[value[2]]}</g>`
        + `<g style="fill: ${colors.fg[value[1]][value[5]][0]}" clip-path="${urlA}">${svg.mouth[value[4]]}</g>`
        + `<g style="fill: ${colors.fg[value[1]][value[5]][1]}" clip-path="${urlB}">${svg.mouth[value[4]]}</g>`
}

function getSvg(dirName, cardIndex) {
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

    if (dirName === 'random') {
        return outer(cardIndex, 100);
    }

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
        cardSets.forEach(s => totalCardsNumber += setsCardNumbers[s]);

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
        cards: cards
    });
});

app.get('/levels', (_, res) => {
    res.render('levels', {
        layout: 'default',
        levels: levels
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
