'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as htmlToImage from 'html-to-image';
import { Heart, RefreshCw, Loader2, MessageSquare, Smartphone, Copy as CopyIcon, MoreVertical, Download, Share2, Globe, Paperclip, Clipboard as ClipboardIcon, ArrowDownToLine, Tv, FileUp, Files, Image as ImageIcon, Camera, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// --- Dados e Tipos ---
interface Quote {
  id: string;
  quote: string;
  author?: string;
}

const sampleQuotes: Quote[] = [
  { id: '1', quote: 'A imaginação é mais importante que o conhecimento.', author: 'Albert Einstein' },
  { id: '2', quote: 'A única maneira de fazer um ótimo trabalho é amar o que você faz.', author: 'Steve Jobs' },
  { id: '3', quote: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
  { id: '4', quote: 'A vida é 10% o que acontece com você e 90% como você reage a isso.', author: 'Charles R. Swindoll' },
  { id: '5', quote: 'Se você quer viver uma vida feliz, amarre-a a um objetivo, não a pessoas ou coisas.', author: 'Albert Einstein' },
];

const FILENAME = 'InspiraMe_Teste.png';

// --- Componente Gerador de Imagem ---
function TesteMemeGenerator({
  quote,
  onClose,
  action,
}: {
  quote: Quote;
  onClose: () => void;
  action: 'download' | 'share-web' | 'share-capacitor' | 'share-app-2' | 'share-app-3' | 'share-app-4' | 'share-app-5' | 'share-app-6' | 'share-app-7' | 'share-app-8' | 'share-app-9' | 'share-app-10' | 'share-app-11' | 'share-app-12' | 'share-app-13' | 'share-app-14' | 'share-app-15' | 'share-app-16' | 'share-app-17' | 'share-app-18' | 'share-app-19' | 'share-app-20' | 'share-app-21'| 'share-app-22' | 'preview-and-share' | 'save-and-notify';
}) {
  const memeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(action === 'preview-and-share');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const handleShareFromPreview = () => {
     if (!generatedImageUrl) return;

     const shareFile = async () => {
         try {
             if (!Capacitor.isNativePlatform()) throw new Error("Apenas para app nativo.");
             
             // A URL gerada (geralmente base64) precisa ser salva como um arquivo primeiro.
             const base64Data = generatedImageUrl.split('base64,')[1];
             if (!base64Data) throw new Error("Não foi possível extrair os dados da imagem.");

             const { uri } = await Filesystem.writeFile({
                path: `InspiraMe_Preview_${Date.now()}.png`,
                data: base64Data,
                directory: Directory.Cache,
             });

             await Share.share({ files: [uri] });

         } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao Compartilhar', description: `${error}` });
         } finally {
            onClose();
         }
     }
     shareFile();
  };

  const generateAndProcess = useCallback(async () => {
    if (!memeRef.current) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Elemento do meme não encontrado.' });
        onClose();
        return;
    }
    
    // Para evitar rodar duas vezes no Strict Mode do React 18
    if (generatedImageUrl) return;


    try {
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 200));

        if (action === 'preview-and-share') {
             const dataUrl = await htmlToImage.toPng(memeRef.current, { pixelRatio: 2 });
             setGeneratedImageUrl(dataUrl);
             setIsPreview(true);
             return; // Para aqui e espera a interação do usuário
        }
        
        if (action === 'save-and-notify') {
             const blob = await htmlToImage.toBlob(memeRef.current, { pixelRatio: 2 });
             if (!blob) throw new Error("Falha ao gerar blob.");

             if (!Capacitor.isNativePlatform()) throw new Error("Função apenas para app nativo.");

             const reader = new FileReader();
             reader.readAsDataURL(blob);
             reader.onloadend = async () => {
                const base64Data = reader.result?.toString().split('base64,')[1];
                if (!base64Data) throw new Error("Não foi possível ler a imagem.");
                
                await Filesystem.writeFile({
                    path: FILENAME,
                    data: base64Data,
                    directory: Directory.Documents,
                    recursive: true
                });

                await Share.share({
                    text: `Sua imagem foi salva em Documentos! Agora você pode anexá-la.`
                });
                onClose();
             }
             return;
        }
        
        // Lógica de geração de imagem para as outras ações
        const blob = await htmlToImage.toBlob(memeRef.current, { pixelRatio: 2 });
        if (!blob) throw new Error('Falha ao gerar a imagem (blob nulo).');
        
        const processShare = async (shareAction: typeof action) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Data = (reader.result as string).split('base64,')[1];
                let uri: string;
                
                 try {
                     if (shareAction === 'share-capacitor') {
                          ({ uri } = await Filesystem.writeFile({
                            path: FILENAME,
                            data: base64Data,
                            directory: Directory.Cache,
                        }));
                        await Share.share({ url: uri, title: 'Meme Inspirador' });

                     } else if (shareAction === 'share-app-2') {
                         ({ uri } = await Filesystem.writeFile({
                            path: FILENAME,
                            data: base64Data,
                            directory: Directory.Data,
                        }));
                        await Share.share({ url: uri, title: 'Meme Inspirador [App 2]' });
                     } else if (shareAction === 'share-app-3') {
                         ({ uri } = await Filesystem.writeFile({
                            path: `docs_${FILENAME}`,
                            data: base64Data,
                            directory: Directory.Documents,
                         }));
                         await Share.share({ files: [uri] });
                     } else if (shareAction === 'share-app-4') {
                         ({ uri } = await Filesystem.writeFile({
                            path: `cache_${FILENAME}`,
                            data: base64Data,
                            directory: Directory.Cache,
                         }));
                         await Share.share({ files: [uri] });
                     } else if (shareAction === 'share-app-5') {
                        const jpegBlob = await htmlToImage.toJpeg(memeRef.current!, { quality: 0.9 });
                        const jpegReader = new FileReader();
                        jpegReader.readAsDataURL(jpegBlob);
                        jpegReader.onloadend = async () => {
                            const jpegBase64 = (jpegReader.result as string).split('base64,')[1];
                             ({ uri } = await Filesystem.writeFile({
                                path: `docs_${FILENAME.replace('.png', '.jpeg')}`,
                                data: jpegBase64,
                                directory: Directory.Documents,
                            }));
                            await Share.share({ files: [uri] });
                        }
                     } else if (shareAction === 'share-app-6') {
                         const dataUrl = await htmlToImage.toPng(memeRef.current!);
                         await Share.share({ url: dataUrl });
                     } else if (shareAction === 'share-app-7') {
                          const dataUrl = await htmlToImage.toPng(memeRef.current!);
                          await Share.share({ files: [dataUrl] });
                     } else if (shareAction === 'share-app-8') {
                         const base64 = await htmlToImage.toPng(memeRef.current!, {
                           pixelRatio: 1,
                         });
                         ({ uri } = await Filesystem.writeFile({
                            path: `b64_${FILENAME}`,
                            data: base64.split('base64,')[1],
                            directory: Directory.Cache
                         }));
                         await Share.share({ files: [uri] });
                     } else if (shareAction === 'share-app-9') {
                        const dataUrl = await htmlToImage.toPng(memeRef.current!);
                        await Clipboard.write({string: dataUrl});
                        await Share.share({text: "Imagem copiada! Cole no app de destino."});
                     } else if (shareAction === 'share-app-10') {
                        const dataUrl = await htmlToImage.toPng(memeRef.current!);
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = FILENAME;
                        link.click();
                     } else if (shareAction === 'share-app-11') {
                         const blobUrl = URL.createObjectURL(blob);
                         await Share.share({url: blobUrl});
                         URL.revokeObjectURL(blobUrl);
                     } else if (shareAction === 'share-app-12') {
                        const dataUrl = await htmlToImage.toPng(memeRef.current!);
                        ({uri} = await Filesystem.writeFile({
                            path: `simplified_${FILENAME}`,
                            data: dataUrl,
                            directory: Directory.Cache
                        }));
                        await Share.share({ files: [uri] });
                    } else if (shareAction === 'share-app-13') {
                        toast({title: "[App 13] Passo 1: Gerando Imagem"});
                        const dataUrl = await htmlToImage.toPng(memeRef.current!);
                        toast({title: "[App 13] Passo 2: Lendo dados"});
                         ({uri} = await Filesystem.writeFile({
                            path: `debug_${FILENAME}`,
                            data: dataUrl,
                            directory: Directory.Cache
                        }));
                        toast({title: "[App 13] Passo 3: Arquivo salvo em " + uri});
                        await Share.share({ files: [uri] });
                        toast({title: "[App 13] Passo 4: API de Share chamada"});
                    } else if (shareAction === 'share-app-14') {
                         ({ uri } = await Filesystem.writeFile({
                            path: `external_${FILENAME}`,
                            data: base64Data,
                            directory: Directory.External,
                            recursive: true,
                         }));
                         await Share.share({ files: [uri] });
                    } else if (shareAction === 'share-app-15') {
                        const dataUrl = await htmlToImage.toPng(memeRef.current!);
                         ({ uri } = await Filesystem.writeFile({
                            path: `dataurl_${FILENAME}`,
                            data: dataUrl,
                            directory: Directory.Cache,
                         }));
                         await Share.share({ files: [uri] });
                    } else if (shareAction === 'share-app-16') {
                        const canvas = await htmlToImage.toCanvas(memeRef.current!);
                        canvas.toBlob(async (canvasBlob) => {
                            if (!canvasBlob) return;
                            const canvasReader = new FileReader();
                            canvasReader.readAsDataURL(canvasBlob);
                            canvasReader.onloadend = async () => {
                                const canvasBase64 = (canvasReader.result as string).split('base64,')[1];
                                 ({ uri } = await Filesystem.writeFile({
                                    path: `canvas_${FILENAME}`,
                                    data: canvasBase64,
                                    directory: Directory.Cache,
                                }));
                                await Share.share({ files: [uri] });
                            }
                        }, 'image/png');
                    } else if (shareAction === 'share-app-17') {
                         const dataUrl = await htmlToImage.toPng(memeRef.current!);
                         await Share.share({ text: dataUrl });
                    } else if (shareAction === 'share-app-18') {
                        const dataUrl = await htmlToImage.toPng(memeRef.current!);
                        await Share.share({ files: [dataUrl] }); // Mesma lógica da 7, que é passar a data url direto
                    } else if (shareAction === 'share-app-19') {
                         ({ uri } = await Filesystem.writeFile({
                            path: `externalstorage_${FILENAME}`,
                            data: base64Data,
                            directory: Directory.ExternalStorage,
                            recursive: true,
                         }));
                         await Share.share({ files: [uri] });
                    } else if (shareAction === 'share-app-20') {
                         ({ uri } = await Filesystem.writeFile({
                            path: `recursive_${FILENAME}`,
                            data: base64Data,
                            directory: Directory.Cache,
                            recursive: true,
                         }));
                         await Share.share({ files: [uri] });
                    } else if (shareAction === 'share-app-21') {
                        const dataUrl = await htmlToImage.toPng(memeRef.current!);
                        await Clipboard.write({imageUrl: dataUrl});
                        toast({title: "Copiado!", description: "Imagem copiada para a área de transferência. Cole no app desejado."})
                    } else if (action === 'share-app-22') {
                        if (!Capacitor.isNativePlatform()) {
                            throw new Error('Esta opção é apenas para o aplicativo nativo.');
                        }
                        toast({ title: '[App 22] Passo 1: Gerando JPEG' });
                        const jpegBlob = await htmlToImage.toJpeg(memeRef.current!, { quality: 0.9, pixelRatio: 2 });
                        if (!jpegBlob) throw new Error('[App 22] Falha ao gerar JPEG (blob nulo).');
                        
                        toast({ title: '[App 22] Passo 2: Lendo dados do arquivo' });
                        const jpegReader = new FileReader();
                        jpegReader.readAsDataURL(jpegBlob);
                        jpegReader.onloadend = async () => {
                            const jpegBase64 = (jpegReader.result as string).split('base64,')[1];
                    
                            try {
                                toast({ title: '[App 22] Passo 3: Salvando em Documents' });
                                const { uri } = await Filesystem.writeFile({
                                    path: `InspiraMe_App22_${Date.now()}.jpeg`,
                                    data: jpegBase64,
                                    directory: Directory.Documents,
                                    recursive: true,
                                });
                    
                                toast({ title: '[App 22] Passo 4: Chamando Share API com files' });
                                await Share.share({
                                    title: 'Inspire-se!',
                                    dialogTitle: 'Compartilhar Imagem',
                                    files: [uri],
                                });
                            } catch (shareError) {
                                 throw new Error(`[App 22] Erro no passo 3 ou 4: ${shareError}`);
                            }
                        };
                        jpegReader.onerror = () => {
                            throw new Error('[App 22] Erro ao ler blob com FileReader.');
                        };
                        return; // Retorna para não fechar o modal
                    }


                } catch(e) {
                    throw e; // Re-throw para o catch principal
                }
            }
            reader.onerror = () => { throw new Error('Falha ao ler blob com FileReader.') };
        }

        if (action === 'download') {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = FILENAME;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast({ title: 'Sucesso!', description: `Imagem baixada como ${FILENAME}` });
        } else if (action === 'share-web') {
            const file = new File([blob], FILENAME, { type: blob.type });
            if (!navigator.share || !navigator.canShare || !navigator.canShare({ files: [file] })) {
                throw new Error('Web Share API (arquivos) não é suportada neste navegador.');
            }
            await navigator.share({ files: [file], title: 'Meme Inspirador' });
        } else if (action.startsWith('share-app')) {
            await processShare(action);
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
             toast({ title: 'Cancelado', description: 'Compartilhamento cancelado pelo usuário.' });
        } else {
            toast({ variant: 'destructive', title: 'Falha na Operação', description: `${error}` });
        }
    } finally {
       if (!isPreview) {
          onClose();
       }
    }
  }, [action, quote, toast, onClose, isPreview, generatedImageUrl]);

  useEffect(() => {
    // Só gera automaticamente se não for o modo de preview
    if (!isPreview) {
      generateAndProcess();
    }
  }, [generateAndProcess, isPreview]);

  // Se for para compartilhar diretamente e não houver fallback para download, apenas exibe o loader
  if (!isPreview) {
      return (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="text-white text-lg">Processando...</p>
            </div>
            <div ref={memeRef} className="fixed top-[-9999px] left-[-9999px] bg-black text-white p-12 flex flex-col justify-center items-center" style={{ width: '500px', height: '500px' }}>
                <p style={{ fontFamily: 'Poppins', fontSize: '32px', textAlign: 'center', lineHeight: '1.3' }}>{quote.quote}</p>
                {quote.author && <p style={{ fontFamily: 'Poppins', fontSize: '24px', textAlign: 'right', alignSelf:'flex-end', paddingTop: '50px' }}>- {quote.author}</p>}
            </div>
          </>
      );
  }
  
  // Renderiza a pré-visualização para download ou compartilhamento posterior
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <div ref={memeRef} className="bg-black text-white p-12 flex flex-col justify-center items-center rounded-lg" style={{ width: '300px', height: '300px' }}>
                <p style={{ fontFamily: 'Poppins', fontSize: '20px', textAlign: 'center', lineHeight: '1.3' }}>{quote.quote}</p>
                 {quote.author && <p style={{ fontFamily: 'Poppins', fontSize: '16px', textAlign: 'right', alignSelf:'flex-end', paddingTop: '30px' }}>- {quote.author}</p>}
            </div>
             <div className="flex gap-4 mt-4">
                 <Button onClick={() => setProcessingAction('download')}> <Download className="mr-2 h-4 w-4"/> Baixar</Button>
                 <Button onClick={handleShareFromPreview}><Share2 className="mr-2 h-4 w-4"/> Compartilhar</Button>
            </div>
        </div>
    </div>
  );
}


// --- Página de Teste ---
export default function TesteCompartilharPage() {
  const { toast } = useToast();
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => sampleQuotes[0]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [processingAction, setProcessingAction] = useState<'download' | 'share-web' | 'share-capacitor' | 'share-app-2' | 'share-app-3' | 'share-app-4' | 'share-app-5' | 'share-app-6' | 'share-app-7'| 'share-app-8' | 'share-app-9' | 'share-app-10'| 'share-app-11' | 'share-app-12' | 'share-app-13' | 'share-app-14'| 'share-app-15' | 'share-app-16' | 'share-app-17' | 'share-app-18' | 'share-app-19' | 'share-app-20' | 'share-app-21' | 'share-app-22' | 'preview-and-share' | 'save-and-notify' | null>(null);

  const getNewQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
    setCurrentQuote(sampleQuotes[randomIndex]);
    setIsFavorited(false);
  }, []);

  useEffect(() => { getNewQuote() }, [getNewQuote]);

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

  const handleShareText = async (text: string, author?: string) => {
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

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-6">
      {processingAction && (
        <TesteMemeGenerator 
            quote={currentQuote}
            action={processingAction}
            onClose={() => setProcessingAction(null)}
        />
      )}

      <div className="w-full max-w-md">
          <h1 className="text-center text-2xl font-bold mb-2">Página de Testes</h1>
          <p className="text-center text-muted-foreground mb-4">Use os ícones para testar cada funcionalidade de compartilhamento e download.</p>
          <Button onClick={getNewQuote} variant="outline" className="w-full mb-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Nova Frase Aleatória
          </Button>

          <Card className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 pb-2 flex-1">
              <p className="text-lg font-body text-center">"{currentQuote.quote}"</p>
            </CardContent>
            <CardFooter className="px-4 pt-2 pb-2 flex flex-col items-stretch gap-2">
              {currentQuote.author && <p className="font-medium text-sm text-muted-foreground text-right w-full pr-2">- {currentQuote.author}</p>}
              
              <div className="flex justify-around items-center w-full pt-2">
                <Button variant="ghost" size="icon" onClick={() => setProcessingAction('download')} title="Baixar Imagem">
                    <Download className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(currentQuote.quote, currentQuote.author)} title="Copiar Texto">
                  <CopyIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsFavorited(!isFavorited)} title="Favoritar">
                  <Heart className={cn("h-5 w-5", isFavorited ? "text-red-500 fill-current" : "text-gray-400")} />
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" title="Compartilhar">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleShareText(currentQuote.quote, currentQuote.author)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Compartilhar Texto
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setProcessingAction('share-web')}>
                            <Globe className="mr-2 h-4 w-4" />
                            Compartilhar Imagem (Web)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setProcessingAction('share-capacitor')}>
                            <Smartphone className="mr-2 h-4 w-4" />
                            App 1 (url/cache)
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-2')}>
                            <Smartphone className="mr-2 h-4 w-4" />
                            App 2 (url/data)
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-3')}>
                            <FileUp className="mr-2 h-4 w-4" />
                            App 3 (files/docs)
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-4')}>
                            <FileUp className="mr-2 h-4 w-4" />
                            App 4 (files/cache)
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-5')}>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            App 5 (JPG/docs)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setProcessingAction('preview-and-share')}>
                            <Camera className="mr-2 h-4 w-4" />
                            Gerar e Compartilhar (Preview)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setProcessingAction('save-and-notify')}>
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Salvar e Notificar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" title="Compartilhamento Experimental">
                           <Plane className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-6')}>App 6 (url data-uri)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-7')}>App 7 (files data-uri)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-8')}>App 8 (b64/cache)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-9')}>App 9 (Clipboard/Texto)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-10')}>App 10 (Simular Download)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-11')}>App 11 (Blob URL)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-12')}>App 12 (Simplificado)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-13')}>App 13 (Debug Files)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-14')}>App 14 (Salvar em Externo)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-15')}>App 15 (Enviar Data URL Completa)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-16')}>App 16 (Canvas para Blob)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-17')}>App 17 (Texto com Data URL)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-18')}>App 18 (Arquivo com Data URL)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-19')}>App 19 (Salvar em ExternalStorage)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-20')}>App 20 (Escrita Recursiva)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-21')}>App 21 (Clipboard Apenas)</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setProcessingAction('share-app-22')}>App 22 (Final)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

              </div>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}
