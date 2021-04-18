
import { db } from '../db/connect';

import express from 'express';
import Router from 'express';
import { requestType } from '../helpers/routes';
export const productsRoute = Router();

productsRoute.get('/', async (req, res: express.Response) => {
    const products = await db.getAllProducts();
    res.send(products);
})

productsRoute.get('/:productName', async (req, res,) => {
    const productName = req.params.productName;
    if(!productName) {
        res.status(requestType.badRequest).send();
        return;
    }
    const product =  await db.getProductsWithPartialProductName(productName);
    if(!product) {
        res.status(requestType.notFound).send();
        return;
    }
    res.send(product);
})

productsRoute.post('/buy', async (req, res) => {
    const {product, amount} = req.query;
    if(!product || !amount) {
        res.status(requestType.badRequest).send();
        return;
    }
    if(product && amount) {
        const buyProductResponse = await db.buyProduct((product as string), parseInt(amount as string))
        if(!buyProductResponse) {
            res.status(requestType.badRequest).send('NOT OK!');
            return;
        }
        res.status(requestType.ok).send('OK!');
        return;
    }
    res.status(requestType.ok).send('OK!');
}); 

