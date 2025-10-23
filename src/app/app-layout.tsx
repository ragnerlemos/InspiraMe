
"use client";

import React, { useEffect } from "react";
import { usePathname } from 'next/navigation';
import { AppHeader } from './cabecalho-app';
import { useGoogleFonts } from "@/hooks/use-google-fonts";
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { useUser, useAuth } from "@/firebase";
import { signInAnonymously } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";

function AuthLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="mt-8 h-10 w-64" />
        <Skeleton className="mt-4 h-5 w-80" />
    </div>
  );
}

// Componente de layout que gerencia qual cabeçalho exibir e protege as rotas.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  
  // Carrega e injeta as fontes do Google para evitar problemas de CORS
  useGoogleFonts();

  useEffect(() => {
    // Se não está carregando, não tem usuário, e o auth está pronto, faz o login anônimo.
    if (!isUserLoading && !user && auth) {
      signInAnonymously(auth).catch((error) => {
        console.error("Erro no login anônimo:", error);
      });
    }
  }, [user, isUserLoading, auth]);

  // Enquanto carrega o estado de autenticação inicial, exibe uma tela de loading.
  if (isUserLoading) {
    return <AuthLoading />;
  }

  return (
    <EditorProvider>
        <div className="flex flex-col h-full">
            {!isEditorPage && <AppHeader />}
            <div className="flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    </EditorProvider>
  );
}
