import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuizMusicService {
  private audio: HTMLAudioElement;
  constructor() {
    this.audio = new Audio();
  }

  playMusic() {
    const musicPath = 'assets/music/popcorn.mp3';
    this.audio.src = musicPath;
    this.audio.load();
    this.audio.loop = true;
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
  }
}
