import { Feather } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-b-black/10">
      <div className="container mx-auto flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 text-primary">
          <Feather className="h-8 w-8" />
          <span className="text-3xl font-headline font-bold">InspiraMe</span>
        </Link>
      </div>
    </header>
  );
}
