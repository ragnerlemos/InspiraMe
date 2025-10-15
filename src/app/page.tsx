import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { QuoteCard } from '@/components/inspira-me/quote-card';
import { VideoCard } from '@/components/inspira-me/video-card';
import { inspirations } from '@/lib/data';

// This function runs on the server, so Math.random is safe here.
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Home() {
  const shuffledInspirations = shuffleArray(inspirations);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">
            Find Your Daily Spark
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            A curated collection of quotes and videos to inspire your day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shuffledInspirations.map((item) => (
            <div key={item.id} className="animate-in fade-in zoom-in-95 duration-500">
              {item.type === 'quote' ? (
                <QuoteCard item={item} />
              ) : (
                <VideoCard item={item} />
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
