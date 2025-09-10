
// src/app/editor-de-video/modulos-editor/proporcao/components/mobile-toolbar.tsx
"use client";

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
    onClose: () => void;
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
}: MobileToolbarProps) {
    return (
        <div className="p-4 space-y-8 h-full flex flex-col">
            <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    PROPORÇÃO DA TELA
                </h2>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {aspectRatios.map((ratio) => (
                        <Button
                            key={ratio.value}
                            onClick={() => setAspectRatio(ratio.value)}
                            variant={
                                aspectRatio === ratio.value ? "default" : "outline"
                            }
                            className="shrink-0"
                        >
                            {ratio.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Escala (MOBILE) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        ESCALA DO CANVAS
                    </h2>
                    <span className="text-sm font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {[1, 1.1, 1.2].map((value) => (
                        <Button
                            key={value}
                            onClick={() => setScale(value)}
                            variant={scale === value ? "default" : "outline"}
                            className="shrink-0"
                        >
                            {Math.round(value * 100)}%
                        </Button>
                    ))}
                </div>
                <Slider
                    value={[scale]}
                    onValueChange={(values) => setScale(values[0])}
                    min={0.5}
                    max={2}
                    step={0.01}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    CORES
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bg-color-mobile">Fundo</Label>
                        <div className="relative h-10 w-full overflow-hidden rounded-md border">
                            <div
                                className="h-full w-full"
                                style={{ backgroundColor: bgColor }}
                            />
                            <input
                                id="bg-color-mobile"
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                aria-label="Seletor de cor do fundo"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fg-color-mobile">Primeiro Plano</Label>
                        <div className="relative h-10 w-full overflow-hidden rounded-md border">
                            <div
                                className="h-full w-full"
                                style={{ backgroundColor: fgColor }}
                            />
                            <input
                                id="fg-color-mobile"
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                aria-label="Seletor de cor do primeiro plano"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
