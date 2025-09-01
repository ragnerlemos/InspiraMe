"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Download,
  Palette,
  Share2,
  Sparkles,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { quotes, templates } from "@/lib/data";
import { suggestFontsAndColors } from "@/ai/flows/suggest-fonts-and-colors";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function EditorClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("Poppins");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [textShadow, setTextShadow] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const quoteParam = searchParams.get("quote");
    const templateIdParam = searchParams.get("templateId");
    
    if (quoteParam) {
      setText(decodeURIComponent(quoteParam));
    } else if (!templateIdParam) {
      setText(quotes[0].text);
    }
    
    if (templateIdParam) {
      const template = templates.find(t => t.id === parseInt(templateIdParam));
      if (template) {
        setBackgroundImage(template.imageUrl);
        setAspectRatio(template.aspectRatio);
        if (!quoteParam) setText(quotes[Math.floor(Math.random() * quotes.length)].text);
      }
    } else {
        setBackgroundImage(templates[0].imageUrl);
        setAspectRatio("9:16");
    }
    setIsReady(true);
  }, [searchParams]);

  const handleAiSuggestion = async () => {
    setIsAiLoading(true);
    try {
      const result = await suggestFontsAndColors({
        textStyle: "modern", 
        videoTheme: "inspirational",
      });
      
      const availableFonts = ["Poppins", "PT Sans", "Merriweather", "Lobster"];
      const suggestedFont = result.suggestedFont.split(',')[0].trim();
      const fontToUse = availableFonts.find(f => f.toLowerCase() === suggestedFont.toLowerCase()) || availableFonts[Math.floor(Math.random() * availableFonts.length)];
      
      setFontFamily(fontToUse);
      setTextColor(result.suggestedColor);
      toast({
        title: "AI Suggestions Applied!",
        description: `Font set to ${fontToUse} and color to ${result.suggestedColor}.`,
      });
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not get suggestions. Please try again.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const aspectRatios = {
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-[16/9]",
  };

  const textStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    color: textColor,
    textAlign: textAlign,
    textShadow: textShadow ? "2px 2px 8px rgba(0,0,0,0.8)" : "none",
    lineHeight: 1.3,
  };
  
  if (!isReady) {
     return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20 rounded-full" />
                        <Skeleton className="h-10 w-20 rounded-full" />
                        <Skeleton className="h-10 w-20 rounded-full" />
                    </div>
                    <Skeleton className="w-full max-w-2xl aspect-[9/16] rounded-lg" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="w-full h-[700px] rounded-lg" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center gap-4">
          <div className="flex gap-2 bg-background/50 backdrop-blur-sm p-2 rounded-full border">
            {Object.keys(aspectRatios).map((ar) => (
              <Button
                key={ar}
                variant={aspectRatio === ar ? "default" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => setAspectRatio(ar)}
              >
                {ar}
              </Button>
            ))}
          </div>
          <div className={cn("relative w-full max-w-2xl bg-muted rounded-lg overflow-hidden shadow-2xl", aspectRatios[aspectRatio as keyof typeof aspectRatios])}>
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              className="object-cover"
              key={backgroundImage}
              data-ai-hint="background scenery"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/10">
              <div style={textStyle} className="break-words">
                {text}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                Customise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text"><Type className="mr-2 h-4 w-4"/>Text</TabsTrigger>
                  <TabsTrigger value="style"><Palette className="mr-2 h-4 w-4"/>Style</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="text-input">Quote Text</Label>
                        <Textarea
                        id="text-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="style" className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="PT Sans">PT Sans</SelectItem>
                        <SelectItem value="Merriweather">Merriweather</SelectItem>
                        <SelectItem value="Lobster">Lobster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="font-size">Font Size</Label>
                        <span className="text-sm text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      id="font-size"
                      min={12}
                      max={128}
                      step={1}
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                     <div className="flex items-center gap-2">
                      <Input
                        id="text-color"
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                           <Button variant="outline" size="icon" style={{backgroundColor: textColor}} className="h-10 w-10 border-2" />
                        </PopoverTrigger>
                         <PopoverContent className="w-auto p-0 border-none">
                           <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-16 h-16 cursor-pointer"/>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Align</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={textAlign === 'left' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('left')}><AlignLeft /></Button>
                      <Button variant={textAlign === 'center' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('center')}><AlignCenter /></Button>
                      <Button variant={textAlign === 'right' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('right')}><AlignRight /></Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label>Text Shadow</Label>
                    <Switch checked={textShadow} onCheckedChange={setTextShadow} />
                  </div>

                  <Button onClick={handleAiSuggestion} disabled={isAiLoading} className="w-full bg-accent hover:bg-accent/90">
                    {isAiLoading ? <Skeleton className="h-5 w-20 bg-accent-foreground/20" /> : <><Sparkles className="mr-2 h-4 w-4" /> Suggest with AI</>}
                  </Button>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1"><Download className="mr-2 h-4 w-4"/> Download</Button>
                <Button variant="secondary" className="flex-1"><Share2 className="mr-2 h-4 w-4"/> Share</Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
