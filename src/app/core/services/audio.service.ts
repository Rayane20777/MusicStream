import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerStatus } from '../models/player-state.model';
import { IndexedDBService } from './indexeddb.service'; // Import the service


@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioElement: HTMLAudioElement;
  private statusSubject = new BehaviorSubject<PlayerStatus>('stopped');
  private currentTimeSubject = new BehaviorSubject<number>(0); // Track current time
  private durationSubject = new BehaviorSubject<number>(0); // Track duration

  constructor(private indexedDBService: IndexedDBService) { // Inject the service
    this.audioElement = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    this.audioElement.addEventListener('playing', () => {
      this.statusSubject.next('playing');
      this.durationSubject.next(this.audioElement.duration); // Set duration when playing
      this.updateCurrentTime(); // Start updating current time
    });
    this.audioElement.addEventListener('pause', () => this.statusSubject.next('paused'));
    this.audioElement.addEventListener('waiting', () => this.statusSubject.next('buffering'));
    this.audioElement.addEventListener('ended', () => {
      this.statusSubject.next('stopped');
      this.currentTimeSubject.next(0); // Reset current time when ended
    });
  }

  private updateCurrentTime(): void {
    setInterval(() => {
      if (this.audioElement.paused) return; // Stop updating if paused
      this.currentTimeSubject.next(this.audioElement.currentTime);
    }, 1000); // Update every second
  }

  getCurrentTime(): Observable<number> {
    return this.currentTimeSubject.asObservable();
  }

  getDuration(): Observable<number> {
    return this.durationSubject.asObservable();
  }

  play(trackId: string): void {
    this.indexedDBService.getAudioBlob(trackId).subscribe(audioBlob => {
        if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            this.audioElement.src = audioUrl;
            this.audioElement.play();
        } else {
            console.error('Audio blob not found for track ID:', trackId);
        }
    });
}

  pause(): void {
    this.audioElement.pause();
  }

  stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  setVolume(volume: number): void {
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  getStatus(): Observable<PlayerStatus> {
    return this.statusSubject.asObservable();
  }

  seek(time: number): void {
    this.audioElement.currentTime = time;
  }
}

