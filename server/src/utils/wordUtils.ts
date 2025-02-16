
const wordsForGame =  { 
    easy: [
        'apple',
        'car',
        'tree',
        'flower',
        'sun',
        'moon',
        'chair',
        'dog',
        'house',
        'cat',
        'pencil',
        'computer',
        'school',
        'banana',
        'window',
        'beach',
        'table',
        'mountain',
        'rainbow',
        'clock',
        
    ],
    medium: [
        'microscope',
        'skyscraper',
        'helicopter',
        'volcano',
        'astronaut',
        'dinosaur',
        'penguin',
        'bicycle',
        'laboratory',
    ],
    hard: [
        'microscope',
        'skyscraper',
        'helicopter',
        'volcano',
        'astronaut',
        'dinosaur',
        'penguin',
        'bicycle',
        'laboratory',
    ],
};

export const getRandomWords = (round: number, difficulty: keyof typeof wordsForGame ): [string,string] => {
    const words = wordsForGame[difficulty];
    const word1 = words[Math.floor((Math.random() * words.length))]
    const word2 = words[Math.floor((Math.random() * words.length))]
    return [word1,word2];
};



