"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomWords = void 0;
const wordsForGame = {
    easy: [
        'apple',
        'tree',
        'flower',
        'sun',
        'moon',
        'chair',
        'dog',
        'house',
        'cat',
        'pencil',
        'Fish',
        'banana',
        'window',
        'table',
        'mountain',
        'rainbow',
        'clock',
        'Ice cream',
        'Butterfly',
        'Cloud ',
        'umbrella',
        'Cloud',
        'Ball',
        'Snake',
        'Robot',
        'Hat',
    ],
    medium: [
        'Watermelon',
        'skyscraper',
        'volcano',
        'school',
        'astronaut',
        'dinosaur',
        'penguin',
        'bicycle',
        'Guitar ',
        'Castle',
        'Rocket',
        'car',
        'Boat',
        'computer',
        'swings',
        'Roller coaster',
        'hot air ballon',
        'snail',
        'beach',
        'Bunny',
        'coffe',
        'Giraffe',
        'Bridge',
        'Candle',
        'Ladder',
        'Compass',
        'Key',
        'Snowman',
    ],
    hard: [
        'helicopter',
        'volcano',
        'astronaut',
        'dinosaur',
        'penguin',
        'bicycle',
        'Octopus',
        'Unicorn',
        'Spaceship',
        'Dragon',
        'Lighthouse',
        'squirrel',
        'tiger',
        'truck',
        'Alien',
        'microscope',
        'bear',
        'Submarine',
        'Ferris wheel',
        'horse',
    ],
};
const getRandomWords = (round) => {
    const difficulties = ['easy', 'medium', 'hard'];
    const difficulty = difficulties[round - 1];
    const words = wordsForGame[difficulty];
    const word1 = words[Math.floor((Math.random() * words.length))];
    let word2 = word1;
    while (word2 === word1) {
        word2 = words[Math.floor(Math.random() * words.length)];
    }
    return [word1, word2];
};
exports.getRandomWords = getRandomWords;
