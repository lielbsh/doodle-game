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
    }, 5000); 
});

player1.on('message', (data) => {
    console.log('Player 1 received:', data.toString());
});

player2.on('message', (data) => {
    console.log('Player 2 received:', data.toString());
});


player1.on('close', () => console.log('Player 1 disconnected'));
player2.on('close', () => console.log('Player 2 disconnected'));
