
import { getCategories, getAllQuotes } from '@/lib/dados';
import { FrasesClientPage } from './frases-client';

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

// Componente de Servidor: Busca os dados iniciais antes de renderizar a página.
export default async function FrasesPage() {
  const allQuotes = await getAllQuotes();
  const categories = await getCategories();

  // Transforma o objeto de categorias em um array para o cliente.
  const mainCategories = ['Todos', ...Object.keys(categories)];
  const subCategories: CategoriesHierarchy = {};
  for(const cat in categories) {
    subCategories[cat] = categories[cat];
  }

  return (
    <FrasesClientPage
      initialQuotes={allQuotes}
      initialMainCategories={mainCategories}
      initialSubCategories={subCategories}
    />
  );
}
