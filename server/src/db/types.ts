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

export interface Products {
    products: Product[];
}
export interface Inventory {
    inventory: InventoryItem[];
}