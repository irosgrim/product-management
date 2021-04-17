import { getProductsAndAvailability, partialStringMatch } from '../helpers/db';
import { DbType, InventoryDictionary, InventoryItem, Product, ProductAndAvailability} from '../types/types';
import { inMemoryInventory, inMemoryProducts } from './connect';
export class DB {
    constructor() {
    }
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
}

class RealDb {
    constructor() {}
    public async getAllInventory(): Promise<InventoryItem[]> {
        return [];
    }
    public async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
        id;
        return;
    }
    public async getInventoryArticlesByName(str: string): Promise<InventoryItem[]> {
        str;
        return [];
    }
    public async getAllProducts(): Promise<Product[]> {
        
        return [];
    }
    public async getProductsWithPartialProductName(productName: string): Promise<Product[]> {
        productName;
        return []
    }
    public async getProductWithProductName(productName: string): Promise<Product | undefined> {
        productName
        return undefined;
    }
    public async buyProduct(productName: string, amount: number): Promise<'OK' | undefined> {
        productName;
        amount;
        return undefined;
    }
}

