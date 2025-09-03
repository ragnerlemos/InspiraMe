
// Componente da barra de ferramentas inferior que gerencia os painéis deslizantes.

import { useState } from 'react';
import { Type, Palette, ImagePlus, Undo2, Download, Share2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { PainelControlesProps } from "./tipos";
import { PainelTexto } from "./painel-texto";
import { PainelEstilo } from "./painel-estilo";
import { PainelFundo } from "./painel-fundo";
import { BotaoRecurso } from './botao-recurso';


export function PainelControles(props: PainelControlesProps) {
    const { toast } = useToast();
    const [activeToolbar, setActiveToolbar] = useState<'main' | 'text' | 'style' | 'background'>('main');

    const handleShare = async () => {
        const shareData = {
          title: "Frase de QuoteVid",
          text: `Confira esta frase que editei no QuoteVid:\n\n"${props.text}"`,
          url: window.location.href,
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
            toast({ title: "Conteúdo compartilhado com sucesso!" });
          } else {
            await navigator.clipboard.writeText(shareData.url);
            toast({
              title: "Link copiado!",
              description: "A API de compartilhamento não está disponível neste navegador. O link foi copiado para a área de transferência.",
            });
          }
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                toast({
                    variant: "destructive",
                    title: "Erro ao compartilhar",
                    description: "Não foi possível compartilhar o conteúdo.",
                });
            }
        }
    };

    const renderToolbarContent = () => {
        switch (activeToolbar) {
            case 'text':
                return <PainelTexto text={props.text} onTextChange={props.onTextChange} />;
            case 'style':
                return <PainelEstilo {...props} />;
            case 'background':
                 return <PainelFundo {...props} />;
            default:
                return (
                    <div className="flex h-24 items-center justify-around px-2">
                        <BotaoRecurso icon={Type} label="Texto" onClick={() => setActiveToolbar('text')} />
                        <BotaoRecurso icon={Palette} label="Estilo" onClick={() => setActiveToolbar('style')} />
                        <BotaoRecurso icon={ImagePlus} label="Fundo" onClick={() => setActiveToolbar('background')} />
                    </div>
                );
        }
    }
    
    return (
        <div className="w-full border-t bg-background flex flex-col">
            <div className="relative">
                {activeToolbar !== 'main' && (
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1/2 left-2 -translate-y-1/2 z-10"
                        onClick={() => setActiveToolbar('main')}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
                 <div className="w-full">
                    {renderToolbarContent()}
                 </div>
            </div>
            
            {/* Barra de Ações (Baixar, Desfazer, Compartilhar) */}
            <div className="flex gap-2 p-2 border-t">
                <Button className="flex-1"><Download className="mr-2 h-4 w-4" /> Baixar</Button>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" onClick={props.onUndo} disabled={!props.canUndo}>
                                <Undo2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Desfazer</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button variant="secondary" className="flex-1" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
            </div>
        </div>
    );
}
