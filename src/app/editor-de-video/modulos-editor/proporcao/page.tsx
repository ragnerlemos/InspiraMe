
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
        <Sidebar
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          scale={scale}
          setScale={setScale}
          bgColor={bgColor}
          setBgColor={setBgColor}
          fgColor={fgColor}
          setFgColor={setFgColor}
        />

        <main className="flex-1 flex flex-col items-center justify-center overflow-hidden min-h-0">
          <PreviewCanva
            aspectRatio={aspectRatio}
            bgColor={bgColor}
            fgColor={fgColor}
            scale={scale}
          />
        </main>
      </div>

      {/* Botão flutuante para abrir o menu no mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={() => setIsToolbarOpen(true)}>
          <Wand2 className="h-6 w-6" />
          <span className="sr-only">Abrir Ferramentas</span>
        </Button>
      </div>
      
      {/* Painel Deslizante para a Barra de Ferramentas Mobile */}
      <Sheet open={isToolbarOpen} onOpenChange={setIsToolbarOpen}>
        <SheetContent side="bottom" className="md:hidden h-[90vh] flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-center">Ferramentas de Edição</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
             <MobileToolbar
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              scale={scale}
              setScale={setScale}
              bgColor={bgColor}
              setBgColor={setBgColor}
              fgColor={fgColor}
              setFgColor={setFgColor}
              onClose={() => setIsToolbarOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
