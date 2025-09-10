
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";


export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
        
        <div className="hidden md:flex h-full">
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
        </div>

        <div className="flex flex-col w-full h-full min-h-0">
            <main className="flex-1 w-full h-full flex flex-col items-center justify-center overflow-auto p-4">
              <PreviewCanva 
                aspectRatio={aspectRatio}
                bgColor={bgColor}
                fgColor={fgColor}
                scale={scale}
              />
            </main>

            {/* Botão flutuante para abrir o menu no mobile */}
            <div className="md:hidden absolute bottom-4 right-4 z-20">
                <Sheet open={isToolbarOpen} onOpenChange={setIsToolbarOpen}>
                    <SheetTrigger asChild>
                         <Button size="icon" className="rounded-full w-14 h-14 shadow-lg">
                            <Settings2 className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] flex flex-col">
                        <SheetHeader className="text-left">
                            <SheetTitle>Controles de Edição</SheetTitle>
                            <SheetDescription>
                                Ajuste a proporção, escala e cores do seu canvas.
                            </SheetDescription>
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
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>

      </div>
    </div>
  );
}
