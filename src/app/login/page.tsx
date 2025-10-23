
"use client";

import { Feather, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, linkWithPopup } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário já está logado com uma conta não-anônima, redireciona.
    if (!isUserLoading && user && !user.isAnonymous) {
      router.replace('/frases');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    
    try {
      if (user && user.isAnonymous) {
        // Se o usuário é anônimo, vincula a conta Google à conta anônima.
        await linkWithPopup(user, provider);
        toast({
          title: "Conta Vinculada!",
          description: "Sua conta anônima agora está conectada com o Google.",
        });
      } else {
        // Caso contrário, faz o login normalmente.
        await signInWithPopup(auth, provider);
        toast({
          title: "Bem-vindo(a)!",
          description: "Login realizado com sucesso.",
        });
      }
      router.push('/frases'); // Redireciona após o sucesso
    } catch (error: any) {
      console.error("Erro no login com Google:", error);
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: error.code === 'auth/credential-already-in-use' 
            ? "Esta conta Google já está em uso. Tente fazer logout primeiro."
            : error.message || "Não foi possível fazer login com o Google.",
      });
    }
  };
  
  if (isUserLoading) {
     return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
             <div className="animate-pulse">
                <Feather className="h-20 w-20 text-primary" />
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
                Carregando...
            </p>
        </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
      <div className="flex flex-col items-center gap-6">
        <Feather className="h-16 w-16 text-primary" />
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold text-foreground md:text-5xl">
            Acesse sua Conta
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
            Faça login com Google para salvar seus projetos e favoritos.
            </p>
        </div>

        <Button size="lg" onClick={handleGoogleSignIn}>
          <Chrome className="mr-2 h-5 w-5" />
          Entrar com Google
        </Button>
      </div>
    </div>
  );
}
