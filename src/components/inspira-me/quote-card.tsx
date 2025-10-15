import type { Quote as QuoteType } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Quote as QuoteIcon } from 'lucide-react';

type QuoteCardProps = {
  item: QuoteType;
};

export function QuoteCard({ item }: QuoteCardProps) {
  return (
    <Card className="h-full flex flex-col justify-center transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl">
      <CardContent className="p-6">
        <blockquote className="space-y-4">
          <div className="flex justify-center mb-4">
            <QuoteIcon className="h-8 w-8 text-accent" />
          </div>
          <p className="text-2xl font-medium text-center font-headline leading-relaxed">
            &ldquo;{item.text}&rdquo;
          </p>
          <footer className="text-right text-lg text-muted-foreground font-body">
            &mdash; {item.author}
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}
