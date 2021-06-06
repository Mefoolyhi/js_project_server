const fs = require('fs');
const { outer, randomRandomCards } = require('./randomAvatars.js');


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

function validateInt(number) {
    const n = parseInt(number);
    if (isNaN(n) || n <= 0) {
        return NaN;
    } else {
        return n;
    }
}

function sendError(res, status, message) {
    res.status = status;
    res.send(message);
}

function getValueFromFile(filepath) {
    return fs.readFileSync(filepath, function read(error, _) {
        if (error) {
            throw error;
        }
    }).toString('utf8');
}

function getSvg(dirName, cardIndex) {
    if (dirName === 'random') {
        return outer(cardIndex, 100);
    }

    const filename = fs.readdirSync(__dirname + `/../graphics/${dirName}`)[cardIndex];
    return getValueFromFile(`./graphics/${dirName}/${filename}`);
}

const SetsCardNumbers = { }
{
    let setsNames = fs.readdirSync(__dirname + `/../graphics`);
    for (let dirName of setsNames) {
        SetsCardNumbers[dirName] = fs.readdirSync(__dirname + `/../graphics/${dirName}`).length;
    }
    SetsCardNumbers['random'] = Math.pow(8, 6);
}

function randomCards(cardSets, count) {
    let bag = [];

    for (let s of cardSets) {
        if (s === 'random')
        {
            randomRandomCards(bag, count, s);
            continue;
        }
        const max = SetsCardNumbers[s];
        let slice = [];

        for (let i = 0; i < max; i++) {
            slice.push([s, i]);
        }

        for (let item of shuffle(slice).slice(0, count)) {
            bag.push(item);
        }
    }

    return shuffle(bag).slice(0, count);
}

module.exports = { shuffle, validateInt, sendError, getSvg, SetsCardNumbers, randomCards };
