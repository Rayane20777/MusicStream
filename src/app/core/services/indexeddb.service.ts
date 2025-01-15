import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private readonly DB_NAME = 'musicstreamDB';
  private readonly DB_VERSION = 1;
  private db!: IDBDatabase;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initDB().then(() => {
      console.log('IndexedDB initialized successfully');
      this.dbReady.next(true);
    }).catch(error => {
      console.error('Error initializing IndexedDB:', error);
    });
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('tracks')) {
          db.createObjectStore('tracks', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('coverImages')) {
          db.createObjectStore('coverImages', { keyPath: 'id' });
        }
      };
    });
  }

  getAllTracks(): Observable<Track[]> {
    return this.dbReady.pipe(
      switchMap(ready => {
        if (!ready) {
          throw new Error('Database not initialized');
        }
        return from(new Promise<Track[]>((resolve, reject) => {
          const transaction = this.db.transaction(['tracks', 'audioFiles', 'coverImages'], 'readonly');
          const trackStore = transaction.objectStore('tracks');
          const audioStore = transaction.objectStore('audioFiles');
          const imageStore = transaction.objectStore('coverImages');
          const request = trackStore.getAll();

          request.onerror = () => reject(request.error);
          request.onsuccess = async () => {
            const tracks = request.result;

            for (const track of tracks) {
              const audioRequest = audioStore.get(track.id);
              const imageRequest = imageStore.get(track.id);

              const [audioBlob, imageBlob] = await Promise.all([
                new Promise<Blob | null>((resolve) => {
                  audioRequest.onsuccess = () => resolve(audioRequest.result?.blob);
                  audioRequest.onerror = () => resolve(null);
                }),
                new Promise<Blob | null>((resolve) => {
                  imageRequest.onsuccess = () => resolve(imageRequest.result?.blob);
                  imageRequest.onerror = () => resolve(null);
                })
              ]);

              track.audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : '';
              track.coverImage = imageBlob ? URL.createObjectURL(imageBlob) : '';
            }
            resolve(tracks);
          };
        }));
      })
    );
  }

  addTrack(track: Omit<Track, 'id'>, audioFile: File, coverImage?: File | null): Observable<Track> {
    return this.dbReady.pipe(
        switchMap(ready => {
            if (!ready) {
                throw new Error('Database not initialized');
            }
            return from(new Promise<Track>(async (resolve, reject) => {
                const transaction = this.db.transaction(['tracks', 'audioFiles', 'coverImages'], 'readwrite');
                const trackStore = transaction.objectStore('tracks');
                const audioStore = transaction.objectStore('audioFiles');
                const imageStore = transaction.objectStore('coverImages');

                try {
                    const newTrackId = this.generateUniqueId();

                    const newTrack: Track = {
                        id: newTrackId,
                        ...track,
                        audioUrl: ''
                    };

                    await this.addToStore(trackStore, newTrack);
                    await this.addToStore(audioStore, { id: newTrackId, blob: audioFile });

                    if (coverImage) {
                        await this.addToStore(imageStore, { id: newTrackId, blob: coverImage });
                    }

                    resolve(newTrack);
                } catch (error) {
                    reject(error);
                }
            }));
        })
    );
}

  updateTrack(id: string, changes: Partial<Track>, audioFile?: File | null, coverImage?: File | null): Observable<Track> {
    return this.dbReady.pipe(
      switchMap(ready => {
        if (!ready) {
          throw new Error('Database not initialized');
        }
        return from(new Promise<Track>(async (resolve, reject) => {
          const transaction = this.db.transaction(['tracks', 'audioFiles', 'coverImages'], 'readwrite');
          const trackStore = transaction.objectStore('tracks');
          const audioStore = transaction.objectStore('audioFiles');
          const imageStore = transaction.objectStore('coverImages');

          try {
            // Update track metadata
            const track = await this.getFromStore(trackStore, id);
            const updatedTrack = { ...track, ...changes };
            await this.addToStore(trackStore, updatedTrack);

            // Update audio file if provided
            if (audioFile) {
              await this.addToStore(audioStore, { id, blob: audioFile });
              updatedTrack.audioUrl = URL.createObjectURL(audioFile);
            }

            // Update cover image if provided
            if (coverImage) {
              await this.addToStore(imageStore, { id, blob: coverImage });
            }

            resolve(updatedTrack);
          } catch (error) {
            reject(error);
          }
        }));
      })
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.dbReady.pipe(
      switchMap(ready => {
        if (!ready) {
          throw new Error('Database not initialized');
        }
        return from(new Promise<void>((resolve, reject) => {
          const transaction = this.db.transaction(['tracks', 'audioFiles', 'coverImages'], 'readwrite');
          const trackStore = transaction.objectStore('tracks');
          const audioStore = transaction.objectStore('audioFiles');
          const imageStore = transaction.objectStore('coverImages');

          try {
            trackStore.delete(id);
            audioStore.delete(id);
            imageStore.delete(id);
            transaction.oncomplete = () => resolve();
          } catch (error) {
            reject(error);
          }
        }));
      })
    );
  }

  private addToStore(store: IDBObjectStore, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.put(value);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private getFromStore(store: IDBObjectStore, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getAudioBlob(trackId: string): Observable<Blob | null> {
    return this.dbReady.pipe(
        switchMap(ready => {
            if (!ready) {
                throw new Error('Database not initialized');
            }
            return from(new Promise<Blob | null>((resolve, reject) => {
                const transaction = this.db.transaction('audioFiles', 'readonly');
                const audioStore = transaction.objectStore('audioFiles');
                const request = audioStore.get(trackId);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    resolve(request.result?.blob || null);
                };
            }));
        })
    );
}
}

