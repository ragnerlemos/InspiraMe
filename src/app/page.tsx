"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, quotes } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Film } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function PhrasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || quote.category === selectedCategory)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Find Your Inspiration
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Browse through our collection of quotes and create your next viral video.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a phrase..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
        <div className="mb-8">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 pb-4">
                    <Button
                        variant={!selectedCategory ? "default" : "outline"}
                        onClick={() => setSelectedCategory(null)}
                        className="rounded-full"
                    >
                        All
                    </Button>
                    {categories.map((category) => (
                        <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-full"
                        >
                        {category}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((quote) => (
          <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <p className="text-xl font-body italic">"{quote.text}"</p>
              <span className="mt-4 inline-block bg-muted px-2 py-1 text-xs rounded-full text-muted-foreground">{quote.category}</span>
            </CardContent>
            <div className="p-6 pt-0">
                <Link href={`/editor?quote=${encodeURIComponent(quote.text)}`} passHref>
                    <Button className="w-full" variant="secondary">
                        <Film className="mr-2 h-4 w-4"/>
                        Create Video
                    </Button>
                </Link>
            </div>
          </Card>
        ))}
      </div>
      {filteredQuotes.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No quotes found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
