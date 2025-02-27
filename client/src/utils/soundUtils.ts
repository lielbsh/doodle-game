
type SoundName = 'click' | 'timer' | 'endGame' | 'notification'| 'start'| 'sliding'; 

export const sounds: Record<SoundName, HTMLAudioElement> = {
  click: new Audio(`${process.env.PUBLIC_URL}/button-clicking-1.wav`),
  timer: new Audio(`${process.env.PUBLIC_URL}/Ticking Digital Clock.mp3`),
  notification: new Audio(`${process.env.PUBLIC_URL}mixkit-quick-win-video-game-notification-269.wav`),
  endGame : new Audio(`${process.env.PUBLIC_URL}mixkit-instant-win-2021.wav`),
  start: new Audio(`${process.env.PUBLIC_URL}mixkit-unlock-game-notification-253.wav`),
  sliding: new Audio(`${process.env.PUBLIC_URL}mixkit-sliding-wooden-light-door-1522.wav`)
};

export const playSound = (soundName: SoundName): void => {
  const sound = sounds[soundName];
  if (sound) {
    sound.play().catch((error) => {
      console.error(`Error playing sound ${soundName}:`, error);
    });
  } else {
    console.warn(`Sound ${soundName} not found`);
  }
};

export const stopSound = (soundName: SoundName): void => {
    const sound = sounds[soundName]
    sound.pause();
    sound.currentTime = 0;
};


export const stopAllSounds = (): void => {
  Object.values(sounds).forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
};
