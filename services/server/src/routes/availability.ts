import Router from 'express';
import { inMemoryProducts } from '../db/connect';
import { getProductsAndAvailability, partialStringMatch } from '../helpers/db';
import { requestType } from '../helpers/routes';
import { ProductAndAvailability } from '../types/types';
export const availabilityRoute = Router();

availabilityRoute.get('/', async (req, res) => {
    const productsAndAvailability: ProductAndAvailability[] = inMemoryProducts.map(product => {
        return getProductsAndAvailability(product);
    })

    res.send(productsAndAvailability);
})

availabilityRoute.get('/:productName', async (req, res) => {
    const productName = req.params.productName;
    const strMatchesArticleName = partialStringMatch(productName);

    const productWithAvailability: ProductAndAvailability[]= inMemoryProducts.map(product => {
        return getProductsAndAvailability(product);
    }).filter(product => strMatchesArticleName(product.name));
    if(productWithAvailability.length === 0) {
        res.send([]);
        return;
    }
    res.send(productWithAvailability);
})
