import { Player } from "../models/Player";

const WS_URL = "ws://localhost:8080";

class WebSocketClient {
  private socket: WebSocket | null = null;

  connect(player: Player, onMessage: (data: any) => void) {
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
      this.sendMessage({ type: "JOIN_GAME", playerId: player.id, playerName: player.name });
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

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default new WebSocketClient();
