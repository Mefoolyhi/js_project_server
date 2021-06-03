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

const cors = require('cors');
app.use(cors());
app.options('*', cors());

const TotalCardsNumber = 263;
const BackCardIcon = getValueFromFile('./backCardIcon.svg');

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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)); //Максимум не включается, минимум включается
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
    return getValueFromFile(`./graphics/${dirName}/${filename}`)
}

function createCard(dirIndex, cardIndex) {
    let svg = getSvg(dirIndex, cardIndex);
    return `<div class="card" data-card-index=${dirIndex}_${cardIndex}>`
        + `<div class="front_card">${svg}</div>`
        + `<div class="back_card">${BackCardIcon}</div></div>`;
}

app.get('/test', function (req, res, next) {
    let svg = getSvg(0, 0);
    console.log(svg)
})

function relateIndexToDirectory() {

}

app.get('/field', function(req, res, next) {
    const width = validateInt(req.query.width);
    const height = validateInt(req.query.height);
    const cardsNumber = width * height;
    const pairsNumber = cardsNumber / 2;

    const [isError, errorMessage] = checkFieldSize(res, cardsNumber);
    if (isError) {
        sendError(res, 400, errorMessage);
        return;
    }

    let pairIndexes = randomUniqueNumbers(TotalCardsNumber, pairsNumber/*, ...*/);
    let cardIndexes = shuffle(pairIndexes.concat(pairIndexes));
    console.log(cardIndexes);

    let cards = []
    cardIndexes.forEach(i => cards.push(createCard(0, i)));

    res.send(cards.join('\n'));
});

if (require.main === module) {
    app.listen(3000);
    console.log('Express started on port 3000');
}