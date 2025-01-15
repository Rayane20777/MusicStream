import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as TracksActions from './tracks.actions';
import { IndexedDBService } from '../../services/indexeddb.service';

@Injectable()
export class TracksEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.loadTracks),
      mergeMap(() =>
        this.indexedDBService.getAllTracks().pipe(
          map(tracks => TracksActions.loadTracksSuccess({ tracks })),
          catchError(error => of(TracksActions.loadTracksFailure({ error })))
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.addTrack),
      tap(action => console.log('Add track action dispatched:', action)),
      mergeMap(({ track, audioFile, coverImage }) =>
        this.indexedDBService.addTrack(track, audioFile, coverImage).pipe(
          tap(savedTrack => console.log('Track saved to IndexedDB:', savedTrack)),
          map(savedTrack => TracksActions.addTrackSuccess({ track: savedTrack })),
          catchError(error => {
            console.error('Error adding track:', error);
            return of(TracksActions.addTrackFailure({ error }));
          })
        )
      )
    )
  );

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.updateTrack),
      mergeMap(({ id, changes, audioFile, coverImage }) =>
        this.indexedDBService.updateTrack(id, changes, audioFile, coverImage).pipe(
          map(updatedTrack => TracksActions.updateTrackSuccess({ track: { id, changes: updatedTrack } })),
          catchError(error => of(TracksActions.updateTrackFailure({ error })))
        )
      )
    )
  );

  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.deleteTrack),
      mergeMap(({ id }) =>
        this.indexedDBService.deleteTrack(id).pipe(
          map(() => TracksActions.deleteTrackSuccess({ id })),
          catchError(error => of(TracksActions.deleteTrackFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private indexedDBService: IndexedDBService
  ) {}
}

