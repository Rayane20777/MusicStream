import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TracksState } from './tracks.reducer';

export const selectTracksState = createFeatureSelector<TracksState>('tracks');

export const selectAllTracks = createSelector(
  selectTracksState,
  (state: TracksState) => state.tracks
);

export const selectTracksLoading = createSelector(
  selectTracksState,
  (state: TracksState) => state.loading
);

export const selectTracksError = createSelector(
  selectTracksState,
  (state: TracksState) => state.error
);

export const selectTrackById = (id: string) => createSelector(
  selectAllTracks,
  (tracks) => tracks.find(track => track.id === id)
);

export const selectCurrentTrackId = createSelector(
  selectTracksState,
  (state: TracksState) => state.currentTrackId
);

