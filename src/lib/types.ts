export interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
    sheetName: string; 
}

export interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

export interface SheetHierarchy {
  [sheetName: string]: CategoriesHierarchy;
}
