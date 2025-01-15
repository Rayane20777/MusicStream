import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'library',
    loadChildren: () => import('./features/library/library.routes').then(m => m.LIBRARY_ROUTES)
  },
  {
    path: 'track',
    loadChildren: () => import('./features/track/track.routes').then(m => m.TRACK_ROUTES)
  },
  {
    path: 'manage',
    loadComponent: () => import('./features/manage-tracks/components/manage-tracks.component').then(m => m.ManageTracksComponent)
  },
  { path: '', redirectTo: '/library', pathMatch: 'full' }
];