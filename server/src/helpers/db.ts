import { inMemoryInventory } from '../db/connect';
import { InventoryDictionary, InventoryItem, Product, ProductAndAvailability } from '../types/types';

export function partialStringMatch(searchString: string): (str: string) => boolean {
    const regexp = new RegExp(searchString, 'i');
    return (str: string): boolean => {
        return regexp.test(str);
    }
}

export function getProductsAndAvailability(product: Product): ProductAndAvailability {
    let potentialAvailabilityByArticleAmount: number[] = [];
    for(const productContent of product.contain_articles) {
        const inventoryStockAmount = inMemoryInventory[productContent.art_id].stock;
        const nrOfProductsBasedOnStockAmount = Math.floor(inventoryStockAmount / productContent.amount_of);
        potentialAvailabilityByArticleAmount= [...potentialAvailabilityByArticleAmount, nrOfProductsBasedOnStockAmount];
    }
    const viableAvailability = Math.min(...potentialAvailabilityByArticleAmount);
    return {
        ...product,
        potential_availability: viableAvailability
    };
}

export function getInventoryAsDictionary(inv: InventoryItem[]): InventoryDictionary {
    const inventoryDictionary = inv.reduce((inventory: InventoryDictionary, currentInventoryItem) => {
        inventory[currentInventoryItem.art_id] = { name: currentInventoryItem.name, stock: currentInventoryItem.stock };
        return inventory;
    }, {})
    return inventoryDictionary;
}