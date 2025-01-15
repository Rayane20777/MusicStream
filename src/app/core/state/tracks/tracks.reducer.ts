import { createReducer, on } from '@ngrx/store';
import * as TracksActions from './tracks.actions';
import { Track } from '../../models/track.model';

export interface TracksState {
  tracks: Track[];
  loading: boolean;
  error: any;
  currentTrackId: string | null;
}

export const initialState: TracksState = {
  tracks: [],
  loading: false,
  error: null,
  currentTrackId: null
};

export const tracksReducer = createReducer(
  initialState,
  on(TracksActions.loadTracks, state => ({ ...state, loading: true })),
  on(TracksActions.loadTracksSuccess, (state, { tracks }) => ({
    ...state,
    tracks,
    loading: false,
  })),
  on(TracksActions.loadTracksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TracksActions.addTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
  })),
  on(TracksActions.deleteTrackSuccess, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter(track => track.id !== id),
  })),
  on(TracksActions.searchTracks, (state, { query }) => ({
    ...state,
    // Implementation of search logic would go here
    // For now, we'll just return the current state
    ...state
  }))
);

