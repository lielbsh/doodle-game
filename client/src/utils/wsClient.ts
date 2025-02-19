import { Player } from "../models/Player";

const WS_URL = "ws://localhost:8080";

class WebSocketClient {
    private socket: WebSocket | null = null;
  
    connect(player: Player, onMessage: (data: any) => void) {
      this.socket = new WebSocket(WS_URL);
  
      this.socket.onopen = () => {
        console.log("Connected to WebSocket server");
        this.sendJoinGameMessage(player);
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);
        onMessage(data);
      };
  
      this.socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };
    }
  
    sendMessage(message: any) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      }
    }
  
    sendJoinGameMessage(player: Player) {
      this.sendMessage({
        type: "JOIN_GAME",
        playerId: player.id,
        playerName: player.name,
      });
    }
  
    sendDrawingMessage(drawing: string) {
      this.sendMessage({
        type: "SUBMIT_DRAWING",
        drawing: drawing,
      });
    }
  
    sendGuessMessage(guessedWord: string) {
      this.sendMessage({
        type: "SUBMIT_GUESS",
        guess: guessedWord,
      });
    }
  
    sendGameOverMessage(score: number) {
      this.sendMessage({
        type: "GAME_OVER",
        score: score,
      });
    }
  
    close() {
      if (this.socket) {
        this.socket.close();
      }
    }
}
  
export default new WebSocketClient();
  