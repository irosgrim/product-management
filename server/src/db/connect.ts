import path from 'path';
import fs from 'fs';
import { DB} from './dbAdapter';
import { DbType, InventoryDictionary, Product } from '../types/types';
import { getInventoryAsDictionary } from '../helpers/db';
const inventoryFilePath = path.resolve('./src/db/inventory.json');
const productsFilePath = path.resolve('./src/db/products.json');

const typeOfDbToUse = process.env.DB_TYPE || 'fake';

export let inMemoryProducts: Product[] = [];
export let inMemoryInventory: InventoryDictionary = {};
createInMemoryDB();

export const db = new DB().useDb(typeOfDbToUse as DbType);

function createInMemoryDB() {
    if(typeOfDbToUse === 'fake') {
        const parsedProducts = fs.readFileSync(productsFilePath, 'utf8');
        const parsedInventory = fs.readFileSync(inventoryFilePath, 'utf8');
        inMemoryProducts = JSON.parse(parsedProducts).products;
        const inventory = JSON.parse(parsedInventory).inventory;
        inMemoryInventory = getInventoryAsDictionary(inventory);
    }
}

