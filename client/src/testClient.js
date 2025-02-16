const WebSocket = require('ws');

const player1 = new WebSocket("ws://localhost:8080");
const player2 = new WebSocket("ws://localhost:8080");

player1.on('open', () => {
    console.log('Player 1 connected');
    player1.send(JSON.stringify({ type: 'JOIN_GAME', playerId: 'player1' }));
});

player2.on('open', () => {
    console.log('Player 2 connected');
    setTimeout(() => {
        player2.send(JSON.stringify({ type: 'JOIN_GAME', playerId: 'player2' }));
    }, 1000);
});

player1.on('message', (data) => handleMessage(player1, data.toString(), "Player 1"));
player2.on('message', (data) => handleMessage(player2, data.toString(), "Player 2"));

player1.on('close', () => console.log('Player 1 disconnected'));
player2.on('close', () => console.log('Player 2 disconnected'));


function handleMessage(ws, message, player) {
    console.log(`${player} received:`, message);
    const data = JSON.parse(message);

    if (data.type === "START_GAME") {
        console.log(`${player} starts drawing word: ${data.word}`);

        // Simulate drawing submission after 5 seconds
        setTimeout(() => {
            console.log(`${player} submits drawing`);
            ws.send(JSON.stringify({ type: 'SUBMIT_DRAWING', drawing: `drawing-of-${data.word}` }));
        }, 5000);
    }

    if (data.type === "GUESSING_PHASE") {
        console.log(`${player} sees opponent's drawing: ${data.drawing}`);

        // Simulate guessing the word after 3 seconds
        setTimeout(() => {
            const guessedWord = Math.random() > 0.5 ? "flower" : "flower";
            console.log(`${player} submits guess: ${guessedWord}`);
            ws.send(JSON.stringify({ type: 'SUBMIT_GUESS', guess: guessedWord }));
        }, 3000);
    }
}
