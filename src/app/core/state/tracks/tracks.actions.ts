import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Track } from '../../models/track.model';

export const loadTracks = createAction('[Tracks] Load Tracks');
export const loadTracksSuccess = createAction(
  '[Tracks] Load Tracks Success',
  props<{ tracks: Track[] }>()
);
export const loadTracksFailure = createAction(
  '[Tracks] Load Tracks Failure',
  props<{ error: any }>()
);

export const addTrack = createAction(
  '[Tracks] Add Track',
  props<{ track: Omit<Track, 'id'>, audioFile: File, coverImage?: File | null }>()
);
export const addTrackSuccess = createAction(
  '[Tracks] Add Track Success',
  props<{ track: Track }>()
);
export const addTrackFailure = createAction(
  '[Tracks] Add Track Failure',
  props<{ error: any }>()
);

export const updateTrack = createAction(
  '[Tracks] Update Track',
  props<{ id: string, changes: Partial<Track>, audioFile?: File | null, coverImage?: File | null }>()
);
export const updateTrackSuccess = createAction(
  '[Tracks] Update Track Success',
  props<{ track: Update<Track> }>()
);
export const updateTrackFailure = createAction(
  '[Tracks] Update Track Failure',
  props<{ error: any }>()
);

export const deleteTrack = createAction(
  '[Tracks] Delete Track',
  props<{ id: string }>()
);
export const deleteTrackSuccess = createAction(
  '[Tracks] Delete Track Success',
  props<{ id: string }>()
);
export const deleteTrackFailure = createAction(
  '[Tracks] Delete Track Failure',
  props<{ error: any }>()
);

export const searchTracks = createAction(
  '[Tracks] Search Tracks',
  props<{ query: string }>()
);

