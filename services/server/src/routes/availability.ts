import Router from 'express';
import { inMemoryProducts } from '../db/connect';
import { getProductsAndAvailability } from '../helpers/db';
import { ProductAndAvailability } from '../types/types';
export const availabilityRoute = Router();

availabilityRoute.get('/', async (req, res) => {
    const productsAndAvailability: ProductAndAvailability[] = inMemoryProducts.map(product => {
        return getProductsAndAvailability(product);
    })

    res.send(productsAndAvailability);
})
