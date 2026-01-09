
// Definição da estrutura de uma citação
export interface Quote {
    id: number;
    text: string;
    author: string;
    main_category: string;
    sub_category: string;
  }
  
  // Definição da hierarquia de categorias
  export interface CategoriesHierarchy {
    [mainCategory: string]: string[];
  }
  