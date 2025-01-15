import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Track } from '../../../core/models/track.model';
import * as TracksActions from '../../../core/state/tracks/tracks.actions';
import * as TracksSelectors from '../../../core/state/tracks/tracks.selectors';
import * as PlayerActions from '../../../core/state/player/player.actions';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="library-container">
      <header class="library-header">
        <h1>Music Library</h1>
        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search tracks..."
            class="search-input"
          >
        </div>
      </header>

      <div class="tracks-container">
        <div *ngIf="loading$ | async" class="loading">
          Loading tracks...
        </div>

        <div *ngIf="!(loading$ | async) && (tracks$ | async)?.length === 0" class="empty-state">
          No tracks available. Add some music to get started!
        </div>

        <div class="tracks-list" *ngIf="tracks$ | async as tracks">
          <div
            *ngFor="let track of tracks"
            class="track-item"
            [class.active]="(currentTrackId$ | async) === track.id"
          >
            <div class="track-info" [routerLink]="['/track', track.id]">
              <div class="track-image">
                <img [src]="track.coverImage || '/assets/default-album.png'" alt="Album cover">
              </div>
              <div class="track-details">
                <h3>{{ track.title }}</h3>
                <p>{{ track.artist }}</p>
                <span class="track-category">{{ track.category }}</span>
              </div>
            </div>
            <div class="track-actions">
              <span class="track-duration">{{ track.duration | date:'mm:ss' }}</span>
              <button
                (click)="playTrack(track)"
                [class.playing]="(currentTrackId$ | async) === track.id"
                class="play-button"
              >
                {{ (currentTrackId$ | async) === track.id ? 'Playing' : 'Play' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .library-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .library-header {
      margin-bottom: 30px;
    }

    .library-header h1 {
      font-size: 2rem;
      margin-bottom: 20px;
    }

    .search-bar {
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }

    .tracks-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .loading, .empty-state {
      padding: 40px;
      text-align: center;
      color: #666;
    }

    .tracks-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: #f5f5f5;
    }

    .track-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: white;
      transition: background-color 0.2s;
    }

    .track-item:hover {
      background: #f8f8f8;
    }

    .track-item.active {
      background: #f0f7ff;
    }

    .track-info {
      display: flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
    }

    .track-image {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      overflow: hidden;
    }

    .track-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .track-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .track-details h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .track-details p {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
    }

    .track-category {
      font-size: 0.8rem;
      color: #666;
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .track-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .track-duration {
      color: #666;
      font-size: 0.9rem;
    }

    .play-button {
      padding: 6px 16px;
      border: none;
      border-radius: 4px;
      background: #4CAF50;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .play-button:hover {
      background: #43A047;
    }

    .play-button.playing {
      background: #2196F3;
    }
  `]
})
export class LibraryComponent implements OnInit {
  tracks$: Observable<Track[]>;
  loading$: Observable<boolean>;
  currentTrackId$: Observable<string | null>;
  searchQuery: string = '';

  constructor(private store: Store) {
    this.tracks$ = this.store.select(TracksSelectors.selectAllTracks);
    this.loading$ = this.store.select(TracksSelectors.selectTracksLoading);
    this.currentTrackId$ = this.store.select(TracksSelectors.selectCurrentTrackId);
  }

  ngOnInit() {
    this.store.dispatch(TracksActions.loadTracks());
    this.tracks$ = this.store.select(TracksSelectors.selectAllTracks);
  }

  playTrack(track: Track): void {
    console.log('Playing track ID:', track.id);
    this.store.dispatch(PlayerActions.play({ trackId: track.id }));
  }

  onSearch() {
    // Implement search functionality
    this.store.dispatch(TracksActions.searchTracks({ query: this.searchQuery }));
  }
}

