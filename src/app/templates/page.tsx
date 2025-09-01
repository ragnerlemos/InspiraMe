import Link from 'next/link';
import Image from 'next/image';
import { templates } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Start with a Template
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Choose a professionally designed template to kickstart your creation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden group">
            <div className="relative aspect-[9/16]">
              <Image
                src={template.imageUrl}
                alt={`Template ${template.id}`}
                fill
                width={1080}
                height={1920}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={template.dataAiHint}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href={`/editor?templateId=${template.id}`} passHref>
                    <Button>
                        <Eye className="mr-2 h-4 w-4" />
                        Use Template
                    </Button>
                </Link>
              </div>
            </div>
            <CardContent className="p-4 bg-card">
              <p className="font-medium font-headline">Template {template.id}</p>
              <p className="text-sm text-muted-foreground">Aspect Ratio: {template.aspectRatio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
