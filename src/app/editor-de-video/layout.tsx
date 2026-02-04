'use client';

import { EditorProvider } from '@/app/editor-de-video/contexts/editor-context';
import { FirebaseClientProvider } from '@/firebase';
import { useGoogleFonts } from '@/hooks/use-google-fonts';

// O layout específico para o editor de vídeo.
export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useGoogleFonts();

  return (
    <FirebaseClientProvider>
      <EditorProvider>
        <div className="h-full flex flex-col bg-background">{children}</div>
      </EditorProvider>
    </FirebaseClientProvider>
  );
}
