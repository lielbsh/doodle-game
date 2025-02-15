import WebSocket from 'ws';

const activeGames = new Map<string, { player1: WebSocket; player2: WebSocket }>();

export const handleGameMessage = (ws: WebSocket, message: any) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'DRAWING') {
        sendToOpponent(ws, data);
    } else if (data.type === 'GUESS') {
        handleGuess(ws, data);
    }
};


const sendToOpponent = (ws: WebSocket, data: any) => {

}

const handleGuess = (ws: WebSocket, data: any) => {
    
}