export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  duration: number;
  category: MusicCategory;
  addedDate: Date;
  coverImage?: string;
  audioUrl: string;
}

export type MusicCategory = 'pop' | 'rock' | 'rap' | 'cha3bi';

