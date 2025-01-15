import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as PlayerActions from '../../../core/state/player/player.actions';
import * as PlayerSelectors from '../../../core/state/player/player.selectors';
import { PlayerStatus } from '../../../core/models/player-state.model';
import { take } from 'rxjs/operators';
import { AudioService } from '../../../core/services/audio.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="player">
      <div class="controls">
        <button (click)="play()" [disabled]="!(currentTrackId$ | async)">Play</button>
        <button (click)="pause()">Pause</button>
        <button (click)="stop()">Stop</button>
      </div>
      <div class="info">
        <span>Status: {{ status$ | async }}</span>
        <span>Current Time: {{ currentTime$ | async | date:'mm:ss' }}</span>
        <span>Duration: {{ duration$ | async | date:'mm:ss' }}</span>
        <input type="range" 
               [min]="0" 
               [max]="(duration$ | async) || 0" 
               [value]="currentTime$ | async" 
               (input)="onSeek($event)">
        <input type="range" 
               [min]="0" 
               [max]="1" 
               [step]="0.01" 
               [value]="(volume$ | async) || 0" 
               (input)="setVolume($event)">
      </div>
    </div>
  `,
  styles: [`
    .player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #f0f0f0;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    }
    .controls, .info {
      display: flex;
      gap: 10px;
    }
  `]
})
export class PlayerComponent {
  status$: Observable<PlayerStatus>;
  currentTrackId$: Observable<string | null>;
  volume$: Observable<number>;
  currentTime$: Observable<number>;
  duration$: Observable<number>;

  constructor(private store: Store, private audioService: AudioService) {
    this.status$ = this.store.select(PlayerSelectors.selectPlayerStatus);
    this.currentTrackId$ = this.store.select(PlayerSelectors.selectCurrentTrackId);
    this.volume$ = this.store.select(PlayerSelectors.selectPlayerVolume);
    this.currentTime$ = this.audioService.getCurrentTime();
    this.duration$ = this.audioService.getDuration();
  }

  play() {
    this.currentTrackId$.pipe(take(1)).subscribe(trackId => {
      if (trackId) {
        this.audioService.play(trackId);
      }
    });
  }

  pause() {
    this.store.dispatch(PlayerActions.pause());
  }

  stop() {
    this.store.dispatch(PlayerActions.stop());
  }

  setVolume(event: Event) {
    const volume = +(event.target as HTMLInputElement).value;
    this.audioService.setVolume(volume);
  }

  onSeek(event: Event) {
    const seekTime = +(event.target as HTMLInputElement).value;
    this.audioService.seek(seekTime);
  }
}

