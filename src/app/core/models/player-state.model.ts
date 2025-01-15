export type PlayerStatus = 'playing' | 'paused' | 'buffering' | 'stopped';
export type LoadingStatus = 'loading' | 'error' | 'success';

export interface PlayerState {
  status: PlayerStatus;
  loadingStatus: LoadingStatus;
  currentTime: number;
  duration: number;
  volume: number;
  currentTrackId: string | null;
}

