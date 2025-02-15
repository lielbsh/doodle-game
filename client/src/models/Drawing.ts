class DrawingClass {
    id?: number;
    strokes: { x: number, y: number }[] = [];
    player_id: string;
    game_id: number;
    created_at: Date;
  
    constructor(player_id: string, game_id: number) {
      this.player_id = player_id;
      this.game_id = game_id;
      this.created_at = new Date();
    }
  
    // Add a new stroke to the drawing
    addStroke(x: number, y: number): void {
        this.strokes.push({ x, y });
      }
  
    // Mark the drawing as finished
    setDrawing(): void {
      // send it to the server.
      console.log("Drawing finished", this);
    }
  
    // Clear all strokes (e.g., if the user wants to start over)
    clearDrawing(): void {
      this.strokes = [];
    }
  }
  