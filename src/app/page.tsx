
import { HomePageClient } from '@/app/pages/page-home';
import { getQuoteData } from '@/lib/dados';

// Página principal agora é um Server Component que busca os dados antes de renderizar.
export default async function HomePage() {
  // Busca os dados da planilha no servidor.
  const { quotes, categories } = await getQuoteData();

  // Passa os dados para o componente cliente, que cuidará da interatividade.
  return <HomePageClient initialQuotes={quotes} initialCategories={categories} />;
}
