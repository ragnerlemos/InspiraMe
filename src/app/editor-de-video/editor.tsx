
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEditor } from './contexts/editor-context';
import { useProjects } from '@/hooks/use-projects';
import { useTemplates } from '@/hooks/use-templates';
import { useProfile } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, PanelResizeHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, Film, Download, Image as ImageIcon, ChevronLeft, Loader2, PlusCircle, Sparkles, SlidersHorizontal, User, BadgePercent } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { nanoid } from 'nanoid';
import * as htmlToImage from 'html-to-image';
import { cn } from '@/lib/utils';
import type { EditorState } from './tipos';
import type { QuoteWithAuthor } from '@/lib/types';
import { ModeloTwitter } from './modelos/modelo-twitter';
import { AssinaturaPerfil } from './modelos/assinatura-perfil';

// Lista de fontes disponíveis no editor
const fontOptions = ["Poppins", "PT Sans", "Merriweather", "Lobster"];
// Lista de proporções de vídeo
const aspectRatios = ["9 / 16", "16 / 9", "1 / 1", "4 / 5"];

// O componente principal do editor de vídeo
export function Editor({ allQuotes }: { allQuotes: QuoteWithAuthor[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { editorState, setEditorState } = useEditor();
    const { projects, addProject, updateProject } = useProjects();
    const { templates, addTemplate } = useTemplates();
    const { profile } = useProfile();
    const { toast } = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [projectName, setProjectName] = useState("Meu Projeto de Vídeo");
    const [templateName, setTemplateName] = useState("Meu Modelo");
    const [isMounted, setIsMounted] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);
    const projectId = searchParams.get('projectId');
    const templateId = searchParams.get('templateId');
    const quoteParam = searchParams.get('quote');

    // Carrega o estado do editor a partir de um projeto, modelo ou parâmetros da URL.
    useEffect(() => {
        if (projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                setEditorState(project.editorState);
                setProjectName(project.name);
            }
        } else if (templateId) {
            const template = templates.find(t => t.id === templateId);
            if (template) {
                setEditorState(prevState => ({ ...prevState, ...template.editorState, activeTemplateId: template.id }));
            }
        }
        if (quoteParam) {
            setEditorState(prevState => ({ ...prevState, text: decodeURIComponent(quoteParam) }));
        }
        setIsMounted(true);
    }, [projectId, templateId, quoteParam, projects, templates, setEditorState]);

    const handleStateChange = (key: keyof EditorState, value: any) => {
        setEditorState(prevState => ({ ...prevState, [key]: value }));
    };

    const handleExport = async () => {
        if (!previewRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await htmlToImage.toPng(previewRef.current, { pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `${projectName.replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
            toast({ title: 'Exportado com sucesso!', description: 'Sua imagem foi salva como PNG.' });
        } catch (error) {
            console.error('Erro ao exportar:', error);
            toast({ variant: 'destructive', title: 'Erro ao exportar', description: 'Não foi possível gerar a imagem.' });
        } finally {
            setIsExporting(false);
        }
    };

    const handleSaveProject = async () => {
        if (!previewRef.current) return;
        setIsSaving(true);
        try {
            const thumbnail = await htmlToImage.toPng(previewRef.current, { pixelRatio: 0.5 });
            if (projectId) {
                updateProject(projectId, editorState, thumbnail);
                toast({ title: 'Projeto atualizado!', description: `"${projectName}" foi salvo com sucesso.` });
            } else {
                const newId = addProject({ name: projectName, editorState, thumbnail });
                toast({ title: 'Projeto salvo!', description: `"${projectName}" foi salvo.` });
                router.replace(`/editor-de-video?projectId=${newId}`);
            }
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            toast({ variant: 'destructive', title: 'Erro ao salvar', description: 'Não foi possível salvar o projeto.' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleSaveTemplate = async () => {
        if (!previewRef.current) return;
        setIsSaving(true);
        try {
            const thumbnail = await htmlToImage.toPng(previewRef.current, { pixelRatio: 0.5 });
            addTemplate(templateName, editorState, thumbnail);
            toast({ title: 'Modelo salvo!', description: `O modelo "${templateName}" foi adicionado à sua galeria.` });
        } catch (error) {
            console.error('Erro ao salvar modelo:', error);
            toast({ variant: 'destructive', title: 'Erro ao salvar', description: 'Não foi possível salvar o modelo.' });
        } finally {
            setIsSaving(false);
        }
    }
    
    const getRandomQuote = () => {
        const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
        if (randomQuote) {
            setEditorState(prevState => ({ ...prevState, text: randomQuote.quote }));
        }
    };

    const baseTextStyle = useMemo(() => ({
        fontFamily: editorState.fontFamily,
        fontSize: `${editorState.fontSize}cqw`,
        fontWeight: editorState.fontWeight,
        fontStyle: editorState.fontStyle,
        color: editorState.textColor,
        textAlign: editorState.textAlign,
        letterSpacing: `${editorState.letterSpacing}em`,
        wordSpacing: `${editorState.wordSpacing}em`,
        lineHeight: editorState.lineHeight,
        textShadow: `0 0 ${editorState.textShadowBlur}px ${editorState.textColor}${Math.round(editorState.textShadowOpacity * 255).toString(16).padStart(2, '0')}`,
        WebkitTextStroke: `${editorState.textStrokeWidth}px ${editorState.textStrokeColor}`,
        paintOrder: 'stroke fill',
    }), [editorState]);

    const backgroundStyle = useMemo(() => {
        if (editorState.backgroundStyle.type === 'solid') {
            return { backgroundColor: editorState.backgroundStyle.value };
        }
        return { backgroundImage: `url(${editorState.backgroundStyle.value})` };
    }, [editorState.backgroundStyle]);

    if (!isMounted) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col bg-background">
            {/* Cabeçalho */}
            <header className="flex items-center justify-between p-2 border-b gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
                <div className="flex-1">
                    <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="text-center font-bold" />
                </div>
                <div className="flex items-center gap-2">
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" disabled={isSaving}><PlusCircle className="mr-2 h-4 w-4"/> Salvar como Modelo</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                             <div className="space-y-4">
                                <Label htmlFor="template-name">Nome do Modelo</Label>
                                <Input id="template-name" value={templateName} onChange={e => setTemplateName(e.target.value)} />
                                <Button onClick={handleSaveTemplate} className="w-full" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                                    Confirmar
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button size="sm" onClick={handleSaveProject} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                        {projectId ? "Atualizar" : "Salvar"}
                    </Button>
                    <Button size="sm" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />}
                        Exportar
                    </Button>
                </div>
            </header>

            {/* Corpo Principal */}
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                {/* Painel de Controles */}
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                    <Tabs defaultValue="text" className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="text"><SlidersHorizontal /></TabsTrigger>
                            <TabsTrigger value="background"><ImageIcon /></TabsTrigger>
                            <TabsTrigger value="signature"><User /></TabsTrigger>
                            <TabsTrigger value="logo"><BadgePercent /></TabsTrigger>
                            <TabsTrigger value="format"><Film /></TabsTrigger>
                        </TabsList>
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                <TabsContent value="text">
                                    <Card>
                                        <CardHeader><CardTitle>Texto</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <Textarea value={editorState.text} onChange={(e) => handleStateChange('text', e.target.value)} rows={5} placeholder="Sua frase..." />
                                            <Button variant="outline" size="sm" onClick={getRandomQuote} className="w-full"><Sparkles className="mr-2 h-4 w-4" />Frase Aleatória</Button>
                                            <div className="flex items-center gap-2">
                                                <Input type="color" value={editorState.textColor} onChange={(e) => handleStateChange('textColor', e.target.value)} className="p-1 h-10" />
                                                <Input value={editorState.textColor} onChange={(e) => handleStateChange('textColor', e.target.value)} />
                                            </div>
                                            <Select value={editorState.fontFamily} onValueChange={(v) => handleStateChange('fontFamily', v)}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>{fontOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Select value={editorState.fontWeight} onValueChange={(v) => handleStateChange('fontWeight', v)}>
                                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                                    <SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="bold">Negrito</SelectItem></SelectContent>
                                                </Select>
                                                <Select value={editorState.fontStyle} onValueChange={(v) => handleStateChange('fontStyle', v)}>
                                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                                    <SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="italic">Itálico</SelectItem></SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="background">
                                     <Card>
                                        <CardHeader><CardTitle>Fundo</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                             <Label>Cor Sólida</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="color" value={editorState.backgroundStyle.type === 'solid' ? editorState.backgroundStyle.value : '#000000'} onChange={(e) => handleStateChange('backgroundStyle', {type: 'solid', value: e.target.value})} className="p-1 h-10" />
                                                <Input value={editorState.backgroundStyle.type === 'solid' ? editorState.backgroundStyle.value : '#000000'} onChange={(e) => handleStateChange('backgroundStyle', {type: 'solid', value: e.target.value})} />
                                            </div>
                                            <Label>Imagem (URL)</Label>
                                             <Input placeholder="Cole o URL da imagem aqui" value={editorState.backgroundStyle.type === 'media' ? editorState.backgroundStyle.value : ''} onChange={e => handleStateChange('backgroundStyle', {type: 'media', value: e.target.value})} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="signature">
                                    <Card>
                                        <CardHeader><CardTitle>Assinatura</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between"><Label>Mostrar assinatura</Label><Switch checked={editorState.showProfileSignature} onCheckedChange={v => handleStateChange('showProfileSignature', v)} /></div>
                                            <div className="flex items-center justify-between"><Label>Mostrar foto</Label><Switch checked={editorState.showSignaturePhoto} onCheckedChange={v => handleStateChange('showSignaturePhoto', v)} /></div>
                                            <div className="flex items-center justify-between"><Label>Mostrar nome</Label><Switch checked={editorState.showSignatureUsername} onCheckedChange={v => handleStateChange('showSignatureUsername', v)} /></div>
                                            <div className="flex items-center justify-between"><Label>Mostrar @social</Label><Switch checked={editorState.showSignatureSocial} onCheckedChange={v => handleStateChange('showSignatureSocial', v)} /></div>
                                            <div className="flex items-center justify-between"><Label>Fundo da assinatura</Label><Switch checked={editorState.showSignatureBackground} onCheckedChange={v => handleStateChange('showSignatureBackground', v)} /></div>
                                            <Label>Posição Y ({editorState.signaturePositionY}%)</Label><Slider value={[editorState.signaturePositionY]} onValueChange={v => handleStateChange('signaturePositionY', v[0])} />
                                            <Label>Escala ({editorState.signatureScale}%)</Label><Slider value={[editorState.signatureScale]} onValueChange={v => handleStateChange('signatureScale', v[0])} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="logo">
                                    <Card>
                                        <CardHeader><CardTitle>Logomarca</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between"><Label>Mostrar logomarca</Label><Switch checked={editorState.showLogo} onCheckedChange={v => handleStateChange('showLogo', v)} disabled={!profile.logo} /></div>
                                            <Label>Posição Y ({editorState.logoPositionY}%)</Label><Slider value={[editorState.logoPositionY]} onValueChange={v => handleStateChange('logoPositionY', v[0])} />
                                            <Label>Escala ({editorState.logoScale}%)</Label><Slider value={[editorState.logoScale]} onValueChange={v => handleStateChange('logoScale', v[0])} />
                                            <Label>Opacidade ({editorState.logoOpacity}%)</Label><Slider value={[editorState.logoOpacity]} onValueChange={v => handleStateChange('logoOpacity', v[0])} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                 <TabsContent value="format">
                                    <Card>
                                        <CardHeader><CardTitle>Formato</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <Label>Proporção</Label>
                                            <Select value={editorState.aspectRatio} onValueChange={(v) => handleStateChange('aspectRatio', v)}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>{aspectRatios.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </div>
                        </ScrollArea>
                    </Tabs>
                </ResizablePanel>
                <PanelResizeHandle />
                {/* Painel de Pré-visualização */}
                <ResizablePanel defaultSize={75}>
                    <div className="h-full flex items-center justify-center p-4 bg-muted/20">
                        <div ref={previewRef} className={cn("relative overflow-hidden bg-background shadow-lg container-snap", editorState.activeTemplateId === 'template-default' && 'flex items-center justify-center p-8')} style={{ ...backgroundStyle, aspectRatio: editorState.aspectRatio.replace(/\s/g, '') }}>
                             {/* Camada de película */}
                            <div className="absolute inset-0" style={{ backgroundColor: editorState.filmColor, opacity: editorState.filmOpacity / 100, pointerEvents: 'none' }} />
                            
                            {/* Conteúdo Principal */}
                            {editorState.activeTemplateId === 'template-twitter' ? (
                                <ModeloTwitter editorState={editorState} profile={profile} baseTextStyle={baseTextStyle} textEffectsStyle={{}} dropShadowStyle={{}} />
                            ) : (
                                <div className="w-full" style={{ top: `${editorState.textVerticalPosition}%`, transform: 'translateY(-50%)', position: 'absolute'}}>
                                    <p className="whitespace-pre-wrap" style={baseTextStyle}>{editorState.text}</p>
                                </div>
                            )}

                             {/* Assinatura */}
                            {editorState.showProfileSignature && (
                                <div className="absolute" style={{ left: `${editorState.signaturePositionX}%`, top: `${editorState.signaturePositionY}%`, transform: `translate(-50%, -50%) scale(${editorState.signatureScale / 100})` }}>
                                    <AssinaturaPerfil 
                                        profile={profile} 
                                        showPhoto={editorState.showSignaturePhoto}
                                        showUsername={editorState.showSignatureUsername}
                                        showSocial={editorState.showSignatureSocial}
                                        showBackground={editorState.showSignatureBackground}
                                        bgColor={editorState.signatureBgColor}
                                        bgOpacity={editorState.signatureBgOpacity}
                                    />
                                </div>
                            )}
                             {/* Logo */}
                            {editorState.showLogo && profile.logo && (
                                <div className="absolute" style={{ left: `${editorState.logoPositionX}%`, top: `${editorState.logoPositionY}%`, transform: 'translate(-50%, -50%)', opacity: editorState.logoOpacity / 100 }}>
                                    <img src={profile.logo} alt="Logomarca" style={{ width: `${editorState.logoScale * 2}px` }} />
                                </div>
                            )}
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
