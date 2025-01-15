import { Routes } from '@angular/router';
import { TrackComponent } from './components/track.component';

export const TRACK_ROUTES: Routes = [
  { path: ':id', component: TrackComponent }
];

