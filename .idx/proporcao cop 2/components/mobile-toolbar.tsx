// src/app/editor-de-video/modulos-editor/proporcao/components/mobile-toolbar.tsx
"use client";

import { Wand2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const aspectRatios = [
    { label: "16:9", value: "16 / 9" },
    { label: "1:1", value: "1 / 1" },
    { label: "4:3", value: "4 / 3" },
    { label: "3:2", value: "3 / 2" },
    { label: "9:16", value: "9 / 16" },
    { label: "21:9", value: "21 / 9" },
];

interface MobileToolbarProps {
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    scale: number;
    setScale: (scale: number) => void;
    bgColor: string;
    setBgColor: (color: string) => void;
    fgColor: string;
    setFgColor: (color: string) => void;
    showMobileMenu: boolean;
    setShowMobileMenu: (show: boolean) => void;
}

export function MobileToolbar({
    aspectRatio,
    setAspectRatio,
    scale,
    setScale,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
    showMobileMenu,
    setShowMobileMenu,
}: MobileToolbarProps) {
    if (!showMobileMenu) {
        return (
            <div className="md:hidden fixed bottom-4 right-4 z-20">
                <Button size="icon" onClick={() => setShowMobileMenu(true)} className="rounded-full h-14 w-14 shadow-lg">
                    <Menu className="h-6 w-6" />
                </Button>
            </div>
        )
    }
    
    return (
        <aside className="md:hidden fixed bottom-0 left-0 w-full bg-card p-4 border-t z-20 animate-in slide-in-from-bottom-full duration-300">
            <div className="space-y-4">
                 <Button size="icon" onClick={() => setShowMobileMenu(false)} variant="ghost" className="absolute top-2 right-2">
                    <Wand2 className="h-5 w-5" />
                </Button>

                {/* Proporção */}
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Proporção
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {aspectRatios.map((ratio) => (
                            <Button
                                key={ratio.value}
                                onClick={() => setAspectRatio(ratio.value)}
                                variant={
                                    aspectRatio === ratio.value ? "default" : "outline"
                                }
                                size="sm"
                            >
                                {ratio.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Escala */}
                <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Escala
                        </h2>
                        <span className="text-sm font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
                    </div>
                    <Slider
                        value={[scale]}
                        onValueChange={(values) => setScale(values[0])}
                        min={0.5}
                        max={2}
                        step={0.01}
                    />
                </div>

                {/* Cores */}
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Cores
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="bg-color-mobile">Fundo</Label>
                            <input
                                id="bg-color-mobile"
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-full h-10 p-1 bg-background border rounded-md cursor-pointer"
                                aria-label="Seletor de cor do fundo"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="fg-color-mobile">Primeiro Plano</Label>
                            <input
                                id="fg-color-mobile"
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                                className="w-full h-10 p-1 bg-background border rounded-md cursor-pointer"
                                aria-label="Seletor de cor do primeiro plano"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}