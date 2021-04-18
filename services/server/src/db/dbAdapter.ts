import { getProductsAndAvailability, partialStringMatch } from '../helpers/db';
import { DbType, InventoryDictionary, InventoryItem, Product, ProductAndAvailability, ProductArticle} from '../types/types';
import { inMemoryInventory, inMemoryProducts, insertNewProductInMemoryProduct } from './connect';

export class DB {
    constructor() {}
    public useDb(dbType: DbType = 'fake') {
        switch(dbType) {
            case 'fake':
                return new FakeDb();
            case 'real':
                return new RealDb();
        }
    }
}

class FakeDb {
    constructor() {}
    
    public async getAllInventory(): Promise<InventoryDictionary> {
        return inMemoryInventory;
    }

    public async getInventoryItemById(id: string): Promise<{name: string; stock: number}> {
        return inMemoryInventory[id];
    }

    public async getInventoryArticlesByName(str: string): Promise<InventoryItem[]> {
        const strMatchesArticleName = partialStringMatch(str);
        let inventoryArr: InventoryItem[] = [];
        for(const key in inMemoryInventory) {
            inventoryArr = [...inventoryArr, {art_id: key, ...inMemoryInventory[key]}];
        }
        const searchResults = inventoryArr.filter(inventoryItem => strMatchesArticleName(inventoryItem.name));
        return searchResults;
    }

    public async getAllProducts(): Promise<Product[]> {
        return inMemoryProducts;
    }

    public async getProductsWithPartialProductName(productName: string): Promise<Product[]> {
        const strMatchesProductName = partialStringMatch(productName);
        return inMemoryProducts.filter(product => strMatchesProductName(product.name));
    }

    public async getProductWithProductName(productName: string): Promise<Product | undefined> {
        return inMemoryProducts.find(product => product.name.toLowerCase() === productName.toLowerCase());
    }

    public async buyProduct(productName: string, amount: number): Promise<'OK' | undefined> {
        const productThatMatchesQuery = await this.getProductWithProductName(productName);
        if(productThatMatchesQuery) {
            const productAndAvailability: ProductAndAvailability =  getProductsAndAvailability(productThatMatchesQuery);
            if(productAndAvailability.potential_availability >= amount) {
                for(const article of productAndAvailability.contain_articles) {
                    inMemoryInventory[article.art_id].stock = inMemoryInventory[article.art_id].stock - article.amount_of;
                }
                return 'OK';
            } else {
                return;
            }
        }
    }
    public async createNewProduct(productName: string, containArticles: ProductArticle[]): Promise<'OK' | undefined> {
        let temporaryProductContainArticles: ProductArticle[] = [];
        for(const article of (containArticles as ProductArticle[])) {
            if(!inMemoryInventory[article.art_id] || !article.amount_of) {
                temporaryProductContainArticles = [];
                return;
            }
            if(temporaryProductContainArticles.filter(x => x.art_id === article.art_id).length === 0) {
                temporaryProductContainArticles = [...temporaryProductContainArticles, article]
            }
        }
        const newProduct = {name: productName, contain_articles: temporaryProductContainArticles};
        return insertNewProductInMemoryProduct(newProduct);
    }
}

class RealDb {
    constructor() {}
    public async getAllInventory(): Promise<InventoryItem[]> {
        return [];
    }
    public async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
        return;
    }
    public async getInventoryArticlesByName(str: string): Promise<InventoryItem[]> {
        return [];
    }
    public async getAllProducts(): Promise<Product[]> {
        return [];
    }
    public async getProductsWithPartialProductName(productName: string): Promise<Product[]> {
        return [];
    }
    public async getProductWithProductName(productName: string): Promise<Product | undefined> {
        return;
    }
    public async buyProduct(productName: string, amount: number): Promise<'OK' | undefined> {
        return;
    }
    public async createNewProduct(productName: string, containArticles: ProductArticle[]): Promise<'OK' | undefined> {
        return;
    }
}

