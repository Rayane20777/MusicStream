import { createAction, props } from '@ngrx/store';

export const play = createAction(
  '[Player] Play',
  props<{ trackId: string }>()
);
export const pause = createAction('[Player] Pause');
export const stop = createAction('[Player] Stop');
export const setVolume = createAction(
  '[Player] Set Volume',
  props<{ volume: number }>()
);
export const updateProgress = createAction(
  '[Player] Update Progress',
  props<{ currentTime: number }>()
);

