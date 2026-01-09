
"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Copy, Share2, Heart, Pencil } from "lucide-react";
import { Quote } from "./tipos";
import { useRouter } from 'next/navigation';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

interface QuoteCardProps {
  quote: Quote;
}

// Componente para exibir um card de citação com ações.
export function QuoteCard({ quote }: QuoteCardProps) {
  const { toast } = useToast();
  const router = useRouter();

  // Copia o texto da citação para a área de transferência.
  const handleCopy = async () => {
    try {
      await Clipboard.write({
        string: `"${quote.text}" - ${quote.author}`
      });
      toast({
        title: "Sucesso!",
        description: "Frase copiada para a área de transferência.",
      });
    } catch (error) {
      console.error('Falha ao copiar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível copiar a frase.",
        variant: "destructive",
      });
    }
  };

  // Compartilha a citação usando o menu nativo do dispositivo.
  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Frase do InspireMe',
        text: `"${quote.text}" - ${quote.author}`,
        dialogTitle: 'Compartilhar Frase',
      });
    } catch (error) {
      console.error('Falha ao compartilhar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar a frase.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    // Navega para a página de edição, passando a frase como um JSON na URL
    const quoteJson = encodeURIComponent(JSON.stringify(quote));
    router.push(`/editor-de-video?quote=${quoteJson}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <p className="text-lg font-medium text-foreground">"{quote.text}"</p>
          <p className="mt-4 text-right text-sm text-muted-foreground">- {quote.author}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/40 p-3">
          <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copiar">
            <Copy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Compartilhar">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Favoritar">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="default" size="sm" onClick={handleEdit} className="ml-auto">
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
