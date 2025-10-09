import { Suspense } from 'react';
import ModelosClient from './modelos-client';

export default function ModelosPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ModelosClient />
    </Suspense>
  );
}
