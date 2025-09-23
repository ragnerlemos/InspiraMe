

import { getAllQuotes } from "@/lib/dados";
import { FavoritesClientPage } from './favoritos-client';
import type { QuoteWithAuthor } from "@/lib/dados";


// Componente de Servidor: Busca todos os dados necessários antes de renderizar a página do cliente.
export default async function FavoritesPage() {
  
  const allQuotes: QuoteWithAuthor[] = await getAllQuotes();

  return (
    <FavoritesClientPage allQuotes={allQuotes} />
  );
}
