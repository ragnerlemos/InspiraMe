
import { getSheetData, getAllQuotes } from '@/lib/dados';
import { FrasesClientPage } from './frases/frases-client';

// This is a Server Component that fetches the initial data.
// It CANNOT use searchParams because the app is configured for static export.
export default async function FrasesPage() {
  
  // Fetch all quotes and categories at build time.
  // The client component will handle all the dynamic filtering.
  const allQuotes = await getAllQuotes();
  // Usa getSheetData para obter a hierarquia completa
  const sheetData = await getSheetData();

  // Extrai as categorias principais e a hierarquia
  const mainCategories = ['Todos'];
  const categories: { [mainCategory: string]: string[] } = {};

  for (const sheetName in sheetData) {
      for (const mainCat in sheetData[sheetName]) {
          if (!mainCategories.includes(mainCat)) {
              mainCategories.push(mainCat);
          }
          if (!categories[mainCat]) {
              categories[mainCat] = [];
          }
          categories[mainCat] = [...new Set([...categories[mainCat], ...sheetData[sheetName][mainCat]])];
      }
  }

  return (
    <FrasesClientPage
      initialQuotes={allQuotes}
      initialMainCategories={mainCategories}
      initialSubCategories={categories}
    />
  );
}
