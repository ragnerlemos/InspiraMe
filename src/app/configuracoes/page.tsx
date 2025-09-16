
"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Laptop, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Página de configurações para o usuário.
export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const { toast } = useToast();

  const handleClearCache = () => {
    try {
      const keysToClear = [
        'quotevid_favorites',
        'quotevid_profile',
        'quotevid_templates',
        'quotevid_gallery_categories',
        'quotevid_gallery_media_items',
        'quotevid_gallery_selected_category',
        'quotevid_my_videos'
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "Cache Limpo!",
        description: "Os dados do aplicativo foram removidos. A página será recarregada.",
      });

      // Recarrega a página para refletir o estado limpo
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao limpar o cache",
        description: "Não foi possível remover os dados armazenados.",
      });
      console.error("Failed to clear cache:", error);
    }
  };


  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Personalize a aparência e o comportamento do aplicativo.
          </p>
        </div>
        <div className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                Escolha como o QuoteVid deve aparecer para você.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                <Button
                    variant={theme === "light" ? "secondary" : "outline"}
                    onClick={() => setTheme("light")}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    Claro
                </Button>
                <Button
                    variant={theme === "dark" ? "secondary" : "outline"}
                    onClick={() => setTheme("dark")}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    Escuro
                </Button>
                <Button
                    variant={theme === "system" ? "secondary" : "outline"}
                    onClick={() => setTheme("system")}
                >
                    <Laptop className="mr-2 h-4 w-4" />
                    Sistema
                </Button>
                </div>
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Dados</CardTitle>
                    <CardDescription>
                    Ações relacionadas aos seus dados salvos no navegador.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Limpar Cache do Aplicativo
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso irá apagar permanentemente
                                    seu perfil, favoritos, modelos personalizados e galeria do seu navegador.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearCache}>
                                    Sim, limpar tudo
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-sm text-muted-foreground mt-3">
                        Use esta opção se estiver com problemas ou quiser recomeçar do zero.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  )
}
