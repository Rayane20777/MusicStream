import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Track, MusicCategory } from '../../../core/models/track.model';
import * as TracksActions from '../../../core/state/tracks/tracks.actions';
import * as TracksSelectors from '../../../core/state/tracks/tracks.selectors';

@Component({
  selector: 'app-manage-tracks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="manage-tracks-container">
      <h1>Manage Tracks</h1>

      <form [formGroup]="trackForm" (ngSubmit)="onSubmit()" class="track-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" formControlName="title" class="form-control">
          <div *ngIf="trackForm.get('title')?.invalid && trackForm.get('title')?.touched" class="error-message">
            Title is required and must be less than 50 characters.
          </div>
        </div>

        <div class="form-group">
          <label for="artist">Artist</label>
          <input type="text" id="artist" formControlName="artist" class="form-control">
          <div *ngIf="trackForm.get('artist')?.invalid && trackForm.get('artist')?.touched" class="error-message">
            Artist is required.
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description (optional)</label>
          <textarea id="description" formControlName="description" class="form-control"></textarea>
          <div *ngIf="trackForm.get('description')?.invalid && trackForm.get('description')?.touched" class="error-message">
            Description must be less than 200 characters.
          </div>
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" formControlName="category" class="form-control">
            <option value="">Select a category</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="rap">Rap</option>
            <option value="cha3bi">Cha3bi</option>
          </select>
          <div *ngIf="trackForm.get('category')?.invalid && trackForm.get('category')?.touched" class="error-message">
            Category is required.
          </div>
        </div>

        <div class="form-group">
          <label for="audioFile">Audio File</label>
          <input type="file" id="audioFile" (change)="onFileSelected($event)" accept=".mp3,.wav,.ogg" class="form-control">
          <div *ngIf="!audioFile && isSubmitted" class="error-message">
            Audio file is required.
          </div>
        </div>

        <div class="form-group">
          <label for="coverImage">Cover Image (optional)</label>
          <input type="file" id="coverImage" (change)="onImageSelected($event)" accept=".png,.jpg,.jpeg" class="form-control">
        </div>

        <button type="submit" [disabled]="trackForm.invalid || isSubmitting" class="submit-button">
          {{ editingTrackId ? 'Update Track' : 'Add Track' }}
        </button>
      </form>

      <div class="tracks-list">
        <h2>Existing Tracks</h2>
        <div *ngFor="let track of tracks$ | async" class="track-item">
          <div class="track-info">
            <h3>{{ track.title }}</h3>
            <p>{{ track.artist }}</p>
          </div>
          <div class="track-actions">
            <button (click)="editTrack(track)" class="edit-button">Edit</button>
            <button (click)="deleteTrack(track.id)" class="delete-button">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-tracks-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    h1, h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .track-form {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .error-message {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 5px;
    }

    .submit-button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .submit-button:disabled {
      background-color: #9e9e9e;
      cursor: not-allowed;
    }

    .tracks-list {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .track-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .track-item:last-child {
      border-bottom: none;
    }

    .track-info h3 {
      margin: 0;
      font-size: 18px;
    }

    .track-info p {
      margin: 5px 0 0;
      color: #666;
    }

    .track-actions {
      display: flex;
      gap: 10px;
    }

    .edit-button, .delete-button {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .edit-button {
      background-color: #2196F3;
      color: white;
    }

    .delete-button {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class ManageTracksComponent implements OnInit {
  trackForm: FormGroup;
  tracks$: Observable<Track[]>;
  audioFile: File | null = null;
  coverImage: File | null = null;
  isSubmitting = false;
  isSubmitted = false;
  editingTrackId: string | null = null;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store
  ) {
    this.trackForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', Validators.required],
      description: ['', Validators.maxLength(200)],
      category: ['', Validators.required]
    });

    this.tracks$ = this.store.select(TracksSelectors.selectAllTracks);
  }

  ngOnInit() {
    this.store.dispatch(TracksActions.loadTracks());

    // Subscribe to the tracks state
    this.store.select(TracksSelectors.selectAllTracks).subscribe(tracks => {
      console.log('Tracks updated:', tracks);
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.error = null;
    if (this.trackForm.valid && this.audioFile) {
      this.isSubmitting = true;
      const formValue = this.trackForm.value;
  
      if (this.editingTrackId) {
        this.store.dispatch(TracksActions.updateTrack({
          id: this.editingTrackId,
          changes: {
            title: formValue.title,
            artist: formValue.artist,
            description: formValue.description || '',
            category: formValue.category,
          },
          audioFile: this.audioFile,
          coverImage: this.coverImage
        }));
      } else {
        const track = {
          title: formValue.title,
          artist: formValue.artist,
          description: formValue.description || '',
          category: formValue.category,
          duration: 0,
          addedDate: new Date(),
          audioUrl: ''
        };
  
        this.store.dispatch(TracksActions.addTrack({
          track,
          audioFile: this.audioFile,
          coverImage: this.coverImage
        }));
      }
  
      this.resetForm();
    } else {
      this.error = 'Please fill in all required fields and select an audio file.';
    }
  }

  
  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.audioFile = element.files[0];
      // Here you would typically validate the file type and size
    }
  }

  onImageSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.coverImage = element.files[0];
      // Here you would typically validate the file type and size
    }
  }

  editTrack(track: Track) {
    this.editingTrackId = track.id;
    this.trackForm.patchValue({
      title: track.title,
      artist: track.artist,
      description: track.description,
      category: track.category
    });
    // Note: You can't set file input values for security reasons
    // You may want to display the current file names if available
  }

  deleteTrack(id: string) {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(TracksActions.deleteTrack({ id }));
    }
  }

  private resetForm() {
    this.trackForm.reset();
    this.audioFile = null;
    this.coverImage = null;
    this.isSubmitting = false;
    this.isSubmitted = false;
    this.editingTrackId = null;
    this.error = null;
  }
}

