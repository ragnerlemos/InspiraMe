
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Tipos para o estado do nosso novo editor
interface ToolEditorState {
  text: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  shadowBlur: number;
  shadowOpacity: number;
  strokeWidth: number;
  strokeColor: string;
  strokeType: 'square' | 'rounded';
}

export function FerramentasEditor() {
  const [state, setState] = useState<ToolEditorState>({
    text: 'Texto de Exemplo\nCom emojis ✨',
    fontWeight: 'bold',
    fontStyle: 'normal',
    shadowBlur: 4,
    shadowOpacity: 50,
    strokeWidth: 2,
    strokeColor: '#000000',
    strokeType: 'rounded',
  });

  const updateState = (newState: Partial<ToolEditorState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const textStyle: React.CSSProperties = {
    fontWeight: state.fontWeight,
    fontStyle: state.fontStyle,
    fontSize: '60px',
    color: 'white',
    fontFamily: 'Poppins, sans-serif',
  };

  // Lógica para criar os efeitos de sombra e contorno
  const createTextEffect = () => {
    let textShadows: string[] = [];

    // 1. Sombra
    if (state.shadowOpacity > 0 && state.shadowBlur > 0) {
      const shadowColor = `rgba(0, 0, 0, ${state.shadowOpacity / 100})`;
      // Sombra projetada (drop shadow)
      textShadows.push(`4px 4px ${state.shadowBlur}px ${shadowColor}`);
    }

    // 2. Contorno
    if (state.strokeWidth > 0) {
      const { strokeWidth, strokeColor, strokeType } = state;
      const numSteps = 8; // Mais passos para um contorno mais denso

      if (strokeType === 'rounded') {
        // Contorno arredondado e suave
        for (let i = 0; i < numSteps; i++) {
          const angle = (i * 360) / numSteps;
          const x = Math.cos((angle * Math.PI) / 180) * strokeWidth;
          const y = Math.sin((angle * Math.PI) / 180) * strokeWidth;
          textShadows.push(`${x}px ${y}px 0 ${strokeColor}`);
        }
      } else {
        // Contorno quadrado (sharp)
        for (let x = -strokeWidth; x <= strokeWidth; x++) {
          for (let y = -strokeWidth; y <= strokeWidth; y++) {
            if (x !== 0 || y !== 0) {
              textShadows.push(`${x}px ${y}px 0 ${strokeColor}`);
            }
          }
        }
      }
    }
    
    // Ignora o text-shadow para emojis usando um seletor CSS que não temos aqui,
    // então a abordagem de contorno pode afetar emojis. 
    // A melhor solução seria usar `-webkit-text-stroke` se fosse garantido.
    // Para este exemplo, a simplicidade do text-shadow é mantida.

    return textShadows.join(', ');
  };

  textStyle.textShadow = createTextEffect();

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Painel de Controles */}
      <div className="w-full md:w-96 bg-card border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-xl font-bold font-headline">Ferramentas de Texto</h2>

        {/* Editor de Texto */}
        <div className="space-y-2">
          <Label htmlFor="main-text">Texto</Label>
          <Textarea
            id="main-text"
            value={state.text}
            onChange={(e) => updateState({ text: e.target.value })}
            rows={4}
          />
        </div>

        {/* Estilo do Texto */}
        <div className="space-y-2">
          <Label>Estilo</Label>
          <div className="flex gap-2">
            <Button
              variant={state.fontWeight === 'bold' ? 'secondary' : 'outline'}
              onClick={() => updateState({ fontWeight: state.fontWeight === 'bold' ? 'normal' : 'bold' })}
            >
              <Bold className="h-4 w-4 mr-2" />
              Negrito
            </Button>
            <Button
              variant={state.fontStyle === 'italic' ? 'secondary' : 'outline'}
              onClick={() => updateState({ fontStyle: state.fontStyle === 'italic' ? 'normal' : 'italic' })}
            >
              <Italic className="h-4 w-4 mr-2" />
              Itálico
            </Button>
          </div>
        </div>

        {/* Controles da Sombra */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Sombra</h3>
          <div className="space-y-2">
            <Label htmlFor="shadow-blur">Desfoque da Sombra: {state.shadowBlur}px</Label>
            <Slider
              id="shadow-blur"
              min={0}
              max={20}
              step={1}
              value={[state.shadowBlur]}
              onValueChange={(v) => updateState({ shadowBlur: v[0] })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shadow-opacity">Opacidade da Sombra: {state.shadowOpacity}%</Label>
            <Slider
              id="shadow-opacity"
              min={0}
              max={100}
              step={5}
              value={[state.shadowOpacity]}
              onValueChange={(v) => updateState({ shadowOpacity: v[0] })}
            />
          </div>
        </div>

        {/* Controles do Contorno */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Contorno</h3>
          <div className="space-y-2">
            <Label htmlFor="stroke-type">Tipo de Canto</Label>
            <Select
              value={state.strokeType}
              onValueChange={(v) => updateState({ strokeType: v as 'square' | 'rounded' })}
            >
              <SelectTrigger id="stroke-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Arredondado</SelectItem>
                <SelectItem value="square">Quadrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stroke-width">Espessura do Contorno: {state.strokeWidth}px</Label>
            <Slider
              id="stroke-width"
              min={0}
              max={20}
              step={1}
              value={[state.strokeWidth]}
              onValueChange={(v) => updateState({ strokeWidth: v[0] })}
            />
          </div>
           <div className="space-y-2">
              <Label htmlFor="stroke-color">Cor do Contorno</Label>
              <Input
                  id="stroke-color"
                  type="color"
                  value={state.strokeColor}
                  onChange={(e) => updateState({ strokeColor: e.target.value })}
                  className="w-full h-10 p-1"
              />
          </div>
        </div>
      </div>

      {/* Área de Pré-visualização */}
      <div className="flex-1 flex items-center justify-center bg-muted/40 p-4">
        <div
          className="text-center break-words"
          style={textStyle}
        >
          {state.text}
        </div>
      </div>
    </div>
  );
}
