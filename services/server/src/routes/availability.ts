import Router from 'express';
import { inMemoryProducts } from '../db/connect';
import { getProductsAndAvailability } from '../helpers/db';
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
    const productWithAvailability: ProductAndAvailability | undefined= inMemoryProducts.map(product => {
        return getProductsAndAvailability(product);
    }).find(product => product.name === productName);
    if(!productWithAvailability) {
        res.status(requestType.notFound).send('NOT FOUND!');
        return;
    }
    res.send(productWithAvailability);
})
