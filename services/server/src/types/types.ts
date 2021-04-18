export interface ProductArticle {
    art_id: string;
    amount_of: number;
}

export interface InventoryItem {
    art_id: string;
    name: string;
    stock: number;
}

export interface Product {
    name: string;
    contain_articles: ProductArticle[]
}

export interface ProductAndAvailability extends Product {
    potential_availability: number;
}

export interface Products {
    products: Product[];
}
export interface Inventory {
    inventory: InventoryItem[];
}

export interface Dictionary<T> {
    [Key: string]: T;
}

export interface InventoryDictionary {
    [Key: string]: { name: string; stock: number};
}

export type DbType = 'fake' | 'real' | undefined;