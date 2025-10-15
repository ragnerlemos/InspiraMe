"use client";

import type { Video } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlayCircle } from 'lucide-react';

type VideoCardProps = {
  item: Video;
};

export function VideoCard({ item }: VideoCardProps) {
  const thumbnail = getPlaceholderImage(item.thumbnailId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer group transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <Image
                src={thumbnail.imageUrl}
                alt={thumbnail.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                data-ai-hint={thumbnail.imageHint}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <PlayCircle className="h-16 w-16 text-white/80 transform group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-card">
            <h3 className="text-lg font-semibold font-headline">{item.title}</h3>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full p-0 border-0">
        <DialogHeader className="p-4 sr-only">
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
