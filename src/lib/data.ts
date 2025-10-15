import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export type Quote = {
  type: 'quote';
  id: string;
  text: string;
  author: string;
};

export type Video = {
  type: 'video';
  id: string;
  title: string;
  videoId: string; // YouTube video ID
  thumbnailId: string; // Corresponds to an ID in placeholder-images.json
};

export type Inspiration = Quote | Video;

export const inspirations: Inspiration[] = [
  {
    type: 'quote',
    id: 'q1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    type: 'video',
    id: 'v1',
    title: 'A Journey Through the Alps',
    videoId: 'z_m5_N0I-gA',
    thumbnailId: 'video-thumb-1',
  },
  {
    type: 'quote',
    id: 'q2',
    text: "Believe you can and you're halfway there.",
    author: 'Theodore Roosevelt',
  },
  {
    type: 'video',
    id: 'v2',
    title: 'The Beauty of Mindfulness',
    videoId: 'X-tMenbuJ5o',
    thumbnailId: 'video-thumb-4'
  },
  {
    type: 'quote',
    id: 'q3',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    type: 'video',
    id: 'v3',
    title: 'City Lights at Night',
    videoId: 'ScbA-qfksoA',
    thumbnailId: 'video-thumb-2',
  },
   {
    type: 'quote',
    id: 'q4',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
  },
  {
    type: 'video',
    id: 'v4',
    title: 'The Power of the Ocean',
    videoId: '05A-qfksoA4',
    thumbnailId: 'video-thumb-3',
  }
];

// Helper to get image by ID
export const getPlaceholderImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Return a default or throw an error
    return {
      id: 'default',
      description: 'Default placeholder',
      imageUrl: 'https://picsum.photos/seed/default/600/400',
      imageHint: 'placeholder'
    };
  }
  return image;
};
