"use client";

import * as htmlToImage from 'html-to-image';
import { Capacitor } from '@capacitor/core';
import type { EditorState } from "../tipos";
import type { useToast } from '@/hooks/use-toast';

type ToastFn = ReturnType<typeof useToast>['toast'];

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Captura o preview como imagem e salva no dispositivo (nativo) ou faz download (web).
 * @param formato "png" | "jpeg"
 */
export async function onExportImage(
  formato: "png" | "jpeg" = "png",
  toast: ToastFn
) {
  const mainElement = document.querySelector<HTMLElement>("#editor-preview-content");

  if (!mainElement) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return;
  }

  toast({ title: 'Exportando...', description: 'Gerando imagem, por favor aguarde...' });
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 100));

  try {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}-${now.getSeconds().toString().padStart(2,'0')}`;
    const filename = `inspire-me-${timestamp}.${formato}`;

    let dataUrl: string;

    if (formato === 'jpeg') {
      dataUrl = await htmlToImage.toJpeg(mainElement, { 
        quality: 0.95,
        pixelRatio: 2,
      });
    } else {
      dataUrl = await htmlToImage.toPng(mainElement, {
        pixelRatio: 2,
      });
    }

    if (Capacitor.isNativePlatform()) {
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const base64Data = dataUrl.split('base64,')[1];
        await Filesystem.writeFile({
          path: `InspiraMe/${filename}`,
          data: base64Data,
          directory: Directory.Images,
          recursive: true,
        });
        toast({ title: 'Sucesso!', description: `Imagem salva na sua galeria na pasta 'InspiraMe'.` });
      } catch (e) {
        console.error('Erro ao salvar no dispositivo', e);
        toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Não foi possível salvar na galeria. Verifique as permissões.' });
      }
    } else {
      downloadDataUrl(dataUrl, filename);
      toast({ title: 'Sucesso!', description: `Imagem salva como ${filename}` });
    }

  } catch (err) {
    console.error("Erro ao capturar preview:", err);
    toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Ocorreu um problema ao gerar a imagem.' });
  }
}


/**
 * Gera uma miniatura para o template e o salva.
 * @param currentState Estado atual do editor
 * @param addTemplate Função para adicionar o template
 * @param toast Função para exibir notificações
 */
export async function handleSaveAsTemplate(
  currentState: EditorState,
  addTemplate: (name: string, state: EditorState, thumbnail: string) => void,
  toast: ToastFn
) {
  const templateName = prompt("Digite um nome para o novo modelo:");
  if (!templateName) return;

  toast({ title: 'Salvando modelo...', description: 'Gerando miniatura...' });

  const element = document.querySelector<HTMLElement>("#editor-preview-content");
  if (!element) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return;
  }
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
     const thumbnail = await htmlToImage.toJpeg(element, {
        quality: 0.8,
        width: 400,
        height: 400,
        style: {
            aspectRatio: '1',
            objectFit: 'cover'
        }
     });

     addTemplate(templateName, currentState, thumbnail);
     toast({
        title: "Modelo Salvo!",
        description: `O modelo "${templateName}" foi adicionado à sua coleção.`,
     });

  } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível gerar a miniatura do modelo.' });
  }
}
