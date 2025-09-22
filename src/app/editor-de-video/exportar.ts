
'use client';

import html2canvas from 'html2canvas';
import type { Toast } from '@/hooks/use-toast';
import type { EditorState } from './tipos';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const downloadDataUrl = (dataUrl: string, format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `quotevid-export-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: 'Sucesso!',
        description: `A imagem foi baixada como ${link.download}.`
    });
};


export const captureAndDownload_final = async (format: 'jpeg' | 'png', editorState: EditorState, toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, aguarde.` });

    const previewElement = document.getElementById('editor-preview-content');
    if (!previewElement) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
        return;
    }

    try {
        await document.fonts.ready;
        const images = Array.from(previewElement.getElementsByTagName('img'));
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => { img.onload = img.onerror = resolve; });
        }));

        const wrapper = document.createElement('div');
        
        // Define dimensões com base na proporção para a captura em alta resolução
        const aspectRatio = editorState.aspectRatio.replace(/\s/g, "");
        let captureWidth, captureHeight;
        
        if (aspectRatio === "9/16") {
            captureWidth = 1080;
            captureHeight = 1920;
        } else if (aspectRatio === "1/1") {
            captureWidth = 1080;
            captureHeight = 1080;
        } else { // 16/9
            captureWidth = 1920;
            captureHeight = 1080;
        }

        wrapper.style.width = `${captureWidth}px`;
        wrapper.style.height = `${captureHeight}px`;
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '-9999px';
        document.body.appendChild(wrapper);

        const clone = previewElement.cloneNode(true) as HTMLElement;
        clone.style.width = '100%';
        clone.style.height = '100%';
        wrapper.appendChild(clone);
        
        await delay(200);

        const canvas = await html2canvas(wrapper, {
            scale: 1, // A escala agora é controlada pelo tamanho do wrapper
            useCORS: true,
            backgroundColor: null,
            logging: false,
        });

        const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95);
        downloadDataUrl(dataUrl, format, toast);

        document.body.removeChild(wrapper);

    } catch (error) {
        console.error('Erro ao exportar imagem (versão final):', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
    }
};

export const captureThumbnail = async (toast: (props: Parameters<typeof Toast>[0]) => void): Promise<string | null> => {
  const previewElement = document.getElementById('editor-preview-content');
  if (!previewElement) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return null;
  }
  
  try {
    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    clone.style.width = '400px'; 
    clone.style.height = '400px';
    document.body.appendChild(clone);

    await delay(100);
    
    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 1, 
      backgroundColor: null,
      logging: false,
    });
    
    document.body.removeChild(clone);

    return canvas.toDataURL('image/jpeg', 0.8);

  } catch (error) {
    console.error('Erro ao gerar thumbnail:', error);
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível gerar a miniatura do modelo.'
    });
    return null;
  }
};
