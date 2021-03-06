import path from 'path';
import fs from 'fs';
import { DB} from './dbAdapter';
import { DbType, InventoryDictionary, Product } from '../types/types';
import { getInventoryAsDictionary } from '../helpers/db';
import { rootDirectoryPath } from '../index';
import { uid } from '../helpers/uid';
const inventoryFilePath = path.resolve(rootDirectoryPath + '/dbFiles/inventory.json');
const productsFilePath = path.resolve(rootDirectoryPath + '/dbFiles/products.json');

const typeOfDbToUse = process.env.DB_TYPE || 'fake';

export let inMemoryProducts: Product[] = [];
export let inMemoryInventoryDictionary: InventoryDictionary = {};
createInMemoryDB();

export const db = new DB().useDb(typeOfDbToUse as DbType);

function createInMemoryDB() {
    if(typeOfDbToUse === 'fake') {
        const parsedProducts = fs.readFileSync(productsFilePath, 'utf8');
        const parsedInventory = fs.readFileSync(inventoryFilePath, 'utf8');
        inMemoryProducts = JSON.parse(parsedProducts).products;
        const inventory = JSON.parse(parsedInventory).inventory;
        inMemoryInventoryDictionary = getInventoryAsDictionary(inventory);
    }
}

export async function insertNewProductInMemoryProduct(newProduct: Product): Promise<'OK' | undefined> {
    inMemoryProducts = await [...inMemoryProducts, newProduct];
    return 'OK';
}

export async function updateInventoryDictionaryArticle(article: {art_id: string; stock: number;}): Promise<'OK' | undefined> {
    if(inMemoryInventoryDictionary[article.art_id] && typeof article.stock === 'number') {
        inMemoryInventoryDictionary[article.art_id].stock = article.stock;
        return 'OK';
    }
}

export async function createInventoryArticle(article: {name: string, stock: number}): Promise<'OK' | undefined> {
    const newId = uid(4);
    inMemoryInventoryDictionary[newId] = {name: article.name, stock: article.stock};
    return 'OK';
}