import { Suspense } from 'react';
import EditorClient from './editor-client';

export default function EditorPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <EditorClient />
    </Suspense>
  );
}
