import { stopAllSounds, stopSound } from "../utils/soundUtils";

export class Timer {
    private time: number;
    private intervalId: NodeJS.Timeout | null = null;
    private timeUpCallback: () => void
  
    constructor(initialTime: number, timeUpCallback: () => void) {
      this.time = initialTime;
      this.timeUpCallback = timeUpCallback;
    }
  
    start(callback: (timeLeft: number) => void) {
      this.intervalId = setInterval(() => {
        if (this.time > 0) {
          this.time -= 1;
          callback(this.time);
        } else {
          this.stop();
          this.timeUpCallback();
        }
      }, 1000);
    }
  
    stop() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        stopSound('timer');
      }
    }
  
    reset(time: number) {
      this.time = time;
    }
  
    getTime() {
      return this.time;
    }   
}

  