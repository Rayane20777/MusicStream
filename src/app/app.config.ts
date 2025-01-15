import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { reducers } from './core/state/app.state';
import { TracksEffects } from './core/state/tracks/tracks.effects';
import { PlayerEffects } from './core/state/player/player.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(reducers),
    provideEffects([TracksEffects, PlayerEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};

