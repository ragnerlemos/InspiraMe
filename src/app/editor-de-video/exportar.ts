
'use client';

import html2canvas from 'html2canvas';
import type { Toast } from '@/hooks/use-toast';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getClonedElement = async (toast: (props: Parameters<typeof Toast>[0]) => void) => {
    const previewElement = document.getElementById('editor-preview-content') as HTMLElement | null;
    if (!previewElement) {
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível encontrar a área de visualização para exportar.'
        });
        return null;
    }

    // Garante que todas as fontes customizadas estejam carregadas antes de clonar
    await document.fonts.ready;

    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px'; // Move o clone para fora da tela
    clone.style.left = '-9999px';
    clone.style.transform = 'none'; // Remove qualquer escala que o preview possa ter
    document.body.appendChild(clone);
    
    // Aguarda um ciclo de renderização para garantir que o clone esteja no DOM e com estilos aplicados
    await delay(100); 

    return { clone, original: previewElement };
}


const downloadDataUrl = (dataUrl: string, format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `inspire-me-export-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: 'Sucesso!',
        description: `A imagem foi baixada como ${link.download}.`
    });
};


/**
 * Captura a imagem do preview e inicia o download.
 */
export const captureAndDownload = async (format: 'jpeg' | 'png', toast: (props: Parameters<typeof Toast>[0]) => void) => {
    toast({ title: 'Exportando...', description: `Gerando imagem ${format.toUpperCase()}, por favor aguarde.` });

    const elements = await getClonedElement(toast);
    if (!elements) return;

    const { clone, original } = elements;
    clone.style.width = `${original.offsetWidth}px`;
    clone.style.height = `${original.offsetHeight}px`;

    try {
        const canvas = await html2canvas(clone, {
            useCORS: true,
            scale: 2, // Captura em dobro da resolução para maior qualidade
            backgroundColor: null,
            logging: false,
        });
        document.body.removeChild(clone);
        const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95);
        downloadDataUrl(dataUrl, format, toast);
    } catch (error) {
        console.error('Erro ao exportar imagem:', error);
        toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Não foi possível gerar a imagem.' });
        if (document.body.contains(clone)) document.body.removeChild(clone);
    }
};

/**
 * Captura o estado atual do canvas como uma thumbnail.
 */
export const captureThumbnail = async (toast: (props: Parameters<typeof Toast>[0]) => void): Promise<string | null> => {
  const elements = await getClonedElement(toast);
  if (!elements) return null;

  const { clone } = elements;
  
  try {
    // Define um tamanho fixo para a thumbnail para consistência
    clone.style.width = '400px'; 
    clone.style.height = '400px';
    
    await delay(100);

    const canvas = await html2canvas(clone, {
      useCORS: true,
      scale: 1, // Thumbnails não precisam de alta resolução
      backgroundColor: null,
      logging: false,
    });
    
    document.body.removeChild(clone);

    // Retorna a imagem em formato JPEG com qualidade reduzida para economizar espaço
    return canvas.toDataURL('image/jpeg', 0.8);

  } catch (error) {
    console.error('Erro ao gerar thumbnail:', error);
    toast({
      variant: 'destructive',
      title: 'Erro ao Salvar Modelo',
      description: 'Não foi possível gerar a miniatura do modelo.'
    });
    if (document.body.contains(clone)) document.body.removeChild(clone);
    return null;
  }
};
