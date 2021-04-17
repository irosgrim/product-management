
import { db } from '../db/connect';

import express from 'express';
import Router from 'express';
import { requestType } from '../helpers/routes';
export const productsRoute = Router();

productsRoute.get('/', async (req, res: express.Response, next) => {
    const products = await db.getAllProducts();
    res.send(products);
})

productsRoute.get('/:productName', async (req, res, next) => {
    const productName = req.params.productName;
    if(!productName) {
        res.status(requestType.badRequest);
    }
    const product =  await db.getProductWithProductName(productName);
    if(!product) {
        res.status(requestType.notFound);
    }
    res.send(product);
})
