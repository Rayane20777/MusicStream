import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Track } from '../../../core/models/track.model';
import * as TracksSelectors from '../../../core/state/tracks/tracks.selectors';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="track-details" *ngIf="track$ | async as track">
      <h1>{{ track.title }}</h1>
      <p>Artist: {{ track.artist }}</p>
      <p>Category: {{ track.category }}</p>
      <p>Duration: {{ track.duration | date:'mm:ss' }}</p>
      <p>Added on: {{ track.addedDate | date }}</p>
      <p *ngIf="track.description">Description: {{ track.description }}</p>
    </div>
  `,
  styles: [`
    .track-details {
      padding: 20px;
    }
  `]
})
export class TrackComponent implements OnInit {
  track$: Observable<Track | undefined>;

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {
    this.track$ = this.store.select(TracksSelectors.selectTrackById(this.route.snapshot.params['id']));
  }

  ngOnInit() {
    // You might want to dispatch an action to load the track if it's not in the store
  }
}

