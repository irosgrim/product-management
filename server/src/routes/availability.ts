import Router from 'express';
import { db } from '../db/connect';
import { ProductArticle } from '../db/types';
export const availabilityRoute = Router();

interface Dictionary<T> {
    [Key: string]: T;
}

availabilityRoute.get('/', async (req, res, next) => {
    const allProducts = await db.getAllProducts();
    const allInventory = await db.getAllInventory();

    const inventoryDictionary = allInventory.reduce((inventory: Dictionary<any>, currentInventoryItem) => {
        inventory[currentInventoryItem.art_id] = { name: currentInventoryItem.name, stock: currentInventoryItem.stock };
        return inventory;
    }, {})
    
    const mapped = allProducts.map(product => {
        let components = [];
        for(const component of product.contain_articles) {
            const inventoryStock = parseInt(inventoryDictionary[component.art_id].stock);
            const potentialAvailability = Math.floor(inventoryStock / component.amount_of);
            components = [...components, potentialAvailability];
        }
        const p = Math.min(...components);
        console.log(p);
        return {
            ...product,
            potentialAvailability: p
        };
    })
    res.send(mapped);
})

function getProductPotentialAvailability() {

}