import { ActionReducerMap } from '@ngrx/store';
import * as fromTracks from './tracks/tracks.reducer';
import * as fromPlayer from './player/player.reducer';

export interface AppState {
  tracks: fromTracks.TracksState;
  player: fromPlayer.PlayerState;
}

export const reducers: ActionReducerMap<AppState> = {
  tracks: fromTracks.tracksReducer,
  player: fromPlayer.playerReducer
};

