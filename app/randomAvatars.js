const fs = require('fs');

const Colors = require('../static/colors.json');
const Svg = require('../static/shapes.json');
const Size = 24;

let randomCardId = 0;

function randomRandomCards(bag, count, s) {
    for (let i = 0; i < count; i++) {
        bag.push([s, randomAvatar()])
    }
}

function outer(id, width) {
    return `<svg ${width ? `width="${width}" height="${width}" ` : ''}viewBox="0 0 ${Size} ${Size}" xmlns="http://www.w3.org/2000/svg">`
        + inner(id)
        + `</svg>`
}

function inner(value) {
    const clipA = `clip-a-${randomCardId}`
    const clipB = `clip-b-${randomCardId}`
    const urlA = `url(#${clipA})`
    const urlB = `url(#${clipB})`
    const half = Size / 2

    ++randomCardId;

    return `<defs><clipPath id="${clipA}"><rect width="${half + 1}" height="${Size}" x="0" y="0"></rect></clipPath>`
        + `<clipPath id="${clipB}"><rect width="${half}" height="${Size}" x="${half}" y="0"></rect></clipPath></defs>`
        + `<g style="fill: ${Colors.bg[value[1]][0]}" clip-path="${urlA}">${Svg.body[value[0]]}</g>`
        + `<g style="fill: ${Colors.bg[value[1]][1]}" clip-path="${urlB}">${Svg.body[value[0]]}</g>`
        + `<g style="fill: ${Colors.fg[value[1]][value[3]][0]}" clip-path="${urlA}">${Svg.eyes[value[2]]}</g>`
        + `<g style="fill: ${Colors.fg[value[1]][value[3]][1]}" clip-path="${urlB}">${Svg.eyes[value[2]]}</g>`
        + `<g style="fill: ${Colors.fg[value[1]][value[5]][0]}" clip-path="${urlA}">${Svg.mouth[value[4]]}</g>`
        + `<g style="fill: ${Colors.fg[value[1]][value[5]][1]}" clip-path="${urlB}">${Svg.mouth[value[4]]}</g>`
}

function randomAvatar() {
    const total = Math.pow(8, 6);
    return Math.floor(Math.random() * total + total).toString(8).substring(1);
}

module.exports = { outer, randomRandomCards }