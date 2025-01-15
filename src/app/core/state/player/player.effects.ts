import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as PlayerActions from './player.actions';
import { AudioService } from '../../services/audio.service';

@Injectable()
export class PlayerEffects {
  play$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.play),
      tap(({ trackId }) => {
        // Assuming we have a method to get the audio URL from trackId
        const audioUrl = `${trackId}`;
        this.audioService.play(audioUrl);
      })
    ),
    { dispatch: false }
  );

  pause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.pause),
      tap(() => this.audioService.pause())
    ),
    { dispatch: false }
  );

  stop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.stop),
      tap(() => this.audioService.stop())
    ),
    { dispatch: false }
  );

  setVolume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.setVolume),
      tap(({ volume }) => this.audioService.setVolume(volume))
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private audioService: AudioService
  ) {}
}

