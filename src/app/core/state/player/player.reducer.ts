import { createReducer, on } from '@ngrx/store';
import * as PlayerActions from './player.actions';
import { PlayerState } from '../../models/player-state.model';
import { PlayerStatus } from '../../models/player-state.model';

export { PlayerState };

export const initialState: PlayerState = {
  status: 'stopped',
  loadingStatus: 'success',
  currentTime: 0,
  duration: 0,
  volume: 1,
  currentTrackId: null,
};

export const playerReducer = createReducer(
  initialState,
  on(PlayerActions.play, (state, { trackId }) => ({
    ...state,
    status: 'playing' as PlayerStatus,
    currentTrackId: trackId,
  })),
  on(PlayerActions.pause, state => ({
    ...state,
    status: 'paused' as PlayerStatus,
  })),
  on(PlayerActions.stop, state => ({
    ...state,
    status: 'stopped' as PlayerStatus,
    currentTime: 0,
    currentTrackId: null,
  })),
  on(PlayerActions.setVolume, (state, { volume }) => ({
    ...state,
    volume,
  })),
  on(PlayerActions.updateProgress, (state, { currentTime }) => ({
    ...state,
    currentTime,
  }))
);

