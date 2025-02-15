class DrawingClass {
    id?: number;
    strokes: { x: number, y: number }[] = [];
    player_id: string;
    game_id: number;
    created_at: Date;
    word: string;
  
    constructor(player_id: string, game_id: number, word: string) {
      this.player_id = player_id;
      this.game_id = game_id;
      this.created_at = new Date();
      this.word = word;
    }
  
    // Add a new stroke to the drawing
    addStroke(x: number, y: number): void {
        this.strokes.push({ x, y });
      }
  
      // Mark the drawing as finished and send it to the backend
    setDrawing(): void {
        const drawingData = JSON.stringify(this.strokes);  
        const drawingPayload = {
            playerId: this.player_id,
            drawingData,
            word: this.word
        };
    
        // WebSocket communication 
        console.log("Sending drawing data to server", drawingPayload);
        // WebSocket.send(drawingPayload);  // Send this data to your backend
    }
  
    // Clear all strokes (e.g., if the user wants to start over)
    clearDrawing(): void {
      this.strokes = [];
    }
}
  