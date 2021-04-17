import path from 'path';
import { getFile, partialStringMatch } from '../helpers/db';
import { Inventory, InventoryItem, Product, Products } from './types';
const inventoryFilePath = path.resolve('./src/db/inventory.json');
const productsFilePath = path.resolve('./src/db/products.json');

export type DbType = 'fake' | 'real' | undefined;

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
    private async allProducts(): Promise<Product[]> {
        const parsedProducts = await getFile(productsFilePath) as Products;
        if(parsedProducts.products) {
            return parsedProducts.products;
        }
        return [];
    }

    private async allInventory(): Promise<InventoryItem[]> {
        const parsedInventory = await getFile(inventoryFilePath) as Inventory;
        if(parsedInventory.inventory) {
            return parsedInventory.inventory;
        }
        return [];
    }

    public async getAllInventory(): Promise<InventoryItem[]> {
        return this.allInventory();
    }

    public async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
        const allInventory = await this.allInventory()
        return allInventory.find(inventoryItem => inventoryItem.art_id === id);
    }

    public async getInventoryArticlesByName(str: string): Promise<InventoryItem[]> {
        const allInventory = await this.allInventory();
        const strMatchesArticleName = partialStringMatch(str);
        const searchResults = allInventory.filter(inventoryItem => strMatchesArticleName(inventoryItem.name));
        return searchResults;
    }

    public async getAllProducts(): Promise<Product[]> {
        return this.allProducts() || [];
    }

    public async getProductWithProductName(productName: string): Promise<Product[]> {
        const allProducts = await this.allProducts();
        const strMatchesProductName = partialStringMatch(productName);
        return allProducts.filter(product => strMatchesProductName(product.name));
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
    public async getProductWithProductName(productName: string): Promise<Product[]> {
        return []
    }
}

