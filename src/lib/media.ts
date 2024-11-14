// src/lib/media.ts
'use client';
export const SOUND_EFFECTS = {
  CARD_PLAY: '/sounds/card-play.mp3',
  CARD_DRAW: '/sounds/card-draw.mp3',
  RESOURCE_GAIN: '/sounds/resource-gain.mp3',
  COMBAT_START: '/sounds/combat-start.mp3',
  COMBAT_HIT: '/sounds/combat-hit.mp3',
  UPGRADE_COMPLETE: '/sounds/upgrade-complete.mp3',
  ROUND_START: '/sounds/round-start.mp3',
  ROUND_END: '/sounds/round-end.mp3',
  ERROR: '/sounds/error.mp3'
} as const;

export const GAME_VIDEOS = {
  INTRO: '/videos/intro.mp4',
  ROUND_START: '/videos/round-start.mp4',
  ROUND_END: '/videos/round-end.mp4',
  VICTORY: '/videos/victory.mp4',
  DEFEAT: '/videos/defeat.mp4'
} as const;

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor() {
    // Preload sounds
    Object.entries(SOUND_EFFECTS).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  play(soundKey: keyof typeof SOUND_EFFECTS) {
    if (this.isMuted) return;

    const sound = this.sounds.get(soundKey);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Sound play failed:', e));
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }
}

export const soundManager = new SoundManager();
