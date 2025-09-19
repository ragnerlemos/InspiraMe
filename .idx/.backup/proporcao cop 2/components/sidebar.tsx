// src/app/editor-de-video/modulos-editor/proporcao/components/sidebar.tsx
"use client";

import { Wand2 } from "lucide-react";
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

interface SidebarProps {
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    scale: number;
    setScale: (scale: number) => void;
    bgColor: string;
    setBgColor: (color: string) => void;
    fgColor: string;
    setFgColor: (color: string) => void;
}

export function Sidebar({
    aspectRatio,
    setAspectRatio,
    scale,
    setScale,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
}: SidebarProps) {
    return (
        <aside className="hidden w-72 shrink-0 bg-card p-6 md:flex md:flex-col md:border-r">
            <div className="flex items-center gap-3">
                <Wand2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline">Aspect Weaver</h1>
            </div>

            <div className="mt-8 space-y-8">
                {/* Proporção */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        PROPORÇÃO DA TELA
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {aspectRatios.map((ratio) => (
                            <Button
                                key={ratio.value}
                                onClick={() => setAspectRatio(ratio.value)}
                                variant={
                                    aspectRatio === ratio.value ? "default" : "outline"
                                }
                                className="shrink-0"
                                size="sm"
                            >
                                {ratio.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Escala */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            ESCALA DO CANVAS
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
                     <div className="grid grid-cols-3 gap-1">
                        {[1, 1.1, 1.2].map((value) => (
                            <Button
                                key={value}
                                onClick={() => setScale(value)}
                                variant={scale === value ? "default" : "outline"}
                                size="sm"
                            >
                                {Math.round(value * 100)}%
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Cores */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        CORES
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="bg-color">Fundo</Label>
                            <input
                                id="bg-color"
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-full h-10 p-1 bg-background border rounded-md cursor-pointer"
                                aria-label="Seletor de cor do fundo"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="fg-color">Primeiro Plano</Label>
                            <input
                                id="fg-color"
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