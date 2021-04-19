export type AvailabilityIndicator = 'low' | 'medium' | 'high' | 'none';
export interface ProductAndAvailability extends Product {
    potential_availability: number;
}
export interface Product {
    name: string;
    contain_articles: ProductArticle[]
}
export interface ProductArticle {
    art_id: string;
    amount_of: number;
}
export interface DetailedProduct {
    name: string;
    potential_availability: number;
    contain_articles:  DetailedProductComponent[]
}

export interface DetailedProductComponent extends InventoryItem{
    amount_of: number;
}
export interface InventoryDictionary {
    [Key: string]: { name: string; stock: number};
}
export interface InventoryItem {
    art_id: string;
    name: string;
    stock: number;
}
export interface Inventory {
    inventory: InventoryItem[];
}

export interface CreateNewProduct {
    productName: string;
    containArticles: {art_id: string; amount_of: number | null}[]
}
