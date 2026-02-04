
'use client';

import * as htmlToImage from 'html-to-image';
import type { EditorState, EstiloTexto } from './tipos';
import type { ProfileData } from '@/hooks/use-profile';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';


interface ToastProps {
    variant?: "default" | "destructive" | null | undefined,
    title: string;
    description: string;
}
type ToastFn = (props: ToastProps) => void;

function generateFilename(state: EditorState, format: 'jpeg' | 'png'): string {
    const safeCategory = state.category?.replace(/\s+/g, '-') || 'Geral';
    const safeSubCategory = state.subCategory?.replace(/\s+/g, '-');
    
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;

    const parts = ['InspiraMe', safeCategory];
    if (safeSubCategory && safeSubCategory !== 'Todos') {
        parts.push(safeSubCategory);
    }
    parts.push(timestamp);
    
    return `${parts.join('_')}.${format}`;
}


export const captureAndDownload = async (format: 'jpeg' | 'png', toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto, dropShadowStyle: EstiloTexto) => {
    const previewElement = document.getElementById('editor-preview-content');

    if (!previewElement) {
        toast({
            variant: 'destructive',
            title: 'Erro de Exportação',
            description: 'Não foi possível encontrar a área de visualização para exportar.'
        });
        return;
    }

    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });
    
    try {
        const dataUrl = format === 'jpeg'
            ? await htmlToImage.toJpeg(previewElement, { quality: 0.95, pixelRatio: 2 })
            : await htmlToImage.toPng(previewElement, { pixelRatio: 2 });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        
        const filename = generateFilename(state, format);
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: 'Sucesso!',
            description: `A imagem foi baixada como ${filename}.`
        });

    } catch (error) {
        console.error('Erro ao exportar imagem:', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem. Verifique o console para mais detalhes.' });
    }
};

export const captureAndShare = async (toast: ToastFn, state: EditorState) => {
    const previewElement = document.getElementById('editor-preview-content');
    if (!previewElement) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Área de visualização não encontrada.' });
        return;
    }

    toast({ title: 'Preparando...', description: 'Gerando imagem para compartilhamento.' });

    try {
        const blob = await htmlToImage.toBlob(previewElement, { pixelRatio: 2 });
        if (!blob) throw new Error("Falha ao gerar a imagem.");

        const filename = generateFilename(state, 'png');

        if (Capacitor.isNativePlatform()) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Data = reader.result?.toString().split('base64,')[1];
                if (!base64Data) throw new Error("Não foi possível ler os dados da imagem.");

                const { uri } = await Filesystem.writeFile({
                    path: filename,
                    data: base64Data,
                    directory: Directory.Cache,
                });
                
                if (!uri) throw new Error("Não foi possível salvar o arquivo temporário.");
                await Share.share({ url: uri });
            };
        } else {
            const file = new File([blob], filename, { type: "image/png" });
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
            } else {
                toast({ title: "Não suportado", description: "Seu navegador não suporta compartilhamento de arquivos." });
            }
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
             console.log("Compartilhamento cancelado pelo usuário.");
        } else {
            console.error('Erro ao compartilhar:', error);
            toast({ variant: 'destructive', title: 'Erro ao Compartilhar', description: 'Não foi possível compartilhar a imagem.' });
        }
    }
};


export const captureThumbnail = async (toast: ToastFn, state: EditorState, profile: ProfileData, baseTextStyle: EstiloTexto, textEffectsStyle: EstiloTexto, dropShadowStyle: EstiloTexto): Promise<string | null> => {
  const previewElement = document.getElementById('editor-preview-content');

  if (!previewElement) {
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível encontrar a área de visualização para gerar a miniatura.'
    });
    return null;
  }
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
     const thumbnail = await htmlToImage.toJpeg(previewElement, {
        quality: 0.8,
        width: 400,
        height: 400,
        style: {
            aspectRatio: '1',
            objectFit: 'cover'
        }
     });

     return thumbnail;

  } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar Modelo', description: 'Não foi possível gerar a miniatura do modelo.' });
      return null;
  }
};
