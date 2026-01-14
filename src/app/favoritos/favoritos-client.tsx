
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Copy, Trash2, Share2, HeartCrack, MoreVertical, Edit, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from '@/components/ui/skeleton';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
}

interface FavoritesClientPageProps {
  allQuotes: QuoteWithAuthor[];
}

export function FavoritesClientPage({ allQuotes }: FavoritesClientPageProps) {
  const { favorites, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const router = useRouter();
  
  const [favoriteQuotes, setFavoriteQuotes] = useState<QuoteWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (allQuotes) {
      const userFavorites = allQuotes.filter(quote => favorites.includes(quote.id));
      setFavoriteQuotes(userFavorites);
    }
    setIsLoading(false);
  }, [favorites, allQuotes]);

  const handleCopy = async (text: string, author?: string) => {
    const textToCopy = author ? `"${text}" - ${author}` : text;
    try {
        if (Capacitor.isNativePlatform()) {
            await Clipboard.write({ string: textToCopy });
            toast({ title: 'Copiado!', description: 'A frase foi copiada para a sua área de transferência.' });
            return;
        }

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
            toast({ title: 'Copiado!', description: 'A frase foi copiada para a sua área de transferência.' });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                toast({ title: 'Copiado!', description: 'A frase foi copiada para a sua área de transferência.' });
            } catch (err) {
                console.error('Falha ao usar execCommand:', err);
                toast({ title: 'Erro ao Copiar', description: 'Não foi possível copiar.', variant: 'destructive' });
            }
            document.body.removeChild(textArea);
        }
    } catch (err) {
        console.error('Falha ao copiar:', err);
        toast({ title: 'Erro ao Copiar', description: 'Não foi possível copiar a frase.', variant: 'destructive' });
    }
  };

  const handleRemove = (id: string) => {
    removeFavorite(id);
    toast({
      title: "Removido!",
      description: "A frase foi removida dos seus favoritos.",
    });
  };

  const handleShare = async (text: string, author?: string) => {
    const shareText = author ? `"${text}" - ${author}` : text;
    
    if (Capacitor.isNativePlatform()) {
        try {
            await Share.share({
                title: 'InspireMe',
                text: shareText,
                dialogTitle: 'Compartilhar Frase'
            });
        } catch (error) {
            console.error("Erro ao usar Capacitor Share API, usando fallback de cópia:", error);
            await handleCopy(text, author);
        }
        return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'InspireMe', text: shareText });
      } catch (error) {
        if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
           await handleCopy(text, author);
        } else {
          console.error("Erro ao compartilhar, usando fallback de cópia:", error);
          await handleCopy(text, author);
        }
      }
    } else {
      await handleCopy(text, author);
    }
  };

  const handleCardSubCategoryClick = (subCategory: string) => {
    router.push(`/frases?subCategory=${encodeURIComponent(subCategory)}`);
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4 pb-0">
                    <Skeleton className="h-16 w-full" />
                </CardContent>
                <CardFooter className="p-4 pt-2 flex flex-col items-end gap-2">
                    <Skeleton className="h-4 w-1/3" />
                </CardFooter>
            </Card>
        ))}
    </div>
  );

  return (
    <main className="overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
            <div className="text-center mb-8">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Meus Favoritos</h1>
                <p className="text-muted-foreground mt-2 text-lg">Suas frases mais queridas, salvas em um só lugar.</p>
            </div>
            {isLoading ? renderSkeletons() : favoriteQuotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteQuotes.map((quote) => {
                    const isFavorited = favorites.includes(quote.id);
                    return (
                        <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-4 pb-0 flex-1">
                                <p className="text-base font-body">{quote.quote}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-2 flex flex-col items-stretch gap-2">
                                {quote.author && (
                                    <p className="text-sm font-medium text-muted-foreground self-end">
                                        - {quote.author}
                                    </p>
                                )}
                                <div className="flex justify-between items-center w-full pt-1">
                                    {quote.subCategory && quote.subCategory !== 'Todos' ? (
                                         <Button 
                                            variant="link"
                                            className="p-0 h-auto text-primary text-[10px] bg-primary/10 px-2 py-0.5 rounded-full truncate max-w-[120px] hover:no-underline hover:bg-primary/20"
                                            onClick={() => handleCardSubCategoryClick(quote.subCategory!)}
                                        >
                                            {quote.subCategory}
                                        </Button>
                                    ) : <div />}

                                    <div className="flex items-center -space-x-2 -mr-2">
                                        <Button variant="ghost" size="icon-sm" onClick={() => {
                                            toast({ title: "Função não disponível aqui", description: "Crie memes pela página de Frases."})
                                        }}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => handleCopy(quote.quote, quote.author)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => handleRemove(quote.id)}>
                                            <Trash2 className={cn("h-4 w-4 text-destructive")} />
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => handleShare(quote.quote, quote.author)}>
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon-sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => router.push(`/editor-de-video?quote=${encodeURIComponent(quote.quote)}`)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edição Avançada
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    toast({ title: "Função não disponível aqui", description: "Compartilhe memes pela página de Frases."})
                                                }}>
                                                    <Share2 className="mr-2 h-4 w-4" />
                                                    Compartilhar Meme
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
              </div>
            ) : (
            <div className="text-center py-20 bg-card border rounded-lg flex flex-col items-center">
                <HeartCrack className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Nenhuma frase favorita ainda</h2>
                <p className="text-muted-foreground mb-6">
                Clique no ícone de coração (❤️) em uma frase para adicioná-la aqui.
                </p>
                <Link href="/frases" passHref>
                <Button>Encontrar Inspiração</Button>
                </Link>
            </div>
            )}
        </div>
    </main>
  );
}
