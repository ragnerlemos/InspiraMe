
"use client";

import { useState } from "react";
import { Wand2, Ratio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Define os tipos para as proporções de tela suportadas.
type AspectRatio = "16:9" | "1:1" | "4:3" | "3:2" | "9:16" | "21:9";

// Array com as proporções para facilitar a renderização dos botões.
const aspectRatios: AspectRatio[] = ["16:9", "1:1", "4:3", "3:2", "9:16", "21:9"];

export default function AspectWeaverPage() {
  // Estados para controlar a proporção, cor de fundo e cor do texto.
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#FFFFFF");

  // Componente que renderiza a barra lateral com os controles (visível apenas em desktop).
  const ControlsSidebar = () => (
    <aside className="hidden w-72 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Wand2 className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">Aspect Weaver</h1>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {/* Seção para selecionar a proporção da tela */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Aspect Ratio</h2>
          <div className="grid grid-cols-2 gap-2">
            {aspectRatios.map((ratio) => (
              <Button
                key={ratio}
                variant={aspectRatio === ratio ? "default" : "outline"}
                onClick={() => setAspectRatio(ratio)}
              >
                {ratio}
              </Button>
            ))}
          </div>
        </section>
        {/* Seção para selecionar as cores */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Colors</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bg-color">Background</Label>
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer appearance-none rounded-md border-none bg-transparent p-0"
                style={{ backgroundColor: bgColor }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fg-color">Foreground</Label>
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer appearance-none rounded-md border-none bg-transparent p-0"
                style={{ backgroundColor: fgColor }}
              />
            </div>
          </div>
        </section>
      </div>
    </aside>
  );

  // Componente que renderiza a barra de controles inferior (visível apenas em mobile).
  const MobileControlsBar = () => (
     <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm md:hidden">
        <div className="container mx-auto p-2">
           <div className="flex items-center justify-center gap-2">
             {aspectRatios.map((ratio) => (
               <Button
                 key={ratio}
                 variant={aspectRatio === ratio ? "default" : "outline"}
                 size="sm"
                 onClick={() => setAspectRatio(ratio)}
                 className="flex-1"
               >
                 {ratio}
               </Button>
             ))}
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-9 cursor-pointer appearance-none rounded-md border-none bg-transparent p-0"
                style={{ backgroundColor: bgColor }}
              />
               <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-9 cursor-pointer appearance-none rounded-md border-none bg-transparent p-0"
                style={{ backgroundColor: fgColor }}
              />
           </div>
        </div>
     </div>
  );

  return (
    <div className="flex h-dvh w-full flex-col md:flex-row">
      {/* Cabeçalho fixo para mobile */}
      <header className="fixed top-0 z-10 flex h-16 w-full items-center border-b bg-background/95 px-6 backdrop-blur-sm md:hidden">
         <Wand2 className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">Aspect Weaver</h1>
      </header>
      
      {/* Barra lateral para desktop */}
      <ControlsSidebar />
      
      {/* Área de conteúdo principal onde o canvas é exibido */}
      <main className="flex h-full w-full flex-1 flex-col items-center justify-center bg-muted/40 p-4 pt-20 md:pt-4">
        {/* O container do canvas garante que ele ocupe o máximo de espaço possível sem estourar os limites */}
        <div 
          className="mx-auto my-auto flex max-h-full max-w-full rounded-xl shadow-lg transition-all duration-300"
          style={{ 
            aspectRatio: aspectRatio.replace(':', ' / '),
            backgroundColor: bgColor,
          }}
        >
          {/* Conteúdo de placeholder dentro do canvas */}
          <div 
            className="m-auto flex flex-col items-center justify-center gap-4 text-center"
            style={{ color: fgColor }}
          >
            <Ratio className="h-12 w-12" />
            <div className="space-y-1">
              <p className="text-2xl font-bold">{aspectRatio}</p>
              <p className="text-muted-foreground" style={{ color: fgColor, opacity: 0.8 }}>
                Your content here
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Barra de controles inferior para mobile */}
      <MobileControlsBar />
    </div>
  );
}
