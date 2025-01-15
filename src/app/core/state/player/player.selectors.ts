import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from '../../models/player-state.model';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectPlayerStatus = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.status
);

export const selectCurrentTrackId = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.currentTrackId
);

export const selectPlayerVolume = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.volume
);

export const selectPlayerCurrentTime = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.currentTime
);

export const selectIsPlaying = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.status === 'playing'
);

