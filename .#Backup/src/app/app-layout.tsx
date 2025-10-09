
"use client";

import React, { useEffect } from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';
import { useGoogleFonts } from "@/hooks/use-google-fonts";
import { PushNotifications } from '@capacitor/push-notifications';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  
  // Carrega e injeta as fontes do Google para evitar problemas de CORS
  useGoogleFonts();

  useEffect(() => {
    const registerForPushNotifications = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.error('User denied push notification permission.');
        return;
      }

      await PushNotifications.register();
    };

    registerForPushNotifications();
  }, []);

  if (isEditorPage) {
     return (
        <EditorProvider>
            <div className="flex flex-col h-full">
                <EditorHeader />
                <div className="flex-1 flex flex-col min-h-0">
                    {children}
                </div>
            </div>
        </EditorProvider>
     )
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}
